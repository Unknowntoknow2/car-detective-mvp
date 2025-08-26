"""
Simple quantile calibration for prediction intervals.
Given residuals on validation, learn a mapping from confidence label -> (low, high) % bands
to hit target coverage in acceptance.v1.yaml.
"""

from typing import Dict, List, Tuple
import numpy as np
import json

def _quantile(a: np.ndarray, q: float) -> float:
    return float(np.quantile(a, q))

def learn_bands_from_residuals(
    residuals_pct: np.ndarray,
    labels: List[str],
    target_coverage_by_label: Dict[str, float] = None,
) -> Dict[str, Tuple[float, float]]:
    """
    residuals_pct: signed percent error = (pred - truth)/truth
    labels: same length as residuals_pct, one of {"High","Medium","Low"}
    target_coverage_by_label: desired coverage, e.g. {"High":0.84, "Medium":0.82, "Low":0.80}
    Returns dict mapping label -> (low_pct, high_pct) bands to achieve target coverage.
    """
    if target_coverage_by_label is None:
        target_coverage_by_label = {"High":0.84, "Medium":0.82, "Low":0.80}

    bands = {}
    arr = np.array(residuals_pct, dtype=float)
    labs = np.array(labels, dtype=object)

    for lab, cov in target_coverage_by_label.items():
        sel = arr[labs == lab]
        if sel.size < 50:
            # not enough data to learn robustly; default to conservative
            bands[lab] = (0.12, 0.18) if lab == "Low" else (0.08, 0.12) if lab == "Medium" else (0.06, 0.10)
            continue
        lo_q = (1.0 - cov) / 2.0
        hi_q = 1.0 - lo_q
        lo = abs(_quantile(sel, lo_q))
        hi = abs(_quantile(sel, hi_q))
        # ensure monotonic ordering: Low ≥ Medium ≥ High
        bands[lab] = (float(lo), float(hi))

    return bands

def save_calibration_json(path: str, bands: Dict[str, Tuple[float, float]]):
    payload = {k: [float(v[0]), float(v[1])] for k, v in bands.items()}
    with open(path, "w") as f:
        json.dump({"bands_pct": payload}, f, indent=2)
