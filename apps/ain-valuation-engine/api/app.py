from __future__ import annotations

import os
from typing import Any, Dict

from flask import Flask, jsonify, Request
from werkzeug.exceptions import HTTPException

# -----------------------------------------------------------------------------
# Flask app
# -----------------------------------------------------------------------------
app = Flask(__name__)

# -----------------------------------------------------------------------------
# Error envelope (always JSON)
# -----------------------------------------------------------------------------
@app.errorhandler(Exception)
def handle_error(e: Exception):
    """
    Return a JSON error envelope and a proper HTTP status code.
    Designed to satisfy Flask & type checkers (no tuple return).
    """
    status = e.code if isinstance(e, HTTPException) and hasattr(e, "code") else 500
    payload = {
        "error": "internal_error" if int(status) >= 500 else "bad_request",
        "details": {"message": str(e)},
    }
    resp = jsonify(payload)
    resp.status_code = int(status)
    return resp

# -----------------------------------------------------------------------------
# Discoverability (/ and /api)
# -----------------------------------------------------------------------------
@app.get("/")
@app.get("/api")
def api_index():
    return {
        "name": "Vehicle Data API",
        "endpoints": [
            "/api/v1/health",
            "/api/v1/version",
            "/api/v1/openapi.json",
            "/api/ping"
        ]
    }

# -----------------------------------------------------------------------------
# Health & version
# -----------------------------------------------------------------------------
@app.get("/api/v1/health")
def health():
    return {"ok": True}

@app.get("/api/v1/version")
def version():
    # Vercel provides VERCEL_GIT_COMMIT_SHA at runtime if available
    ver = (
        os.getenv("VERCEL_GIT_COMMIT_SHA")
        or os.getenv("GIT_SHA")
        or "dev"
    )
    return {"service": "vehicle-platform", "version": ver}

# -----------------------------------------------------------------------------
# Minimal OpenAPI stub (so tools have something to read)
# -----------------------------------------------------------------------------
@app.get("/api/v1/openapi.json")
def openapi():
    return {
        "openapi": "3.0.0",
        "info": {"title": "Vehicle API", "version": "v1"},
        "paths": {
            "/api/v1/health": {"get": {"summary": "Health check"}},
            "/api/v1/version": {"get": {"summary": "Service version"}},
            "/api/ping": {"get": {"summary": "Simple ping"}}
        }
    }

# -----------------------------------------------------------------------------
# Simple ping (replaces old serverless ping.py)
# -----------------------------------------------------------------------------
@app.get("/api/ping")
def ping():
    return {"ok": True, "path": "/api/ping"}

# -----------------------------------------------------------------------------
# (Optional) placeholder for future safety endpoint
# -----------------------------------------------------------------------------
# @app.get("/api/v1/safety/<string:vin>")
# def safety_stub(vin: str):
#     return {"error": "not_implemented", "details": {"vin": vin}}, 501
