import os
import joblib
import sklearn

# --- FrequencyEncoder shim for artifact loading ---
try:
    from sklearn.base import BaseEstimator, TransformerMixin
    class FrequencyEncoder(BaseEstimator, TransformerMixin):
        def __init__(self, cols=None, min_freq=1): self.cols=cols; self.min_freq=min_freq
        def fit(self, X, y=None): return self
        def transform(self, X):
            import pandas as pd
            df = pd.DataFrame(X).copy()
            maps = getattr(self, "mapping_", None) or getattr(self, "freq_maps_", None)
            if isinstance(maps, dict):
                for col, mp in maps.items():
                    if col in df.columns:
                        df[col] = df[col].map(mp).fillna(0.0)
            return df
except Exception:
    pass

p = os.environ.get("AIN_PIPELINE_PATH", "artifacts/valuation_pipeline.joblib")
print(f"Loading artifact: {p}")
b = joblib.load(p)
print("type:", type(b))
if isinstance(b, dict):
    print("keys:", list(b.keys()))
    for k, v in b.items():
        print(f"{k} => {type(v)}")
else:
    try:
        from sklearn.pipeline import Pipeline
        if isinstance(b, Pipeline):
            print("artifact is a Pipeline")
            print("steps:", [n for n, _ in b.steps])
        else:
            print("artifact is NOT a Pipeline:", type(b))
    except Exception as e:
        print("pipeline check failed:", e)
