from __future__ import annotations

import os
import sys

from flask import abort
from flask import Blueprint
from flask import Flask
from flask import render_template
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
    # -u for unbuffered IO
    return command_iterator([sys.executable, "-u", "-m", "app.blueprints.commands"])


@cmd.route("/runcommand/kill/<int:pid>")
def kill(pid: int) -> str:
    # very dangerous!
    from signal import SIGINT

    if pid == session.get("pid"):

        os.kill(pid, SIGINT)
        del session["pid"]
        return "KILLED"
    else:
        abort(404)


def init_app(app: Flask) -> None:
    app.register_blueprint(cmd)
