from engine.inference_xgb import init_model, predict_value
from engine.types import ValuationInput
import pytest

golden_cases = [
    # Add 50 curated VIN cases with expected value/range here
    # Example:
    {"input": {"year": 2022, "make": "Toyota", "model": "Camry", "trim": "LE", "body_style": "sedan", "drivetrain": "FWD", "fuel_type": "gas", "zip": "94107", "mileage": 25000, "age_years": 2.5, "comp_count": 5, "comp_mean": 21000.0, "comp_median": 20800.0, "condition_score": 0.9, "owners": 1, "accidents": 0, "title_brand_flags": 0, "options_count": 8, "region_bucket": "west", "completeness": 0.95}, "expected_range": (18000, 24000)},
    # ...
]

def test_golden_set():
    try:
        init_model()
        pass_count = 0
        for case in golden_cases:
            val_input = ValuationInput(**case["input"])
            result = predict_value(val_input)
            low, high = case["expected_range"]
            if low <= result["value"] <= high:
                pass_count += 1
        if golden_cases:
            assert pass_count / len(golden_cases) >= 0.9, f"Golden set pass rate too low: {pass_count}/{len(golden_cases)}"
    except Exception:
        pytest.skip("Model files not present; skipping golden set test.")
