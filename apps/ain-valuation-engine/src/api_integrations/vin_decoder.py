
from fastapi import FastAPI, Depends, HTTPException, Header, Request
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address
import os

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)

# Example request model
class ValuationRequest(BaseModel):
    vin: str
    mileage: int
    zipcode: str


# API key checker using environment variable (comma-separated keys)
API_KEYS = [k.strip() for k in os.getenv("API_KEYS", "expected_api_key").split(",") if k.strip()]
def check_api_key(api_key: str = Header(default="", alias="X-API-Key")):
    print(f"[DEBUG] Received API key: {api_key}")
    print(f"[DEBUG] Allowed API keys: {API_KEYS}")
    if not api_key or api_key not in API_KEYS:
        raise HTTPException(status_code=403, detail="Invalid API key.")
    return api_key

# Dummy VIN decoder function
import httpx
def decode_vin(vin: str):
    """
    Decodes a VIN using the NHTSA VPIC API and returns all available fields.
    """
    url = f"https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVin/{vin}?format=json"
    try:
        response = httpx.get(url, timeout=10)
        response.raise_for_status()
        data = response.json()
        if not data or "Results" not in data or not data["Results"]:
            return {"vin": vin, "error": "No results from NHTSA API"}
        # Return the full Results list
        return {"vin": vin, "results": data["Results"]}
    except Exception as e:
        return {"vin": vin, "error": str(e)}

@app.post("/api/v1/valuation")
@limiter.limit("5/minute")
def get_vehicle_valuation(request_data: ValuationRequest, request: Request, api_key: str = Depends(check_api_key)):
    """
    Estimate vehicle value from VIN, mileage, and zipcode.
    Returns dict with decoded VIN data and estimated value.
    """
    try:
        vin_data = decode_vin(request_data.vin)
        if not vin_data or not isinstance(vin_data, dict):
            raise HTTPException(status_code=400, detail="VIN decode failed: No data returned.")

        # Try to parse year, fallback to 2020 if not present/invalid
        year_str = vin_data.get("year", "2020")
        try:
            year = int(year_str)
        except Exception:
            year = 2020

        base_value = 25000
        age = 2025 - year
        mileage_penalty = max(0, (request_data.mileage - 30000) * 0.10)
        age_penalty = age * 1000
        estimated_value = max(3000, base_value - age_penalty - mileage_penalty)

        vehicle_data = {
            **vin_data,
            "mileage": request_data.mileage,
            "zipcode": request_data.zipcode,
            "estimated_value": round(estimated_value, 2)
        }
        return vehicle_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"VIN decode failed: {str(e)}")