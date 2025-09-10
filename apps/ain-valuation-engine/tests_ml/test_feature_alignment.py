import pandas as pd
from ml.feature_spec_utils import save_feature_spec, load_feature_spec, align_features_to_spec

def test_feature_alignment():
    # Training features
    train_df = pd.DataFrame({
        "year": [2020],
        "mileage": [10000],
        "make": ["Toyota"]
    })
    save_feature_spec(train_df, "test_feature_spec.json")
    feature_spec = load_feature_spec("test_feature_spec.json")

    # Inference sample missing a column and with an extra
    infer_df = pd.DataFrame({
        "mileage": [20000],
        "make": ["Toyota"],
        "color": ["Blue"]
    })
    aligned = align_features_to_spec(infer_df, feature_spec)
    assert list(aligned.columns) == ["year", "mileage", "make"]
    assert aligned["year"].iloc[0] == 0

if __name__ == "__main__":
    test_feature_alignment()
    print("Feature alignment test passed.")
