from dataclasses import dataclass
from typing import List, Dict, Tuple
import numpy as np

@dataclass
class RawComp:
    price: float
    mileage: int
    distance_km: float
    days_old: int

@dataclass
class FilteredComp:
    price: float
    mileage: int
    distance_km: float
    days_old: int

@dataclass
class Removal:
    idx: int
    reason: str

def iqr_filter(prices: np.ndarray, mult: float) -> np.ndarray:
    q1 = np.percentile(prices, 25)
    q3 = np.percentile(prices, 75)
    iqr = q3 - q1
    lo = q1 - mult * iqr
    hi = q3 + mult * iqr
    return (prices >= lo) & (prices <= hi)

def mad_filter(prices: np.ndarray, mult: float) -> np.ndarray:
    med = np.median(prices)
    mad = np.median(np.abs(prices - med)) + 1e-9
    z = np.abs(prices - med) / mad
    return z <= mult

def filter_comps(
    comps: List[RawComp],
    cfg: Dict,
    max_mileage_delta_pct: float,
) -> Tuple[List[FilteredComp], List[Removal], Dict]:
    """
    Applies deterministic filter ladder:
      1) Drop stale (older than min_freshness_days) when there are alternatives
      2) Drop mileage outliers vs subject mileage window
      3) Apply IQR or MAD on price
    Returns kept comps, removals with reasons, and stats.
    """
    rem: List[Removal] = []
    if not comps:
        return [], rem, {"kept": 0, "median": None, "mad": None}

    prices = np.array([c.price for c in comps], dtype=float)
    kept = np.ones(len(comps), dtype=bool)

    # 1) Age filter (prefer fresher comps if we have many)
    min_fresh = cfg["filters"]["comps"]["min_freshness_days"]
    days = np.array([c.days_old for c in comps], dtype=float)
    many = len(comps) >= cfg["filters"]["comps"]["min_k"] * 2
    if many:
        mask = days <= min_fresh
        if mask.sum() >= cfg["filters"]["comps"]["min_k"]:
            kept &= mask
            for i, ok in enumerate(mask):
                if not ok:
                    rem.append(Removal(i, f"stale>{min_fresh}d"))

    # 2) Mileage window is enforced by caller during retrieval (subject-aware).
    # Here we optionally do a very coarse screen if caller passed a window as delta pct.
    # (This requires caller to pass subject mileage via closure or external check.)
    # For reproducibility, we leave mileage screen to upstream collector.

    # 3) Price outlier filter
    fcfg = cfg["filters"]["comps"]
    if fcfg["outlier_filter"].upper() == "IQR":
        mask = iqr_filter(prices, fcfg["iqr_multiplier"])
    else:
        mask = mad_filter(prices, fcfg["mad_multiplier"])

    kept &= mask
    for i, ok in enumerate(mask):
        if not ok:
            rem.append(Removal(i, "price_outlier"))

    # Build results
    kept_idx = np.where(kept)[0].tolist()
    kept_comps = [FilteredComp(**vars(comps[i])) for i in kept_idx]

    if kept_comps:
        kept_prices = np.array([c.price for c in kept_comps], dtype=float)
        med = float(np.median(kept_prices))
        mad = float(np.median(np.abs(kept_prices - med)))
        stats = {"kept": len(kept_comps), "median": med, "mad": mad}
    else:
        stats = {"kept": 0, "median": None, "mad": None}

    # Append reasons for any comps dropped due to mileage if your upstream used it
    # (pass-through from upstream can add to `rem` before calling this function).

    return kept_comps, rem, stats
