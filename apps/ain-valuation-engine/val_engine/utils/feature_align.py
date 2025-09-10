import pandas as pd
import numpy as np
from typing import Dict, List

# Legacy → Canonical aliases (expand over time as needed)
ALIASES = {
    "accident_count": "accidents",
    "accidents_count": "accidents",
    "composite_condition_score": "condition_score",
    "condition_rating": "condition_score",
    "title_brand": "title_status",
    "cpo": "certified_pre_owned",
    "certified": "certified_pre_owned",
    "body_style": "epa_body",
    # zip variants
    "zip_code": "zip",
    "zipcode": "zip",
}

NUMERIC_DEFAULT = 0.0
CATEG_DEFAULT   = ""

def apply_aliases(df: pd.DataFrame) -> pd.DataFrame:
    ren = {}
    cols = set(df.columns)
    for old, new in ALIASES.items():
        if old in cols and new not in cols:
            ren[old] = new
    if ren:
        df = df.rename(columns=ren)
    return df

def align_to_spec(df: pd.DataFrame, spec: Dict) -> pd.DataFrame:
    df = apply_aliases(df).copy()
    feat_order: List[str] = spec.get("feature_order") or (spec.get("numeric_cols", []) + spec.get("cat_cols", []))
    numeric = set(spec.get("numeric_cols", []))
    categorical = set(spec.get("cat_cols", []))
    wanted = set(feat_order)
    drop_cols = [c for c in df.columns if c not in wanted]
    if drop_cols:
        df = df.drop(columns=drop_cols, errors="ignore")
    for c in feat_order:
        if c not in df.columns:
            if c in numeric:
                df[c] = NUMERIC_DEFAULT
            else:
                df[c] = CATEG_DEFAULT
    for c in numeric:
        if c in df.columns:
            df[c] = pd.to_numeric(df[c], errors="coerce").fillna(NUMERIC_DEFAULT)
    df = df[feat_order]
    return df
