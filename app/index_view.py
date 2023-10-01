from __future__ import annotations

from pathlib import Path

from flask import Blueprint
from flask import Flask
from flask import render_template
from flask import Response
from flask import send_from_directory


view = Blueprint("view", __name__)


@view.route("/")
def index() -> str:
    return render_template("index.html")


@view.route("/favicon.ico")
def favicon() -> Response:
    return send_from_directory(Path("static", "img"), "svelte-blue.svg")


def init_app(app: Flask, url_prefix: str = "/") -> None:
    app.register_blueprint(view, url_prefix=url_prefix)
