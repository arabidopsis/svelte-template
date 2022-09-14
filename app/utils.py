from __future__ import annotations

import math
import subprocess

from pathlib import Path
from shutil import which
from typing import Any

from markupsafe import escape


def git_version() -> str | None:

    git = which("git")
    if git is None:
        return None
    cwd = Path(__file__).parent
    r = subprocess.run(
        [git, "rev-parse", "HEAD"],
        stdout=subprocess.PIPE,
        check=False,
        stderr=subprocess.DEVNULL,
        cwd=cwd,
    )
    if r.returncode or not r.stdout:
        return None
    return r.stdout.decode("ascii")[:-1]


def attrstr(kwargs: dict[str, Any]) -> str:
    attrs = " ".join(
        f'{escape(k.replace("_","-"))}="{escape(v)}"'
        for k, v in kwargs.items()
        if v is not None
    )
    if attrs:
        attrs += " "
    return attrs


def human(num: int, suffix: str = "B", scale: int = 1) -> str:
    if not num:
        return f"0{suffix}"
    num *= scale
    magnitude = int(math.floor(math.log(abs(num), 1000)))
    val = num / math.pow(1000, magnitude)
    if magnitude > 7:
        return f"{val:.1f}Y{suffix}"
    e = ["", "k", "M", "G", "T", "P", "E", "Z"][magnitude]
    if not e:
        return f"{int(num)}{suffix}"
    return f"{val:3.1f}{e}{suffix}"


def rmfiles(files: list[str]) -> None:
    for f in files:
        try:
            Path(f).unlink()
        except OSError:
            pass

