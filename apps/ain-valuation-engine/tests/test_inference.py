import math
from pathlib import Path
import pandas as pd

from val_engine.pipeline_loader import load_pipeline

BUNDLE = Path("artifacts/model_bundle.joblib")

def test_bundle_exists():
    assert BUNDLE.exists(), f"Missing bundle at {BUNDLE.resolve()}"

def test_load_and_predict_three_rows():
    pipe, meta = load_pipeline(BUNDLE)
    assert "pipe" in meta.get("bundle_keys", []) or meta.get("metadata", {}).get("note") is None

    df = pd.DataFrame([
        dict(mileage=10000, year=2022, owner_count=1, engine_hp=300, mpg_city=25, mpg_highway=33,
             make="Toyota", model="Camry", trim="SE", drivetrain="FWD", fuel_type="Gasoline",
             transmission="Automatic", exterior_color="White", interior_color="Black", state="CA", zip_region="940xx"),
        dict(mileage=65000, year=2017, owner_count=2, engine_hp=240, mpg_city=22, mpg_highway=30,
             make="Honda", model="Civic", trim="EX", drivetrain="FWD", fuel_type="Gasoline",
             transmission="CVT", exterior_color="Gray", interior_color="Gray", state="TX", zip_region="750xx"),
        dict(mileage=85000, year=2015, owner_count=3, engine_hp=355, mpg_city=16, mpg_highway=22,
             make="Ford", model="F-150", trim="XLT", drivetrain="4WD", fuel_type="Gasoline",
             transmission="Automatic", exterior_color="Blue", interior_color="Gray", state="CO", zip_region="800xx"),
    ])
    preds = pipe.predict(df)
    assert len(preds) == 3
    for p in preds:
        v = float(p)
        assert not math.isnan(v) and not math.isinf(v), f"Invalid prediction: {v}"
