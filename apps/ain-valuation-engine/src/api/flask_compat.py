from __future__ import annotations
from typing import Callable
from flask import Flask
def safe_before_first_request(app: Flask):
    def decorator(func: Callable[[], None]):
        if hasattr(app, "before_app_first_request"):
            app.before_app_first_request(func)  # type: ignore[attr-defined]
            return func
        func()
        return func
    return decorator
