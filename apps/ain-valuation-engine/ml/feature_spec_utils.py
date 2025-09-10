import json
import logging
import numpy as np
import pandas as pd

logger = logging.getLogger(__name__)

def save_feature_spec(features: pd.DataFrame, path: str):
    """
    Save the feature columns, order, and dtypes as a spec.
    """
    feature_spec = {
        "columns": list(features.columns),
        "dtypes": {col: str(features[col].dtype) for col in features.columns}
    }
    with open(path, "w") as f:
        json.dump(feature_spec, f)
    logger.info(f"Feature spec saved to {path}")

def load_feature_spec(path: str):
    """
    Load a feature spec from disk.
    """
    with open(path, "r") as f:
        return json.load(f)

def align_features_to_spec(df: pd.DataFrame, feature_spec: dict) -> pd.DataFrame:
    """
    Ensure df has columns in the same order and types as feature_spec.
    Add missing columns (fill with 0 or 'Unknown'), reorder, and cast dtypes.
    """
    aligned = df.copy()
    for col in feature_spec["columns"]:
        if col not in aligned.columns:
            # Guess fill value based on dtype
            if "float" in feature_spec["dtypes"][col] or "int" in feature_spec["dtypes"][col]:
                aligned[col] = 0
            else:
                aligned[col] = "Unknown"
            logger.warning(f"Added missing column '{col}' with default fill.")
    # Remove extra columns
    extra = [col for col in aligned.columns if col not in feature_spec["columns"]]
    if extra:
        logger.warning(f"Dropping unexpected columns at inference: {extra}")
        aligned = aligned.drop(columns=extra)
    # Reorder and cast types
    aligned = aligned[feature_spec["columns"]]
    for col, dtype in feature_spec["dtypes"].items():
        try:
            aligned[col] = aligned[col].astype(dtype)
        except Exception as e:
            logger.error(f"Could not cast column {col} to {dtype}: {e}")
    return aligned
