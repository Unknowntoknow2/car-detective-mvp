import requests
from vininfo import Vin

# Simple in-memory cache (replace with Redis/DB for production)
vin_cache = {}

def validate_vin(vin):
    try:
        v = Vin(vin)
        return v.validate_checksum()
    except Exception:
        return False

def decode_vin(vin):
    vin = vin.upper().strip()
    if vin in vin_cache:
        return vin_cache[vin]

    if not validate_vin(vin):
        return {"error": "Invalid VIN format or checksum."}

    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
    resp = requests.get(url)
    if resp.status_code != 200:
        return {"error": "NHTSA API error."}

    data = resp.json()
    # Map results to canonical schema
    result = {item['Variable']: item['Value'] for item in data['Results']}
    vin_cache[vin] = result
    return result

# Example usage
if __name__ == "__main__":
    test_vin = "4T1R11AK4RU878557"
    print(decode_vin(test_vin))
