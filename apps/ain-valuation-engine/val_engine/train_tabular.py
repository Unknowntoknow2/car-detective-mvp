#!/usr/bin/env python3
import os
os.environ.setdefault("PYTHONHASHSEED", "0")  # hash-stable
import random
random.seed(42)
import numpy as np
np.random.seed(42)

import json
import time
import joblib
import pandas as pd
from pathlib import Path
from typing import List, Tuple, Dict

from sklearn import set_config
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.impute import SimpleImputer
from sklearn.linear_model import Ridge
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.model_selection import train_test_split

# AIN loaders (confirmed complete per project notes)
# Adjust import path if your utils live elsewhere
from val_engine.utils.data_loader import load_training_data  # <- uses your canonical loader

RANDOM_STATE = 42
set_config(transform_output="pandas")  # Stable, explicit DataFrame outputs

# ---- Feature config (adjust if your schema differs) ----
TARGET_COL = "price"  # change to your label
NUMERIC_COLS: List[str] = [
    "mileage",
    "year",
]
CATEGORICAL_COLS: List[str] = [
    "make",
    "model",
    "condition",
    "zipcode",
]

def make_preprocessor() -> ColumnTransformer:
    numeric_pipe = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="median")),
        ("scaler", StandardScaler(with_mean=True, with_std=True))
    ])
    cat_pipe = Pipeline(steps=[
        ("imputer", SimpleImputer(strategy="most_frequent")),
        ("ohe", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
    ])
    # Use public ColumnTransformer API; avoid private remainders
    pre = ColumnTransformer(
        transformers=[
            ("num", numeric_pipe, NUMERIC_COLS),
            ("cat", cat_pipe, CATEGORICAL_COLS),
        ],
        remainder="drop",  # explicit; no hidden/private remainder classes
        verbose_feature_names_out=False
    )
    return pre

def make_model():
    # Use a simple, stable model here; swap to your prod model if needed
    return Ridge(alpha=2.0, random_state=RANDOM_STATE)

def build_pipeline() -> Pipeline:
    return Pipeline(steps=[
        ("pre", make_preprocessor()),
        ("model", make_model())
    ])

def metrics(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    mae = mean_absolute_error(y_true, y_pred)
    rmse = mean_squared_error(y_true, y_pred, squared=False)
    mape = float(np.mean(np.abs((y_true - y_pred) / np.clip(np.abs(y_true), 1e-6, None))) * 100.0)
    return {"mae": float(mae), "rmse": float(rmse), "mape": float(mape)}

def train_and_save_bundle(
    output_path: str = "artifacts/model_bundle.joblib",
    test_size: float = 0.2,
    random_state: int = RANDOM_STATE
) -> str:
    df: pd.DataFrame = load_training_data()
    if TARGET_COL not in df.columns:
        raise ValueError(f"Target column '{TARGET_COL}' not found in training dataframe.")

    X = df.drop(columns=[TARGET_COL])
    y = df[TARGET_COL].astype(float)

    X_train, X_val, y_train, y_val = train_test_split(
        X, y, test_size=test_size, random_state=random_state, shuffle=True
    )

    pipe = build_pipeline()
    pipe.fit(X_train, y_train)

    y_pred = pipe.predict(X_val)
    m = metrics(y_val.values, y_pred)

    bundle = {
        "pipe": pipe,
        "metrics": m,
        "feature_config": {
            "numeric": NUMERIC_COLS,
            "categorical": CATEGORICAL_COLS,
            "target": TARGET_COL,
        },
        "metadata": {
            "created_at_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "random_state": random_state,
            "versions": {
                "python": "{}.{}.{}".format(*os.sys.version_info[:3]),
                "pandas": pd.__version__,
                "numpy": np.__version__,
                "sklearn": __import__("sklearn").__version__,
                "joblib": joblib.__version__,
            }
        }
    }

    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(bundle, output_path)
    print("Saved bundle to:", output_path)
    print("Validation metrics:", json.dumps(m, indent=2))
    return output_path

if __name__ == "__main__":
    train_and_save_bundle()
