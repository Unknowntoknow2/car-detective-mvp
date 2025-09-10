import os
from fastapi import FastAPI, HTTPException, Request, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from fastapi.security.api_key import APIKeyHeader
from src.api_integrations.vin_decoder import decode_vin
from app.routes import inventory
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor
from opentelemetry import trace
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.resources import SERVICE_NAME, Resource
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

# Load environment variables
load_dotenv()

app = FastAPI()

# --- CORS setup ---
allowed_origins = os.getenv("CORS_ALLOW_ORIGINS", "https://ain.example,https://stage.ain.example").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,  # Restrict in production
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

# --- JWT Auth ---
JWT_SECRET = os.getenv("JWT_SECRET", "test-secret")
JWT_AUDIENCE = os.getenv("JWT_AUDIENCE", "ain-b2b")
JWT_ISSUER = os.getenv("JWT_ISSUER", "ain-auth")

bearer_scheme = HTTPBearer(auto_error=False)

def check_jwt_token(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    if not credentials:
        raise HTTPException(status_code=401, detail="Missing JWT token")
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, audience=JWT_AUDIENCE, issuer=JWT_ISSUER, algorithms=["HS256"])
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid JWT token")

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
    except Exception:
        # Do not leak internal errors
        raise HTTPException(status_code=404, detail="VIN decode failed.")

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
    except Exception:
        # Do not leak internal errors
        raise HTTPException(status_code=400, detail="Valuation failed.")

# --- OpenTelemetry setup ---
otel_endpoint = os.getenv("OTEL_EXPORTER_OTLP_ENDPOINT", "http://localhost:4318/v1/traces")
service_name = os.getenv("OTEL_SERVICE_NAME", "valuation-api")

resource = Resource(attributes={SERVICE_NAME: service_name})
provider = TracerProvider(resource=resource)
otel_exporter = OTLPSpanExporter(endpoint=otel_endpoint, insecure=True)
span_processor = BatchSpanProcessor(otel_exporter)
provider.add_span_processor(span_processor)
trace.set_tracer_provider(provider)

FastAPIInstrumentor.instrument_app(app)
HTTPXClientInstrumentor().instrument()

app.include_router(inventory.router)