from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import render_template


forms = Blueprint(
    "forms",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/forms/static",
)


@forms.route("/forms")
def index():
    return render_template("forms.html")


@forms.route("/insertform")
def insertform():
    return render_template("insertform.html")


def init_app(app: Flask) -> None:
    from ...flask_utils import add_link, Link

    add_link(
        app,
        Link(name="Forms", endpoint="forms.index", fa="fa-regular fa-rectangle-list"),
    )
    app.register_blueprint(forms)
