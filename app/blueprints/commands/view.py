from __future__ import annotations

import sys

from flask import abort
from flask import Blueprint
from flask import Flask
from flask import render_template
from flask import request
from flask import Response
from flask import session

from ...flask_utils import add_link
from ...flask_utils import Link
from .cmd import command_iterator
from .cmd import killprocess

cmd = Blueprint(
    "command",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/commands/static",
)


@cmd.route("/command")
def index():
    return render_template("command.html")


@cmd.route("/runcommand")
def runcommand() -> Response:
    # killprocess(session.get("pid"))
    # -u for unbuffered IO
    return command_iterator([sys.executable, "-u", "-m", "app.blueprints.commands"])


@cmd.route("/runcommand/kill")
def kill() -> str:
    # very dangerous!

    pid: int | None = request.values.get("pid", type=int)
    if pid is not None and pid == session.get("pid"):
        killprocess(pid)
        return "KILLED"
    else:
        abort(404)


def init_app(app: Flask) -> None:

    if app.secret_key is None:
        raise RuntimeError("need SECRET_KEY for session object")
    add_link(
        app,
        Link(name="Command", endpoint="command.index", fa="fa-solid fa-terminal"),
    )
    app.register_blueprint(cmd)
