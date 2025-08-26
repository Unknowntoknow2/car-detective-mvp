import pytest
from fastapi.testclient import TestClient
from val_engine.api import app

client = TestClient(app)

def test_valuate_endpoint_valid():
    payload = {
        "year": 2021,
        "make": "Toyota",
        "model": "Camry",
        "trim": "LE",
        "body_style": "Sedan",
        "drivetrain": "FWD",
        "fuel_type": "Gasoline",
        "zip": "90210",
        "mileage": 25000,
        "age_years": 3.0,
        "comp_count": 5,
        "comp_mean": 25000.0,
        "comp_median": 24500.0,
        "condition_score": 0.95,
        "owners": 1,
        "accidents": 0,
        "title_brand_flags": 0,
        "options_count": 10,
        "region_bucket": "West",
        "completeness": 0.95
    }
    response = client.post("/valuate", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "value" in data
    assert "top_factors" in data
    assert "explanation" in data
    assert data["confidence"] >= 0
    assert data["method"] in ("ml_xgb", "fallback")

def test_valuate_endpoint_missing_required():
    payload = {
        "year": 2021,
        "make": "Toyota",
        # Missing model
        "zip": "90210",
        "mileage": 25000,
        "age_years": 3.0,
        "comp_count": 5,
        "comp_mean": 25000.0,
        "comp_median": 24500.0,
        "condition_score": 0.95,
        "owners": 1,
        "accidents": 0,
        "title_brand_flags": 0,
        "options_count": 10,
        "region_bucket": "West",
        "completeness": 0.95
    }
    response = client.post("/valuate", json=payload)
    assert response.status_code == 422

def test_valuate_endpoint_invalid_type():
    payload = {
        "year": "not_a_year",
        "make": "Toyota",
        "model": "Camry",
        "zip": "90210",
        "mileage": 25000,
        "age_years": 3.0,
        "comp_count": 5,
        "comp_mean": 25000.0,
        "comp_median": 24500.0,
        "condition_score": 0.95,
        "owners": 1,
        "accidents": 0,
        "title_brand_flags": 0,
        "options_count": 10,
        "region_bucket": "West",
        "completeness": 0.95
    }
    response = client.post("/valuate", json=payload)
    assert response.status_code == 422
