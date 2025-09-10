from dataclasses import dataclass
from typing import Dict, List, Tuple

import numpy as np
from engine.confidence import ConfidenceInputs, confidence_score, confidence_label, band_from_label
from engine.comps_selector import select_comps
from engine.comps_filter import filter_comps, RawComp

@dataclass
class Comp:
    price: float
    mileage: int
    distance_km: float
    days_old: int

@dataclass
class ReliabilityInputs:
    k_comps: int
    freshness_days: float     # median days old across comps
    dispersion_mad: float     # MAD of comp prices
    completeness: float       # [0..1], share of non-missing features
    history_verified: bool
    condition_available: bool

@dataclass
class BlendConfig:
    w_ml_min: float
    w_ml_max: float
    w_comp_min: float
    w_comp_max: float

@dataclass
class WeightsConfig:
    reliability: Dict
    blend_weights: BlendConfig

def _piecewise_score(x: float, breaks: List[float], increasing: bool) -> float:
    """
    Map x into [0..1] using 4 breakpoints (0..3 segments).
    increasing=True means higher x => higher score.
    """
    b = breaks
    x = max(min(x, b[-1]), b[0])
    # Normalize to segment
    if x <= b[1]:
        t = (x - b[0]) / (b[1] - b[0] + 1e-9)
        s = t
    elif x <= b[2]:
        t = (x - b[1]) / (b[2] - b[1] + 1e-9)
        s = 1.0 * t + 1.0  # 1..2
    else:
        t = (x - b[2]) / (b[3] - b[2] + 1e-9)
        s = 2.0 * t + 2.0  # 2..3
    s_norm = s / 3.0
    return s_norm if increasing else (1.0 - s_norm)

def reliability_score(rel_in: ReliabilityInputs, wcfg: WeightsConfig) -> float:
    r = wcfg.reliability
    s_k   = _piecewise_score(rel_in.k_comps,            r["k_comps_breakpoints"],           increasing=True)
    s_fr  = _piecewise_score(rel_in.freshness_days,     r["freshness_days_breakpoints"],    increasing=False)
    s_mad = _piecewise_score(rel_in.dispersion_mad,     r["dispersion_mad_breakpoints"],    increasing=False)
    s_cmp = rel_in.completeness
    s_hist = 1.0 if rel_in.history_verified else 0.6
    s_cond = 1.0 if rel_in.condition_available else 0.7
    return float(np.clip(0.25*s_k + 0.20*s_fr + 0.20*s_mad + 0.15*s_cmp + 0.10*s_hist + 0.10*s_cond, 0.0, 1.0))

def comp_median(comps: List[Comp]) -> Tuple[float, float]:
    prices = np.array([c.price for c in comps], dtype=float)
    median = float(np.median(prices))
    mad = float(np.median(np.abs(prices - median)))
    return median, mad

def compute_blend_weights(rel_score: float, bwcfg: BlendConfig) -> Tuple[float, float]:
    # Heavier ML when reliability is high; otherwise prefer median comps.
    w_ml = bwcfg.w_ml_min + (bwcfg.w_ml_max - bwcfg.w_ml_min) * rel_score
    w_comp = 1.0 - w_ml
    return float(np.clip(w_ml, bwcfg.w_ml_min, bwcfg.w_ml_max)), float(np.clip(w_comp, bwcfg.w_comp_min, bwcfg.w_comp_max))

def hybrid_price(p_ml: float, comps: List[Comp], rel_score: float, wcfg: WeightsConfig) -> Dict:
    # Deterministic comp selection (Step 2 integration)
    if not comps or len(comps) == 0:
        raise ValueError("No comps supplied to hybrid_price. Use fallback path.")
    subject_mileage = comps[0].mileage if hasattr(comps[0], 'mileage') else 0
    weights_cfg = wcfg.reliability if hasattr(wcfg, 'reliability') else wcfg
    selected_comps = select_comps(comps, subject_mileage, weights_cfg)
    kept_comps, removals, stats = filter_comps(
        comps=selected_comps,
        cfg=weights_cfg,
        max_mileage_delta_pct=weights_cfg["filters"]["comps"]["max_mileage_delta_pct"],
    )
    if len(kept_comps) == 0:
        raise ValueError("No comps remain after selection/filtering. Use fallback path.")
    median_price, mad = comp_median(kept_comps)
    w_ml, w_comp = compute_blend_weights(rel_score, wcfg.blend_weights)
    p_final = w_ml * p_ml + w_comp * median_price

    # --- Confidence scoring, labeling, banding ---
    feature_completeness = 1.0  # TODO: compute actual completeness upstream
    history_ok = True           # TODO: pass actual value
    condition_ok = True         # TODO: pass actual value
    method_tag = "blended"     # TODO: set based on pipeline context
    cin = ConfidenceInputs(
        k_comps=len(kept_comps),
        freshness_days_med=np.median([c.days_old for c in kept_comps]) if kept_comps else 30.0,
        dispersion_mad=stats["mad"] if stats["mad"] is not None else 3000.0,
        completeness=feature_completeness,
        history_verified=history_ok,
        condition_available=condition_ok,
        method_tag=method_tag,
    )
    conf_score = confidence_score(weights_cfg, cin)
    conf_label = confidence_label(weights_cfg, conf_score)
    band_low, band_high = band_from_label(weights_cfg, p_final, conf_label)

    return {
        "price": float(p_final),
        "comp_median": float(median_price),
        "comp_mad": float(mad),
        "w_ml": float(w_ml),
        "w_comp": float(w_comp),
        "selected_comps": [vars(c) for c in selected_comps],
        "kept_comps": [vars(c) for c in kept_comps],
        "removals": [vars(r) for r in removals],
        "stats": stats,
        # --- Confidence audit fields ---
        "confidence_score": conf_score,
        "confidence_label": conf_label,
        "band_low": band_low,
        "band_high": band_high,
    }

def fallback_price(msrp: float, age_years: float, mileage: int, condition_proxy: float, cfg: Dict, salvage=False, rebuilt=False, is_ev=False, soh_known=True) -> float:
    # Simple depreciation curve: MSRP * (1 - d)^age - mileage_penalty + condition_delta
    d = 0.15 if age_years <= 1 else 0.12 if age_years <= 3 else 0.10 if age_years <= 7 else 0.08
    base = msrp * (1.0 - d) ** max(0, age_years)
    mileage_penalty = 0.02 * (mileage / 12000.0) * base  # ~2% per 12k miles (rough prior)
    condition_delta = (condition_proxy - 0.5) * 0.08 * base  # ±8% swing at extremes
    price = base - mileage_penalty + condition_delta

    # Title adjustments
    if salvage:
        price *= (1.0 - max(cfg["fallback_curve"]["salvage_discount_floor"], 0.25))
    elif rebuilt:
        price *= (1.0 - max(cfg["fallback_curve"]["rebuilt_discount_floor"], 0.15))

    # EV SoH unknown penalty
    if is_ev and not soh_known:
        price *= (1.0 - cfg["fallback_curve"]["ev_penalty_if_no_soh"])

    return float(max(1000.0, price))  # floor

def apply_band(price: float, conf_label: str, bands_cfg: Dict) -> Tuple[float, float]:
    low_pct, high_pct = {
        "High":  bands_cfg["bands_pct"]["high"],
        "Medium":bands_cfg["bands_pct"]["medium"],
        "Low":   bands_cfg["bands_pct"]["low"],
    }[conf_label]
    return float(price * (1.0 - low_pct)), float(price * (1.0 + high_pct))
