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

from flask import json
from flask import Response
from flask import session


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
                while 1:
                    line = stream.readline()
                    q.put(line)
                    if not line:
                        break

            t1 = threading.Thread(target=reader, args=(self._cmd.stdout,))
            t1.setDaemon(True)
            t2 = threading.Thread(target=reader, args=(self._cmd.stderr,))
            t2.setDaemon(True)
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


def eventstream(f):
    @wraps(f)
    def new_func(*args, **kwargs) -> Response:
        def generate():
            for event in chain(f(*args, **kwargs), (None,)):
                yield ("data: %s\n\n" % json.dumps(event)).encode()

        return Response(
            generate(),
            mimetype="text/event-stream",
            direct_passthrough=True,
        )

    return new_func


def command_iterator(
    argline: list[str],
    cwd: str | None = None,
    env: dict[str, str] | None = None,
) -> Response:
    cmd = Command(argline, env=env, cwd=cwd)
    session["pid"] = cmd.pid

    @eventstream
    def generator():
        try:
            yield {"kind": "pid", "pid": cmd.pid}
            for event in cmd.output:
                yield {"kind": "line", "line": event}
            yield {"kind": "retcode", "retcode": cmd.returncode}
        except Exception as e:
            yield {"kind": "error", "msg": f"Error: {e}"}

    return generator()
