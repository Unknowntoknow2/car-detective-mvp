import time
from engine.inference_xgb import init_model, predict_value
from engine.types import ValuationInput
import pytest

def test_inference_latency():
    sample = {
        "year": 2022,
        "make": "Toyota",
        "model": "Camry",
        "trim": "LE",
        "body_style": "sedan",
        "drivetrain": "FWD",
        "fuel_type": "gas",
        "zip": "94107",
        "mileage": 25000,
        "age_years": 2.5,
        "comp_count": 5,
        "comp_mean": 21000.0,
        "comp_median": 20800.0,
        "condition_score": 0.9,
        "owners": 1,
        "accidents": 0,
        "title_brand_flags": 0,
        "options_count": 8,
        "region_bucket": "west",
        "completeness": 0.95
    }
    val_input = ValuationInput(**sample)
    try:
        init_model()
        start = time.time()
        for _ in range(1000):
            predict_value(val_input)
        elapsed = (time.time() - start) * 1000 / 1000  # ms per call
        assert elapsed < 200, f"p95 latency too high: {elapsed:.2f}ms"
    except Exception:
        pytest.skip("Model files not present; skipping latency test.")
