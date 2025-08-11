import os
from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi.security.api_key import APIKeyHeader
from src.api_integrations.vin_decoder import decode_vin

# Load environment variables
load_dotenv()

app = FastAPI()

# --- CORS setup ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change in production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Rate Limiting ---
limiter = Limiter(key_func=get_remote_address, default_limits=["5/minute"])
app.state.limiter = limiter
app.add_exception_handler(429, _rate_limit_exceeded_handler)

# --- API Key Auth ---
API_KEY_NAME = "X-API-Key"
API_KEYS = [k.strip() for k in os.getenv("API_KEYS", "").split(",") if k.strip()]
api_key_header = APIKeyHeader(name=API_KEY_NAME, auto_error=False)

def check_api_key(api_key: str = Depends(api_key_header)):
    if not api_key or api_key not in API_KEYS:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API Key",
        )
    return api_key

@app.get("/")
def health():
    return {"message": "AIN Valuation API is running. See /docs for API documentation."}

class VINRequest(BaseModel):
    vin: str

class ValuationRequest(BaseModel):
    vin: str
    mileage: int
    zipcode: str

@app.post("/functions/v1/decode-vin")
@limiter.limit("5/minute")
async def supabase_decode_vin(request: Request, api_key: str = Depends(check_api_key)):
    data = await request.json()
    vin = data.get("vin")
    if not vin:
        raise HTTPException(status_code=400, detail="VIN is required.")
    try:
        vin_data = decode_vin(vin)
        return {"decodedData": [vin_data]}
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"VIN decode failed: {str(e)}")

@app.post("/api/v1/valuation")
@limiter.limit("5/minute")
def get_vehicle_valuation(request: ValuationRequest, api_key: str = Depends(check_api_key)):
    try:
        vin_data = decode_vin(request.vin)
        if not vin_data or not isinstance(vin_data, dict):
            raise HTTPException(status_code=400, detail="VIN decode failed: No data returned.")
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