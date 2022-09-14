from __future__ import annotations

import gzip
from os.path import abspath
from os.path import isabs
from os.path import join
from os.path import normpath
from pathlib import Path
from typing import Any

import toml
from flask import current_app
from flask import Flask
from flask import Markup
from flask import render_template
from flask import Response
from flask import stream_with_context, url_for
from flask.config import Config
from flask.scaffold import find_package
from jinja2 import FileSystemBytecodeCache
from jinja2 import FileSystemLoader
from jinja2 import TemplateNotFound

from .utils import attrstr
from .utils import human

NAME = __name__.split(".")[0]


def error_resp(msg: str, code: int) -> Response:
    return Response(msg, code, mimetype="text/plain")


def stream_template(template_name: str, **context) -> Response:
    current_app.update_template_context(context)
    template = current_app.jinja_env.get_template(template_name)
    rv = template.stream(context)
    # rv.disable_buffering()
    rv.enable_buffering(5)
    return Response(stream_with_context(rv))


def auto_find_instance_path(name: str = NAME) -> str:
    # cut'n'paste from flask
    prefix, package_path = find_package(name)
    if prefix is None:
        return join(package_path, "instance")
    return join(prefix, "var", f"{name}-instance")


def init_config(name: str = NAME) -> Config:
    # assumes that instance_relative_config=True is set for Flask app too
    instance_path = normpath(abspath(auto_find_instance_path(name)))
    return Config(instance_path)


def dedottify(d: dict[str, Any]) -> dict[str, Any]:
    ret = {}
    for k, v in d.items():
        if isinstance(v, dict):
            v = dedottify(v)
        if "." not in k:
            ret[k] = v
        else:
            *path, k = k.split(".")
            d = ret
            for p in path:
                if p in d:
                    d = d[p]
                    assert isinstance(d, dict)
                else:
                    o: dict[str, Any] = {}
                    d[p] = o
                    d = o
            d[k] = v
    return ret


def merge_dict(d1: dict, d2: dict) -> dict:
    for k, v2 in dedottify(d2).items():
        if k not in d1:
            d1[k] = v2
        else:
            v1 = d1[k]
            if isinstance(v1, dict) and isinstance(v2, dict):
                d1[k] = merge_dict(v1, v2)
            else:
                d1[k] = v2  # overwrite with v2

    return d1


def config_app(config: Config) -> Config:
    config.from_object(f"{NAME}.config")
    config.from_pyfile(f"{NAME}.cfg", silent=True)
    if "CELERY" in config and "CELERY_CONFIG" in config:
        merge_dict(config["CELERY_CONFIG"], config.pop("CELERY"))

    return config


def create_and_config(name: str = NAME) -> Config:
    return config_app(init_config(name))


def register_bytecode_cache(app: Flask, directory="bytecode_cache") -> None:
    if not isabs(directory):
        cache = Path(join(app.instance_path, directory))
    else:
        cache = Path(directory)

    if not cache.is_dir():
        cache.mkdir(exist_ok=True, parents=True)
    app.jinja_options.update(
        {"bytecode_cache": FileSystemBytecodeCache(str(cache))},
    )


def register_filters(app: Flask) -> None:
    """Register page not found filters cdn_js, cdn_css methods."""

    with app.open_resource("cdn.toml", "rt") as fp:
        CDN = toml.load(fp)

    def include_raw(filename: str) -> Markup:
        loader: FileSystemLoader = app.jinja_loader  # type: ignore
        if loader is None:
            raise TemplateNotFound(filename)
        if filename.endswith((".gz", ".svgz")):
            for path in loader.searchpath:
                f = Path(path).joinpath(filename)
                if f.is_file():
                    with gzip.open(f, "rt", encoding="utf8") as fp:
                        return Markup(fp.read())
            raise TemplateNotFound(filename)

        src = loader.get_source(app.jinja_env, filename)[0]

        return Markup(src)

    def cdn_js(key, **kwargs):
        js = CDN[key]["js"]
        async_ = "async" if js.get("async", False) else ""
        attrs = attrstr(kwargs)
        integrity = js.get("integrity")
        integrity = f'integrity="{integrity}"' if integrity else ""

        return Markup(
            f"""<script src="{js['src']}" {async_}
            {integrity} {attrs}crossorigin="anonymous"></script>""",
        )

    def cdn_css(key, **kwargs):
        css = CDN[key]["css"]
        attrs = attrstr(kwargs)
        integrity = css.get("integrity")
        integrity = f'integrity="{integrity}"' if integrity else ""
        return Markup(
            f"""<link rel="stylesheet" href="{css['href']}"
            {integrity} {attrs}crossorigin="anonymous">""",
        )

    assets = app.config["ASSET_FOLDER"]

    def svelte_css(mod: str) -> str:
        return url_for("static", filename=join(assets, f"{mod}.css"))

    def svelte_js(mod: str) -> str:
        return url_for("static", filename=join(assets, f"{mod}.js"))

    # for nunjucks includes
    app.jinja_env.globals["include_raw"] = include_raw
    app.jinja_env.globals["cdn_js"] = cdn_js
    app.jinja_env.globals["cdn_css"] = cdn_css
    app.jinja_env.globals["svelte_css"] = svelte_css
    app.jinja_env.globals["svelte_js"] = svelte_js

    app.template_filter("human")(human)

    @app.template_filter()
    def split(
        s: str,
        sep: str | None = None,
    ) -> list[str]:  # pylint: disable=unused-variable
        return [] if not s else (s.split(sep) if sep is not None else s.split())

    @app.errorhandler(404)
    def page_not_found(e):  # pylint: disable=unused-variable
        return render_template("errors/404.html"), 404
