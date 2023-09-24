from __future__ import annotations

from typing import BinaryIO

import click


@click.command()
@click.option("--debug", is_flag=True, help="generate debug version of page")
@click.option("--page", default="/", help="page to generate", show_default=True)
@click.option(
    "--out",
    default="index.html",
    help="file to write",
    show_default=True,
    type=click.File("wb"),
)
def generate(page: str, out: BinaryIO, debug: bool):
    from .wsgi import application

    application.debug = debug

    with application.test_client() as client:
        resp = client.get(page)
        txt = resp.data
        click.secho(f"writing: {out.name}", fg="green")
        out.write(txt)


if __name__ == "__main__":
    generate()  # pylint: ignore=no-value-for-parameter
