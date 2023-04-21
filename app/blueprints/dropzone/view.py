from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import render_template
from flask import request


dropzone = Blueprint(
    "dropzone",
    __name__,
    template_folder="templates",
    static_folder="static",
    static_url_path="/dropzone/static",
)


@dropzone.route("/dropzone")
def index():
    return render_template("dropzone.html", delay=1000)


@dropzone.route("/dropzone-upload", methods=["POST"])
def fetch():
    file = request.files["file"]
    print("found file", file)
    return file.filename


def init_app(app: Flask) -> None:
    app.register_blueprint(dropzone)
