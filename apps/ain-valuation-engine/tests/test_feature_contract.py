from pathlib import Path
from val_engine.pipeline_loader import load_pipeline

BUNDLE = Path("artifacts/model_bundle.joblib")

# Update these if you intentionally change train_tabular.py feature lists
EXPECTED_NUMERIC = {
    "mileage", "year"
}
EXPECTED_CATEGORICAL = {
    "make", "model", "condition", "zipcode"
}

def test_feature_config_contract():
    pipe, meta = load_pipeline(BUNDLE)
    # meta doesn't contain feature_config; read bundle directly via loader again for keys
    # Load full bundle dict using joblib (without bypassing loader contract)
    import joblib
    bundle = joblib.load(BUNDLE)
    assert "feature_config" in bundle, "Bundle missing 'feature_config'"
    fc = bundle["feature_config"]
    assert set(fc["numeric"]) == EXPECTED_NUMERIC, f"Numeric features drifted: {fc['numeric']}"
    assert set(fc["categorical"]) == EXPECTED_CATEGORICAL, f"Categorical features drifted: {fc['categorical']}"
    assert fc["target"] == "price", f"Target changed unexpectedly: {fc['target']}"
