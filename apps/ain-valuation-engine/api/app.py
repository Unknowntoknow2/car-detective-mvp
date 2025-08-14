from __future__ import annotations

import os
import re
import requests
from flask import Flask, jsonify
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

HTTP_TIMEOUT = float(os.getenv("HTTP_TIMEOUT", "6"))
UA = {"User-Agent": "ain-valuation-engine/1.0"}

# ---------- helpers ------------------------------------------------------------
def _json_get(url: str, params: dict | None = None) -> dict:
    r = requests.get(url, params=params or {}, headers=UA, timeout=HTTP_TIMEOUT)
    r.raise_for_status()
    return r.json()

def _normalize_vin(vin: str) -> str:
    vin = (vin or "").strip().upper()
    # minimal VIN sanity, don't block—just keep behavior predictable
    if not re.fullmatch(r"[A-HJ-NPR-Z0-9]{11,17}", vin):
        # still accept, but caller may see empty decode from vPIC
        pass
    return vin

# ---------- error envelope -----------------------------------------------------
@app.errorhandler(Exception)
def handle_error(e: Exception):
    status = int(e.code) if isinstance(e, HTTPException) and hasattr(e, "code") else 500
    payload = {
        "error": "internal_error" if status >= 500 else "bad_request",
        "details": {"message": str(e)},
    }
    resp = jsonify(payload)
    resp.status_code = status
    return resp

# ---------- discoverability ----------------------------------------------------
@app.get("/")
@app.get("/api")
def api_index():
    return {
        "name": "Vehicle Data API",
        "endpoints": [
            "/api/v1/health",
            "/api/v1/version",
            "/api/v1/openapi.json",
            "/api/ping",
            "/api/v1/identity/{vin}",
            "/api/v1/safety/{vin}"
        ],
    }

# ---------- health & version ---------------------------------------------------
@app.get("/api/v1/health")
def health():
    return {"ok": True}

@app.get("/api/v1/version")
def version():
    ver = os.getenv("VERCEL_GIT_COMMIT_SHA") or os.getenv("GIT_SHA") or "dev"
    return {"service": "vehicle-platform", "version": ver}

# ---------- openapi (stub) -----------------------------------------------------
@app.get("/api/v1/openapi.json")
def openapi():
    return {
        "openapi": "3.0.0",
        "info": {"title": "Vehicle API", "version": "v1"},
        "paths": {
            "/api/v1/health": {"get": {"summary": "Health check"}},
            "/api/v1/version": {"get": {"summary": "Service version"}},
            "/api/ping": {"get": {"summary": "Simple ping"}},
            "/api/v1/identity/{vin}": {"get": {"summary": "VIN decode (vPIC)"}},
            "/api/v1/safety/{vin}": {"get": {"summary": "NHTSA ratings + recalls"}}
        },
    }

@app.get("/api/ping")
def ping():
    return {"ok": True, "path": "/api/ping"}

# ---------- v1: identity (vPIC) -----------------------------------------------
@app.get("/api/v1/identity/<vin>")
def identity(vin: str):
    vin = _normalize_vin(vin)
    data = _json_get(
        f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/{vin}",
        params={"format": "json"},
    )
    res = (data.get("Results") or [{}])[0]

    identity = {
        "vin": vin,
        "make": res.get("Make") or None,
        "model": res.get("Model") or None,
        "year": _safe_int(res.get("ModelYear")),
        "trim": res.get("Trim") or None,
        "bodyClass": res.get("BodyClass") or None,
        "driveType": res.get("DriveType") or None,
        "engine": {
            "model": res.get("EngineModel") or None,
            "cylinders": _safe_int(res.get("EngineCylinders")),
            "displacementL": _safe_float(res.get("DisplacementL")),
            "hp": _safe_float(res.get("EngineHP")),
            "fuelType": res.get("FuelTypePrimary") or None,
        },
        "transmission": {
            "style": res.get("TransmissionStyle") or None,
            "speeds": _safe_int(res.get("TransmissionSpeeds")),
        },
        "plantCountry": res.get("PlantCountry") or None,
        "raw": res,  # keep for debugging until we finalize mapping
    }
    return identity

# ---------- v1: safety (NHTSA ratings + recalls) ------------------------------
@app.get("/api/v1/safety/<vin>")
def safety(vin: str):
    vin = _normalize_vin(vin)

    # 1) recall-by-vin (precise)
    recalls = []
    try:
        rec = _json_get(
            "https://api.nhtsa.gov/recalls/recallsByVin",
            params={"vin": vin},
        )
        recalls = rec.get("results") or []
    except Exception:
        recalls = []

    # 2) use decode to get year/make/model → ratings
    ident = identity(vin)
    year = ident.get("year")
    make = (ident.get("make") or "").strip()
    model = (ident.get("model") or "").strip()

    ratings = {}
    if year and make and model:
        try:
            # search for vehicle IDs for Y/M/M
            listing = _json_get(
                f"https://api.nhtsa.gov/SafetyRatings/modelyear/{year}/make/{make}/model/{model}"
            )
            vehicles = listing.get("Results") or []
            # pick first candidate; optionally refine by VehicleDescription/trim later
            vid = vehicles[0].get("VehicleId") if vehicles else None
            detail = {}
            if vid:
                detail = _json_get(
                    f"https://api.nhtsa.gov/SafetyRatings/VehicleId/{vid}"
                )
                detail = (detail.get("Results") or [{}])[0]
            ratings = {
                "searchResults": vehicles,
                "selectedVehicleId": vid,
                "overall": detail.get("OverallRating"),
                "front": detail.get("OverallFrontCrashRating"),
                "side": detail.get("OverallSideCrashRating"),
                "rollover": detail.get("RolloverRating"),
                "raw": detail,
            }
        except Exception:
            ratings = {}

    return {
        "vin": vin,
        "identity": {
            "year": year,
            "make": make,
            "model": model,
            "trim": ident.get("trim"),
        },
        "nhtsa": ratings,
        "recalls": recalls,
    }

# ---------- small parsing helpers ---------------------------------------------
def _safe_int(v):
    try:
        return int(v) if v not in (None, "", "0", "0.0") else None
    except Exception:
        return None

def _safe_float(v):
    try:
        return float(v) if v not in (None, "", "0", "0.0") else None
    except Exception:
        return None
