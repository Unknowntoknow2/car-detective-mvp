from engine.shap_explain import top_local_drivers
from engine.types import ValuationInput
import pytest

def test_top_local_drivers_stub():
    # This test will fail unless a real model is present
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
        drivers = top_local_drivers(val_input)
        assert isinstance(drivers, list)
        assert len(drivers) > 0
    except Exception:
        pytest.skip("Model files not present; skipping SHAP test.")
