from __future__ import annotations

import gzip
from dataclasses import dataclass
from os.path import abspath
from os.path import isabs
from os.path import join
from os.path import normpath
from pathlib import Path
from random import random
from typing import Any
from typing import Iterator

import toml
from flask import current_app
from flask import Flask
from flask import render_template
from flask import Response
from flask import stream_with_context
from flask import url_for
from flask.config import Config
from flask.scaffold import find_package
from jinja2 import FileSystemBytecodeCache
from jinja2 import FileSystemLoader
from jinja2 import TemplateNotFound
from markupsafe import Markup

from .utils import attrstr
from .utils import human

NAME = __name__.split(".", maxsplit=1)[0]


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


def register_filters(app: Flask) -> None:  # noqa: C901
    """Register page not found filters cdn_js, cdn_css methods."""

    with app.open_resource("cdn.toml", "rt") as fp:
        CDN = toml.load(fp)

    def include_raw(filename: str) -> Markup:
        def markup(loader: FileSystemLoader | None) -> Markup | None:
            if loader is None:
                return None
            for path in loader.searchpath:
                f = Path(path).joinpath(filename)
                if f.is_file():
                    with gzip.open(f, "rt", encoding="utf8") as fp:
                        return Markup(fp.read())
            return None

        def get_loaders() -> Iterator[FileSystemLoader]:
            loader: FileSystemLoader | None = app.jinja_loader  # type: ignore
            if loader is not None:
                yield loader

            for blueprint in app.iter_blueprints():
                loader = blueprint.jinja_loader
                if loader is not None:
                    yield loader

        if filename.endswith((".gz", ".svgz")):
            for loader in get_loaders():
                ret = markup(loader)
                if ret is not None:
                    return ret
            raise TemplateNotFound(filename)

        ldr = app.jinja_env.loader
        if ldr is None:
            raise TemplateNotFound(filename)
        src = ldr.get_source(app.jinja_env, filename)[0]
        return Markup(src)

    def cdn_js(key: str, **kwargs: str) -> Markup:
        js = CDN[key]["js"]
        async_ = "async" if js.get("async", False) else ""

        integrity = js.get("integrity")
        if integrity:
            kwargs.setdefault("integrity", integrity)

        kwargs.setdefault("crossorigin", "anonymous")
        kwargs.setdefault("referrerpolicy", "no-referrer")

        attrs = attrstr(kwargs)

        return Markup(
            f"""<script src="{js['src']}" {async_} {attrs}></script>""",
        )

    def cdn_css(key: str, **kwargs: str) -> Markup:
        css = CDN[key]["css"]
        integrity = css.get("integrity")
        if integrity:
            kwargs.setdefault("integrity", integrity)

        kwargs.setdefault("crossorigin", "anonymous")
        kwargs.setdefault("referrerpolicy", "no-referrer")
        attrs = attrstr(kwargs)
        return Markup(
            f"""<link rel="stylesheet" href="{css['href']}" {attrs}>""",
        )

    assets = app.config["ASSET_FOLDER"]
    version = app.config["VERSION"]

    def getversion():
        return {"v": f"v{random()}" if app.debug else version}

    def svelte_css(mod: str, endpoint: str = "static") -> Markup:
        url = url_for(endpoint, filename=join(assets, f"{mod}.css"), **getversion())
        return Markup(f'<link rel="stylesheet" href="{url}"/>')

    def svelte_js(
        mod: str,
        endpoint: str = "static",
        module: str | None = None,
        **kwargs: str,
    ) -> Markup:
        filename = join(assets, f"{mod}.js")
        url = url_for(endpoint, filename=filename, **getversion())
        if module is not None:  # should only be 'module'
            kwargs["type"] = module
        attrs = attrstr(kwargs)
        return Markup(f'<script defer {attrs} src="{url}"></script>')

    app.jinja_env.globals["include_raw"] = include_raw
    app.jinja_env.globals["cdn_js"] = cdn_js
    app.jinja_env.globals["cdn_css"] = cdn_css
    app.jinja_env.globals["svelte_css"] = svelte_css
    app.jinja_env.globals["svelte_js"] = svelte_js

    app.template_filter("human")(human)

    # missing filter :(
    @app.template_filter()
    def split(
        s: str,
        sep: str | None = None,
    ) -> list[str]:  # pylint: disable=unused-variable
        return [] if not s else (s.split(sep) if sep is not None else s.split())

    @app.errorhandler(404)
    def page_not_found(e):  # pylint: disable=unused-variable
        return render_template("errors/404.html"), 404


@dataclass
class Link:
    name: str
    endpoint: str
    fa: str | None = None


def add_link(app: Flask, link: Link) -> None:
    if "links" not in app.extensions:
        app.extensions["links"] = links = []
    else:
        links = app.extensions["links"]
    links.append(link)
