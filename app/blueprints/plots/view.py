from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import jsonify
from flask import render_template


plots = Blueprint(
    "plots",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/plots/static",
)


@plots.route("/data")
def data():
    import time

    plot_data = [
        {
            "values": [22, 26, 52],
            "labels": ["Residential", "Non-Residential", "Utility"],
            "type": "pie",
        },
    ]
    time.sleep(5)
    return jsonify(dict(data=plot_data))


@plots.route("/google")
def google():
    import time

    plot_data = [
        ["Task", "Hours per Day"],
        ["Work", 11],
        ["Eat", 2],
        ["Commute", 2],
        ["Watch TV", 2],
        ["Sleep", 7],
    ]
    options = {
        "title": "My Weekly Activities",
    }
    time.sleep(5)
    return jsonify(dict(data=plot_data, options=options))


@plots.route("/plots")
def index():
    return render_template("plots.html")


@plots.route("/myjs.js")
def myjs():
    import time

    time.sleep(3)
    return (
        "console.log('running myjs'); window.myjs = 222;",
        200,
        {"ContentType": "application/javascript"},
    )


def init_app(app: Flask) -> None:
    from ...flask_utils import add_link, Link

    add_link(
        app,
        Link(name="Charts", endpoint="plots.index", fa="fa-solid fa-chart-line"),
    )
    app.register_blueprint(plots)
