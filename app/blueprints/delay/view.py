from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import jsonify
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
    return render_template("delay.html", delay=1000)


@delay.route("/fetch/<int:pubmed>")
def fetch(pubmed: int):
    return jsonify(dict(result=pubmed * 10))


def init_app(app: Flask) -> None:
    from ...flask_utils import add_link, Link

    add_link(
        app,
        Link(name="Delay", endpoint="delay.index", fa="fa-solid fa-person-running"),
    )
    app.register_blueprint(delay)
