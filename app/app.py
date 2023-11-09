from __future__ import annotations

import importlib
from pathlib import Path

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from .flask_utils import config_app
from .flask_utils import NAME
from .flask_utils import register_bytecode_cache
from .flask_utils import register_filters
from .index_view import init_app as init_index
from .logger import init_email_logger
from .utils import git_version


def create_init_app() -> Flask:
    app = Flask(
        NAME,
        instance_relative_config=True,
        template_folder="templates",
    )

    config_app(app.config)

    app.config["GIT_VERSION"] = git_version() or ""
    if app.debug:
        # avoid caching ...
        app.config["SEND_FILE_MAX_AGE_DEFAULT"] = 0

    if app.config.get("PROXY_FIX", False):
        app.wsgi_app = ProxyFix(app.wsgi_app)  # type: ignore[assignment]

    @app.context_processor
    def base():
        return dict(
            base_template=app.config["BASE_TEMPLATE"],
            links=app.extensions.get("links", []),
        )

    return app


def create_app() -> Flask:
    app = create_init_app()
    init_full_app(app)
    cli(app)
    return app


def init_blueprints(app: Flask) -> None:
    blueprints = Path(app.root_path) / "blueprints"
    if not blueprints.is_dir():
        return

    name = app.name.split(".")[0]
    for d in blueprints.iterdir():
        if not d.is_dir() or d.name == "__pycache__":
            continue
        try:
            m = importlib.import_module(f"{name}.blueprints.{d.name}.view")
            init_app = getattr(m, "init_app", None)
            if init_app is not None:
                init_app(app)
        except ImportError:
            app.logger.error('can\'t import blueprint "%s"', d.name)


def init_full_app(app: Flask) -> None:
    init_email_logger(app)  # email logger requires config.ADMINS = [email]

    init_index(app)

    init_blueprints(app)

    register_filters(app)

    register_bytecode_cache(app)


def cli(app: Flask):
    import click
    from typing import BinaryIO

    @app.cli.command("page")
    @click.option("--debug", is_flag=True, help="generate debug version of page")
    @click.option("--page", default="/", help="page to generate", show_default=True)
    @click.option(
        "--out",
        default="index.html",
        help="file to write",
        show_default=True,
        type=click.File("wb"),
    )
    def page(page: str, out: BinaryIO, debug: bool) -> None:
        """Generate static page from flask app"""
        with app.test_client() as client:
            resp = client.get(page)
            txt = resp.data
            click.secho(f"writing: {out.name}", fg="green")
            out.write(txt)
