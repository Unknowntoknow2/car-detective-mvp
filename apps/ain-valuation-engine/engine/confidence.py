from dataclasses import dataclass
from typing import Dict

@dataclass
class ConfidenceInputs:
    k_comps: int                 # number of comps after filtering
    freshness_days_med: float    # median days-old of comps
    dispersion_mad: float        # MAD of comp prices
    completeness: float          # [0..1], non-missing feature share
    history_verified: bool
    condition_available: bool
    method_tag: str              # "live" | "blended" | "fallback_pricing"

def _clamp(x, lo, hi):
    return max(lo, min(hi, x))

def _piecewise_score(x: float, breaks, increasing=True) -> float:
    b = breaks
    x = _clamp(x, b[0], b[-1])
    if x <= b[1]:
        t = (x - b[0]) / (b[1] - b[0] + 1e-9)
        s = t
    elif x <= b[2]:
        t = (x - b[1]) / (b[2] - b[1] + 1e-9)
        s = 1.0 + t  # 1..2
    else:
        t = (x - b[2]) / (b[3] - b[2] + 1e-9)
        s = 2.0 + t  # 2..3
    s = s / 3.0
    return s if increasing else (1.0 - s)

def confidence_score(cfg: Dict, cin: ConfidenceInputs) -> float:
    r = cfg["reliability"]
    s_k   = _piecewise_score(cin.k_comps,           r["k_comps_breakpoints"],           True)
    s_fr  = _piecewise_score(cin.freshness_days_med,r["freshness_days_breakpoints"],    False)
    s_mad = _piecewise_score(cin.dispersion_mad,    r["dispersion_mad_breakpoints"],    False)
    s_cmp = _clamp(cin.completeness, 0.0, 1.0)
    s_hist= 1.0 if cin.history_verified else 0.6
    s_cond= 1.0 if cin.condition_available else 0.7

    raw = 0.25*s_k + 0.20*s_fr + 0.20*s_mad + 0.15*s_cmp + 0.10*s_hist + 0.10*s_cond
    score = _clamp(raw, 0.0, 1.0)

    # Method-level caps
    if cin.method_tag == "fallback_pricing":
        score = min(score, cfg["confidence"]["cap_low_confidence"])  # e.g., 0.60

    return float(score)

def confidence_label(cfg: Dict, score: float) -> str:
    hi = cfg["confidence"]["high_threshold"]
    md = cfg["confidence"]["medium_threshold"]
    if score >= hi: return "High"
    if score >= md: return "Medium"
    return "Low"

def band_from_label(cfg: Dict, price: float, label: str):
    bands = cfg["confidence"]["bands_pct"]
    lo_pct, hi_pct = {
        "High": bands["high"],
        "Medium": bands["medium"],
        "Low": bands["low"],
    }[label]
    return float(price * (1.0 - lo_pct)), float(price * (1.0 + hi_pct))
