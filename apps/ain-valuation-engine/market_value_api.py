
from fastapi import FastAPI, Query, Request, Response
from pydantic import BaseModel
import pandas as pd
import joblib
import shap
import numpy as np
import logging
import time
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST

app = FastAPI()

# Logging setup
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger("market_value_api")

# Prometheus metrics
REQUEST_COUNT = Counter('api_requests_total', 'Total API Requests', ['method', 'endpoint', 'http_status'])
REQUEST_LATENCY = Histogram('api_request_latency_seconds', 'API Request latency', ['endpoint'])
ERROR_COUNT = Counter('api_errors_total', 'Total API Errors', ['endpoint'])

# Load model and feature columns
MODEL_PATH = "market_value_model.joblib"
FEATURES_PATH = "model_features.txt"

model = joblib.load(MODEL_PATH)
with open(FEATURES_PATH) as f:
    feature_cols = [line.strip() for line in f.readlines()]

class CarInput(BaseModel):
    year: int
    make: str
    model: str
    trim: str = ""
    mileage: float = None
    location: str = ""

@app.middleware("http")
async def metrics_and_logging_middleware(request: Request, call_next):
    start_time = time.time()
    try:
        response = await call_next(request)
        status_code = response.status_code
    except Exception as exc:
        status_code = 500
        logger.error(f"Exception: {exc}", exc_info=True)
        ERROR_COUNT.labels(endpoint=request.url.path).inc()
        raise
    finally:
        process_time = time.time() - start_time
        REQUEST_COUNT.labels(request.method, request.url.path, status_code).inc()
        REQUEST_LATENCY.labels(request.url.path).observe(process_time)
        logger.info(f"{request.method} {request.url.path} {status_code} {process_time:.3f}s")
    return response

@app.get("/metrics")
def metrics():
    return Response(generate_latest(), media_type=CONTENT_TYPE_LATEST)

@app.post("/predict")
def predict(input: CarInput):
    try:
        # Prepare input features
        df = pd.DataFrame([{**input.dict()}])
        df["make"] = df["make"].str.lower()
        df["model"] = df["model"].str.lower()
        df["trim"] = df["trim"].str.lower()
        df["location"] = df["location"].str.lower()
        X = pd.get_dummies(df, columns=["make", "model", "trim", "location"])
        # Align columns
        for col in feature_cols:
            if col not in X.columns:
                X[col] = 0
        X = X[feature_cols]
        # Predict
        pred = model.predict(X)[0]
        # SHAP explainability
        explainer = shap.Explainer(model, X)
        shap_values = explainer(X)
        shap_dict = dict(zip(X.columns, shap_values.values[0]))
        return {
            "predicted_market_value": round(pred, 2),
            "explainability": shap_dict
        }
    except Exception as e:
        logger.error(f"Prediction error: {e}", exc_info=True)
        ERROR_COUNT.labels(endpoint="/predict").inc()
        return {"error": str(e)}

# To run: uvicorn market_value_api:app --reload
