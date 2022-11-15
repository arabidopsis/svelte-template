from __future__ import annotations

from flask import Flask
from werkzeug.middleware.proxy_fix import ProxyFix

from .flask_utils import config_app
from .flask_utils import register_bytecode_cache
from .flask_utils import register_filters
from .logger import init_email_logger
from .utils import git_version


def create_init_app() -> Flask:
    app = Flask(
        __name__.split()[0],
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

    return app


def create_app() -> Flask:
    app = create_init_app()
    init_full_app(app)
    return app


def init_full_app(app: Flask) -> None:

    init_email_logger(app)  # email logger requires config.ADMINS = [email]

    # agg, cairo, pdf, pgf, ps, svg, template

    # matplotlib.use(app.config["BACKEND"], force=True)

    from .index_view import init_app as init_index

    init_index(app)

    from .commands.view import init_app as init_cmd

    init_cmd(app)

    register_filters(app)

    register_bytecode_cache(app)
