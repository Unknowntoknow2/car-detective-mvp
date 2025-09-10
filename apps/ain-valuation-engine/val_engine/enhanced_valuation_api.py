#!/usr/bin/env python3
from __future__ import annotations
import os
import json
import math
from typing import List, Optional, Any, Dict
from dataclasses import asdict

from flask import Flask, request, jsonify
from pydantic import BaseModel, Field, ValidationError, field_validator

# Optional .env, will not crash if missing
try:
    from dotenv import load_dotenv  # type: ignore
    load_dotenv()
except Exception:
    pass

import pandas as pd
from val_engine.pipeline_loader import load_pipeline, PipelineLoadError

# --------- Pydantic request schema (aligns with train_tabular.py) ---------
class ValuationRow(BaseModel):
    mileage: float
    year: int
    owner_count: int = Field(ge=0)
    engine_hp: float
    mpg_city: float
    mpg_highway: float

    make: str
    model: str
    trim: str
    drivetrain: str
    fuel_type: str
    transmission: str
    exterior_color: str
    interior_color: str
    state: str
    zip_region: str

    @field_validator("zip_region")
    @classmethod
    def ensure_zip_like(cls, v: str) -> str:
        # loose check; model is agnostic but we keep basic hygiene
        if len(v) < 3:
            raise ValueError("zip_region must be a short region token (e.g., '900xx', '941xx').")
        return v

class PredictRequest(BaseModel):
    rows: List[ValuationRow]

# --------- App & model loading ---------
app = Flask(__name__)

PIPE, META = (None, None)

def ensure_model_loaded():
    global PIPE, META
    if PIPE is None:
        try:
            PIPE, META = load_pipeline(os.environ.get("AIN_MODEL_BUNDLE", "artifacts/model_bundle.joblib"))
        except PipelineLoadError as e:
            raise RuntimeError(f"Bundle not found: {e}") from e
        except Exception as e:
            raise RuntimeError(f"Unexpected error while loading bundle: {e}") from e
    return PIPE, META

# --------- Routes ---------
@app.get("/health")
def health():
    try:
        _, meta = ensure_model_loaded()
        return jsonify({
            "status": "ok",
            "bundle_path": meta.get("path"),
            "bundle_keys": meta.get("bundle_keys"),
            "metadata": meta.get("metadata", {}),
        })
    except Exception as e:
        return jsonify({"status": "error", "detail": str(e)}), 500

@app.post("/predict")
def predict():
    try:
        req_json = request.get_json(force=True)
        pr = PredictRequest(**req_json)
    except ValidationError as ve:
        return jsonify({"status": "bad_request", "errors": json.loads(ve.json())}), 400
    except Exception as e:
        return jsonify({"status": "bad_request", "detail": f"Invalid JSON: {e}"}), 400

    pipe, meta = ensure_model_loaded()
    # Convert rows to DataFrame preserving keys
    rows_dicts: List[Dict[str, Any]] = [r.model_dump() for r in pr.rows]
    df = pd.DataFrame(rows_dicts)

    try:
        preds = pipe.predict(df)
        out = [float(x) for x in preds]
        # sanity: no NaNs or inf
        for i, v in enumerate(out):
            if math.isnan(v) or math.isinf(v):
                return jsonify({"status": "error", "detail": f"Invalid prediction at index {i}: {v}"}), 500
    except Exception as e:
        return jsonify({"status": "error", "detail": f"Inference failed: {e}"}), 500

    return jsonify({
        "status": "ok",
        "n": len(out),
        "bundle": {"path": meta.get("path"), "keys": meta.get("bundle_keys"), "metadata": meta.get("metadata", {})},
        "predictions": out
    })

if __name__ == "__main__":
    # Dev server (not for production)
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 8000)))
