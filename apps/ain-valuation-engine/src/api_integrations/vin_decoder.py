from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from slowapi import Limiter
from slowapi.util import get_remote_address

app = FastAPI()
limiter = Limiter(key_func=get_remote_address)

# Example request model
class ValuationRequest(BaseModel):
    vin: str
    mileage: int
    zipcode: str

# Dummy API key checker function
def check_api_key(api_key: str = ""):
    if api_key != "expected_api_key":
        raise HTTPException(status_code=403, detail="Invalid API key.")
    return api_key

# Dummy VIN decoder function
def decode_vin(vin: str):
    # Just an example, replace with proper decode logic
    return {
        "vin": vin,
        "year": "2021",
        "make": "Toyota",
        "model": "Camry"
    }

@app.post("/api/v1/valuation")
@limiter.limit("5/minute")
def get_vehicle_valuation(request: ValuationRequest, api_key: str = Depends(check_api_key)):
    """
    Estimate vehicle value from VIN, mileage, and zipcode.
    Returns dict with decoded VIN data and estimated value.
    """
    try:
        vin_data = decode_vin(request.vin)
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
        mileage_penalty = max(0, (request.mileage - 30000) * 0.10)
        age_penalty = age * 1000
        estimated_value = max(3000, base_value - age_penalty - mileage_penalty)

        vehicle_data = {
            **vin_data,
            "mileage": request.mileage,
            "zipcode": request.zipcode,
            "estimated_value": round(estimated_value, 2)
        }
        return vehicle_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"VIN decode failed: {str(e)}")