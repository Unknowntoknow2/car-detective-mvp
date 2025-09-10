import requests

API_URL = "http://localhost:8000/api/v1/valuation"
API_KEY = "expected_api_key"

def test_vin_lookup_flow():
    payload = {
        "vin": "4T1K31AK5PU607399",
        "mileage": 45000,
        "zipcode": "90210"
    }
    headers = {"accept": "application/json", "X-API-Key": API_KEY}
    response = requests.post(API_URL, json=payload, headers=headers)
    print("Status Code:", response.status_code)
    print("Response JSON:")
    print(response.json())

if __name__ == "__main__":
    test_vin_lookup_flow()
