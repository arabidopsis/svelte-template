from __future__ import annotations

import os
import sys

from flask import abort
from flask import Blueprint
from flask import Flask
from flask import render_template
from flask import request
from flask import Response
from flask import session

from .cmd import command_iterator

cmd = Blueprint(
    "command",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/cmd/static",
)


@cmd.route("/command")
def index():
    return render_template("command.html")


@cmd.route("/runcommand")
def runcommand() -> Response:
    killit(session.get("pid"))
    # -u for unbuffered IO
    return command_iterator([sys.executable, "-u", "-m", "app.blueprints.commands"])


def killit(pid: int | None) -> None:
    from signal import SIGINT

    if pid is None:
        return
    try:
        os.kill(pid, SIGINT)
    except ProcessLookupError:
        pass
    if "pid" in session:
        del session["pid"]


@cmd.route("/runcommand/kill")
def kill() -> str:
    # very dangerous!

    pid: int | None = request.values.get("pid", type=int)
    if pid is not None and pid == session.get("pid"):
        killit(pid)
        return "KILLED"
    else:
        abort(404)


def init_app(app: Flask) -> None:
    app.register_blueprint(cmd)
