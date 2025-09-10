import json, numpy as np
from collections import defaultdict

def bucket_for(row):
    # compact, explainable buckets
    trim = str(row.get("trim",""))
    is_hybrid = ("HYBRID" in trim.upper()) or (str(row.get("fuel_type",""))).lower()=="hybrid"
    bucket = (int(row.get("year",0)), "HYB" if is_hybrid else "GAS")
    return bucket

def quantiles_for_residuals(y_true, y_pred, X_rows, eps=0.10):
    """Return global q and per-bucket q (|residual| (1-eps) quantile)."""
    res = np.abs(np.array(y_true) - np.array(y_pred))
    q_global = float(np.quantile(res, 1.0 - eps))
    by_bucket = defaultdict(list)
    for r, x in zip(res, X_rows):
        by_bucket[bucket_for(x)].append(float(r))
    q_bucket = {}
    for b, vals in by_bucket.items():
        if len(vals) >= 50:  # need a bit of mass
            q_bucket[str(b)] = float(np.quantile(vals, 1.0 - eps))
    return {"eps": eps, "q_global": q_global, "q_bucket": q_bucket}

def load_conformal(path):
    try:
        with open(path) as f: return json.load(f)
    except Exception:
        return None

def interval_for(pred, xrow, conf):
    if not conf: return (float(pred), float(pred))
    q = conf.get("q_global", 0.0)
    qb = conf.get("q_bucket", {})
    qb_val = qb.get(str(bucket_for(xrow)))
    if qb_val is not None: q = qb_val
    return (float(pred) - q, float(pred) + q)
