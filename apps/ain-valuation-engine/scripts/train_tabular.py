print("[DEBUG] train_tabular.py executing from:", __file__)
import os
print("[DEBUG] os module:", os)

import os
import argparse
import json
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.ensemble import GradientBoostingRegressor
import joblib
import numpy as np
from sklearn.base import BaseEstimator, TransformerMixin
from ml.feature_spec_utils import save_feature_spec

# ---- Cardinality guardrails ----
MAX_OHE_UNIQUES = 30         # lower cap for OHE
EXCLUDE_CATS = {"vin"}       # never encode these

class FrequencyEncoder(BaseEstimator, TransformerMixin):
    """Maps each categorical value to its frequency in training.
    Returns a single numeric column. Unseen values at inference get 0.
    """
    def __init__(self):
        self.freqs_ = None
        self.default_ = 0.0

    def fit(self, X, y=None):
        s = pd.Series(X.iloc[:, 0] if hasattr(X, "iloc") else X[:, 0]).astype(str)
        counts = s.value_counts(dropna=False)
        total = float(counts.sum()) if counts.sum() else 1.0
        self.freqs_ = (counts / total).to_dict()
        return self

    def transform(self, X):
        s = pd.Series(X.iloc[:, 0] if hasattr(X, "iloc") else X[:, 0]).astype(str)
        return np.array([[self.freqs_.get(v, self.default_)] for v in s])

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--data", required=True)
    ap.add_argument("--target", default="price")
    ap.add_argument("--save-pipeline", required=True)
    ap.add_argument("--test-size", type=float, default=0.2)
    ap.add_argument("--min-train-rows", type=int, default=1000)
    ap.add_argument("--metrics-out", default=None)
    args = ap.parse_args()

    if args.data.endswith(".parquet"):
        df = pd.read_parquet(args.data)
    elif args.data.endswith(".json"):
        with open(args.data, "r") as f:
            data = json.load(f)
        # If top-level is a dict with 'listings', use that
        if isinstance(data, dict) and "listings" in data:
            df = pd.DataFrame(data["listings"])
        else:
            df = pd.DataFrame(data)
    else:
        df = pd.read_csv(args.data)
    if args.target not in df.columns:
        raise SystemExit(f"Target column '{args.target}' not in dataset.")

    df = df.dropna(subset=[args.target])
    y = df[args.target].astype(float)
    X = df.drop(columns=[args.target]).copy()
    # Save feature spec before fitting (ensure correct path)
    feature_spec_path = os.path.join(os.path.dirname(args.save_pipeline), "feature_spec.json")
    save_feature_spec(X, feature_spec_path)
    # ------------------ Feature selection (numeric + categorical with cardinality guards) ------------------
    # Numeric features (keep as before, include engineered)
    candidate_numeric = [
        "year","mileage","age","age_mileage_ratio","condition_score",
        "accidents","owners",
        "epa_mpg_combined","fuel_cost_index",
        "warranty_basic_months_left","warranty_powertrain_months_left",
        "warranty_basic_miles_left","warranty_powertrain_miles_left"
    ]
    numeric_cols = [c for c in candidate_numeric if c in X.columns]

    # Candidate categoricals (DO NOT include 'vin')
    candidate_cats = [
        "make","model","trim","fuel_type","transmission","drive_type","engine_cyl",
        "title_status","zip3","state","region","city","epa_fuel_type","epa_body"
    ]
    candidate_cats = [c for c in candidate_cats if c in X.columns and c not in EXCLUDE_CATS]


    # Compute cardinalities
    card = {c: int(X[c].nunique(dropna=False)) for c in candidate_cats}

    # Force these columns to frequency encoding regardless of cardinality
    force_freq = {"model", "region", "city", "trim"}
    low_card_cols  = [c for c,k in card.items() if k <= MAX_OHE_UNIQUES and c not in force_freq]
    high_card_cols = [c for c,k in card.items() if k >  MAX_OHE_UNIQUES or c in force_freq]

    print(json.dumps({
        "cardinality_summary": {c: card[c] for c in sorted(card)},
        "low_card_ohe": low_card_cols,
        "high_card_freq": high_card_cols
    }, indent=2))

    # Build ColumnTransformer:
    #  - numeric passthrough
    #  - OHE for low-card categoricals
    #  - frequency encoder per high-card column (each returns 1 numeric column)
    ct_transformers = [
        ("num", "passthrough", numeric_cols),
    ]
    if low_card_cols:
        ct_transformers.append(
            ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False), low_card_cols)
        )
    for col in high_card_cols:
        ct_transformers.append((f"freq_{col}", FrequencyEncoder(), [col]))

    pre = Pipeline([
        ("coltx", ColumnTransformer(
            transformers=ct_transformers,
            remainder="drop"
        )),
        ("final_impute", SimpleImputer(strategy="constant", fill_value=0))
    ])

    if len(X) < args.min_train_rows:
        raise SystemExit(f"Refusing to train: only {len(X)} rows (< {args.min_train_rows}). Provide a larger dataset.")


    # --- split train/calib/test ---
    from sklearn.model_selection import train_test_split
    X_full, y_full = X, y
    X_train, X_tmp, y_train, y_tmp = train_test_split(X_full, y_full, test_size=0.40, random_state=42)
    X_calib, X_test, y_calib, y_test = train_test_split(X_tmp, y_tmp, test_size=0.50, random_state=42)

    from sklearn.ensemble import HistGradientBoostingRegressor as HGBR
    model = HGBR(random_state=42, max_depth=None, learning_rate=0.05, max_iter=300)
    pipe = Pipeline(steps=[("pre", pre), ("gbm", model)])
    pipe.fit(X_train, y_train)

    preds = pipe.predict(X_test)
    mae = float(mean_absolute_error(y_test, preds))
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    r2 = float(r2_score(y_test, preds))

    # --- conformal quantiles (90%) ---
    from val_engine.utils.conformal import quantiles_for_residuals
    Xc_rows = X_calib.to_dict(orient="records")
    y_pred_calib = pipe.predict(X_calib)
    conf = quantiles_for_residuals(y_calib, y_pred_calib, Xc_rows, eps=0.10)
    os.makedirs("artifacts", exist_ok=True)
    with open("artifacts/conformal.json","w") as f:
        json.dump(conf, f, indent=2)
    print("Saved conformal quantiles -> artifacts/conformal.json")

    os.makedirs(os.path.dirname(args.save_pipeline), exist_ok=True)
    # Save the full pipeline and version for robust inference
    import sklearn
    bundle = {
        "pipe": pipe,
        "model": pipe,
        "version": sklearn.__version__,
    }
    joblib.dump(bundle, args.save_pipeline)
    # --- Save feature spec contract ---
    spec = {
        "feature_order": X.columns.tolist(),
        "numeric_cols": [c for c in X.columns if str(X[c].dtype).startswith(('float', 'int'))],
        "cat_cols": [c for c in X.columns if c not in [c for c in X.columns if str(X[c].dtype).startswith(('float', 'int'))]],
        "version": "v1"
    }
    with open("artifacts/feature_spec.json", "w") as f:
        json.dump(spec, f, indent=2)
    print("Saved feature spec -> artifacts/feature_spec.json")

    metrics = {"rows": len(X), "test_size": args.test_size, "mae": mae, "rmse": rmse, "r2": r2}
    print(json.dumps(metrics, indent=2))

    if args.metrics_out:
        with open(args.metrics_out, "w") as f:
            json.dump(metrics, f, indent=2)

if __name__ == "__main__":
    main()
