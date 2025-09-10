from fastapi import FastAPI, HTTPException
from src.api_integrations.vin_decoder import decode_vin

app = FastAPI()

@app.get("/decode-vin/{vin}")
def decode_vin_endpoint(vin: str):
    try:
        return decode_vin(vin)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
