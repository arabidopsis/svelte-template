from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import render_template


nunjucks = Blueprint(
    "nunjucks",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/nunjucks/static",
)


@nunjucks.route("/nunjucks")
def index():
    html = render_template(
        "nunjucks/fragment.html",
        somelist=[1, 2, 3, 5, 6],
        somestring="jinja2 is great",
    )
    return render_template("nunjucks.html", html=html)


def init_app(app: Flask) -> None:
    from ...flask_utils import add_link, Link

    app.jinja_env.globals["NUNJUCKS"] = "https://mozilla.github.io/nunjucks/"

    add_link(
        app,
        Link(
            name="Nunjucks",
            endpoint="nunjucks.index",
            fa="fa-regular fa-file-powerpoint",
        ),
    )
    app.register_blueprint(nunjucks)
