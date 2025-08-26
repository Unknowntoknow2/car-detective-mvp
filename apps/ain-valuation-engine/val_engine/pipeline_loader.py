#!/usr/bin/env python3
from __future__ import annotations
import os
import joblib
from pathlib import Path
from typing import Any, Dict, Tuple

DEFAULT_BUNDLE = Path(os.environ.get("AIN_MODEL_BUNDLE", "artifacts/model_bundle.joblib"))

class PipelineLoadError(RuntimeError):
    pass

def load_pipeline(bundle_path: str | Path = DEFAULT_BUNDLE) -> Tuple[Any, Dict[str, Any]]:
    """
    Deterministic loader:
      - Loads a joblib artifact that MUST be a dict with a 'pipe' key.
      - Returns (pipe, bundle_metadata).
      - Provides backward-compat for legacy bare Pipeline artifacts, but warns.
    """
    path = Path(bundle_path)
    if not path.exists():
        raise PipelineLoadError(f"Bundle not found at: {path.resolve()}")

    obj = joblib.load(path)
    if isinstance(obj, dict) and "pipe" in obj:
        md = obj.get("metadata", {})
        return obj["pipe"], {"metadata": md, "bundle_keys": list(obj.keys()), "path": str(path)}

    # Legacy fallback (bare Pipeline) — loadable but not future-proof
    return obj, {"metadata": {"note": "legacy pipeline (no bundle['pipe'])"}, "bundle_keys": [], "path": str(path)}
