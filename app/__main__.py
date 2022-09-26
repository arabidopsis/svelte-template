from __future__ import annotations

import os

import click

os.environ["FLASK_DEBUG"] = "0"


@click.command()
@click.option("--page", default="/", help="page to generate", show_default=True)
@click.option("--out", default="index.html", help="file to write", show_default=True)
def generate(page: str, out: str):
    from .wsgi import application

    client = application.test_client()
    resp = client.get(page)
    txt = resp.data
    with open(out, "wb") as fp:
        fp.write(txt)


if __name__ == "__main__":
    generate()
