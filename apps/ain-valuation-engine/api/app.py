from __future__ import annotations

import os
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

# --- JSON error envelope ------------------------------------------------------
@app.errorhandler(Exception)
def handle_error(e: Exception):
    status = e.code if isinstance(e, HTTPException) and hasattr(e, "code") else 500
    payload = {
        "error": "internal_error" if int(status) >= 500 else "bad_request",
        "details": {"message": str(e)},
    }
    resp = jsonify(payload)
    resp.status_code = int(status)
    return resp

# --- Discoverability ----------------------------------------------------------
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

# --- Health & Version ---------------------------------------------------------
@app.get("/api/v1/health")
def health():
    return {"ok": True}

@app.get("/api/v1/version")
def version():
    ver = os.getenv("VERCEL_GIT_COMMIT_SHA") or os.getenv("GIT_SHA") or "dev"
    return {"service": "vehicle-platform", "version": ver}

# --- OpenAPI stub -------------------------------------------------------------
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

# --- Simple ping --------------------------------------------------------------
@app.get("/api/ping")
def ping():
    return {"ok": True, "path": "/api/ping"}
