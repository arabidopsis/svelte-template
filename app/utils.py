from __future__ import annotations

import math
import subprocess
from pathlib import Path
from shutil import which
from typing import Any

from markupsafe import escape


def git_version() -> str | None:
    """return git version of this repo -- if any"""

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
        text=True,
    )
    if r.returncode or not r.stdout:
        return None
    return r.stdout.strip()


def attrstr(kwargs: dict[str, Any]) -> str:
    def attr(k, v):
        k = f'{escape(k.replace("_","-"))}'
        if v is None:  # assume boolean
            return k
        return f'{k}="{escape(v)}"'

    attrs = " ".join(attr(k, v) for k, v in kwargs.items())
    return attrs


def human(num: int, suffix: str = "B", scale: int = 1) -> str:
    """human readable version of a file size"""
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


def mtime(filename: str) -> float:
    path = Path(filename)
    if path.exists():
        return path.stat().st_mtime
    return 0.0


def isfileupdated(filename: str, time: float) -> bool:
    return mtime(filename) > time
