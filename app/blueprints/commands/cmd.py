from __future__ import annotations

import os
import queue
import select
import subprocess
import threading
from functools import wraps
from itertools import chain
from typing import Any
from typing import Iterator

from flask import abort
from flask import json
from flask import request
from flask import Response
from flask import session
from flask import stream_with_context


class Command:
    def __init__(
        self,
        argline: list[str],
        cwd: str | None = None,
        env: dict[str, str] | None = None,
        capture: bool = True,
        silent: bool = False,
    ):
        environ = dict(os.environ)
        if env:
            environ.update(env)
        kwargs: dict[str, Any] = {"cwd": cwd, "env": environ}
        if silent:
            kwargs["stdout"] = subprocess.DEVNULL
            kwargs["stderr"] = subprocess.DEVNULL
            capture = False
        elif capture:
            kwargs["stdout"] = subprocess.PIPE
            kwargs["stderr"] = subprocess.PIPE
        self.capture = capture
        self._cmd = subprocess.Popen(argline, **kwargs)

    def terminate(self):
        self._cmd.terminate()

    def wait(self) -> int:
        returncode = self._cmd.wait()
        return returncode

    @property
    def returncode(self) -> int:
        return self._cmd.returncode

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, tb):
        self._cmd.wait()

    def __iter__(self):
        if not self.capture:
            raise RuntimeError("Not capturing")

        # Windows platforms do not have select() for files
        if os.name == "nt":
            q = queue.Queue()

            def reader(stream):
                while True:
                    line = stream.readline()
                    q.put(line)
                    if not line:
                        break

            t1 = threading.Thread(target=reader, args=(self._cmd.stdout,))
            t1.daemon = True
            t2 = threading.Thread(target=reader, args=(self._cmd.stderr,))
            t2.daemon = True
            t1.start()
            t2.start()
            outstanding = 2
            while outstanding:
                item = q.get()
                if not item:
                    outstanding -= 1
                else:
                    yield item.rstrip().decode("utf-8", "replace")

        # Otherwise we can go with select()
        else:
            streams = [self._cmd.stdout, self._cmd.stderr]
            while streams:
                for fps in select.select(streams, [], streams):
                    for stream in fps:
                        line = stream.readline()
                        if not line:
                            if stream in streams:
                                streams.remove(stream)
                            break
                        yield line.rstrip().decode("utf-8", "replace")

    def safe_iter(self) -> Iterator[str]:
        with self:
            yield from self

    @property
    def output(self) -> Iterator[str]:
        return self.safe_iter()

    @property
    def pid(self) -> int:
        return self._cmd.pid


def eventstream(func):
    @wraps(func)
    def new_func(*args, **kwargs) -> Response:
        if "text/event-stream" not in request.accept_mimetypes:
            abort(400)

        def generate() -> Iterator[bytes]:
            for event in chain(func(*args, **kwargs), (None,)):
                data = json.dumps(event)
                yield f"data: {data}\n\n".encode()

        resp = Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            direct_passthrough=True,
            headers={
                "Cache-Control": "no-cache",
                #           'Transfer-Encoding': 'chunked'
            },
        )
        # resp.timeout = None
        return resp

    return new_func


def command_iterator(
    argline: list[str],
    cwd: str | None = None,
    env: dict[str, str] | None = None,
) -> Response:
    cmd = Command(argline, env=env, cwd=cwd)
    session["pid"] = cmd.pid
    # see Message type in src/cmd.d.ts

    @eventstream
    def generator():
        try:
            yield {"kind": "pid", "pid": cmd.pid}
            for line in cmd.output:
                yield {"kind": "line", "line": line}

            yield {"kind": "retcode", "retcode": cmd.returncode}
        except Exception as e:
            yield {"kind": "error", "msg": f"Error: {e}"}
        # can only delete session[pid] here because we have have stream_with_context
        finally:
            if "pid" in session:
                del session["pid"]

    return generator()


def killprocess(pid: int | None) -> None:
    from signal import SIGINT

    if pid is None:
        return
    try:
        os.kill(pid, SIGINT)
    except ProcessLookupError:
        pass
    if "pid" in session:
        del session["pid"]
