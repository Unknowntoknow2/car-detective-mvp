import requests

API_URL = "http://localhost:8000"

def test_health():
    r = requests.get(f"{API_URL}/health")
    assert r.status_code == 200, "Health endpoint failed"
    print("Health endpoint:", r.json())

def test_version():
    r = requests.get(f"{API_URL}/version")
    assert r.status_code == 200, "Version endpoint failed"
    print("Version endpoint:", r.json())

def test_predict_all_modalities():
    # Example features and dummy image/text (adapt as needed for your model)
    tabular_data = {"feature1": 1.2, "feature2": 3.4}
    tabular_payload = {"data": tabular_data}
    # Note: For FastAPI, tabular must be a JSON string in 'files'
    files = {
        "tabular": (None, '{"data": {"feature1": 1.2, "feature2": 3.4}}', "application/json"),
        "image": ("dummy.jpg", b"\xff\xd8\xff\xe0", "image/jpeg"),
    }
    data = {
        "text": "Example property description"
    }
    response = requests.post(f"{API_URL}/predict", data=data, files=files)
    print("Predict (all modalities):", response.status_code, response.json())

def test_predict_missing_modalities():
    tabular_data = {"feature1": 1.2, "feature2": 3.4}
    files = {
        "tabular": (None, '{"data": {"feature1": 1.2, "feature2": 3.4}}', "application/json"),
    }
    response = requests.post(f"{API_URL}/predict", files=files)
    print("Predict (missing image/text):", response.status_code, response.json())

def test_predict_missing_tabular():
    # Should return error, as tabular is required
    response = requests.post(f"{API_URL}/predict")
    print("Predict (missing tabular):", response.status_code, response.json())

if __name__ == "__main__":
    test_health()
    test_version()
    test_predict_all_modalities()
    test_predict_missing_modalities()
    test_predict_missing_tabular()
