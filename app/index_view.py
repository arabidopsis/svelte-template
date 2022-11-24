from __future__ import annotations

from flask import Blueprint
from flask import Flask
from flask import render_template


view = Blueprint("view", __name__)


@view.route("/")
def index() -> str:
    return render_template("index.html")


def init_app(app: Flask, url_prefix: str = "/") -> None:
    if app.debug and app.config["RELOADER"] > 0:
        from flask import request, jsonify, abort
        from .utils import isfileupdated

        @view.route("/checkjs", methods=["POST"])
        def checkjs():
            a = request.json
            if "path" not in a or "mtime" not in a:
                abort(404)
            path, mtime = a["path"], a["mtime"]
            needsupdate = isfileupdated(path, mtime)
            return jsonify({"status": "OK", "needsupdate": needsupdate})

    app.register_blueprint(view, url_prefix=url_prefix)
