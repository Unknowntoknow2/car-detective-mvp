import json
import os
from pathlib import Path
import pytest

os.environ.setdefault("AIN_MODEL_BUNDLE", "artifacts/model_bundle.joblib")

@pytest.fixture(scope="session")
def app():
    from val_engine.enhanced_valuation_api import app as flask_app
    return flask_app

@pytest.fixture
def client(app):
    return app.test_client()

def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    body = resp.get_json()
    assert body["status"] == "ok"
    assert "bundle_keys" in body

def test_predict_minimal_row(client):
    payload = {
        "rows": [{
            "mileage": 62000, "year": 2018, "owner_count": 2,
            "engine_hp": 285, "mpg_city": 18, "mpg_highway": 24,
            "make":"Ford","model":"F-150","trim":"XLT","drivetrain":"4WD",
            "fuel_type":"Gasoline","transmission":"Automatic",
            "exterior_color":"Blue","interior_color":"Gray",
            "state":"CA","zip_region":"900xx"
        }]
    }
    resp = client.post("/predict", data=json.dumps(payload), content_type="application/json")
    assert resp.status_code == 200, resp.get_data(as_text=True)
    body = resp.get_json()
    assert body["status"] == "ok"
    assert body["n"] == 1
    assert isinstance(body["predictions"], list) and len(body["predictions"]) == 1
