from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import render_template


view = Blueprint("view", __name__)


@view.route("/")
def index() -> str:
    return render_template("index.html")




def init_app(app: Flask, url_prefix: str = "/") -> None:

    app.register_blueprint(view, url_prefix=url_prefix)
