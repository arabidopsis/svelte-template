from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import render_template


delay = Blueprint(
    "delay",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/delay/static",
)


@delay.route("/delay")
def index():
    return render_template("delay.html")


def init_app(app: Flask) -> None:
    app.register_blueprint(delay)
