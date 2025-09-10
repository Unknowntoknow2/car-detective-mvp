from engine.types import ValuationInput
import pytest

# Valid sample
valid_sample = {
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

def test_valid_sample():
    v = ValuationInput(**valid_sample)
    assert v.year == 2022
    assert v.make == "Toyota"
    assert v.completeness == 0.95

def test_missing_required():
    data = valid_sample.copy()
    data.pop("make")
    with pytest.raises(Exception):
        ValuationInput(**data)

def test_out_of_bounds():
    data = valid_sample.copy()
    data["mileage"] = -1
    with pytest.raises(Exception):
        ValuationInput(**data)
    data["mileage"] = 600000
    with pytest.raises(Exception):
        ValuationInput(**data)

def test_empty_string():
    data = valid_sample.copy()
    data["make"] = ""
    with pytest.raises(Exception):
        ValuationInput(**data)
