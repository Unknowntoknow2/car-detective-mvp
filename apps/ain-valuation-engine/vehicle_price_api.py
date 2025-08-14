"""
FastAPI microservice for vehicle price prediction with XGBoost and SHAP explainability.
Prometheus metrics and logging included.
"""
import os

import joblib
import shap
import numpy as np
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from prometheus_client import start_http_server, Counter
import logging
from vehicle_ensemble_and_llm import ensemble_predict

# Prometheus metrics
predict_counter = Counter('vehicle_price_predictions', 'Number of price predictions served')

# Load SHAP explainer for XGBoost (for explainability endpoint)
EXPLAINER_PATH = os.getenv('EXPLAINER_PATH', 'shap_explainer.joblib')
try:
    explainer = joblib.load(EXPLAINER_PATH)
except Exception:
    explainer = None

app = FastAPI()

# Public root endpoint for health check and welcome
@app.get("/")
def root():
    return {"message": "AIN Valuation Engine API is running. Use /docs for Swagger UI or /predict for vehicle valuation."}


class VehicleFeatures(BaseModel):
    year: int
    make: str
    model: str
    trim: str = ""
    mileage: float
    location: str = ""
    engine_displacement: float = 0.0
    fuel_type: str = ""
    transmission: str = ""
    drive_type: str = ""
    body_type: str = ""
    description: str = None  # Unstructured data for LLM/Transformer
    # Add more fields as needed

@app.on_event("startup")
def startup_event():
    start_http_server(9000)
    logging.info("Prometheus metrics available on :9000")


@app.post("/predict")
def predict_price(features: VehicleFeatures):
    try:
        # Load training columns for one-hot encoding
        import pandas as pd
        import numpy as np
        import joblib
        # These columns must match the training set
        TRAIN_COLS_PATH = "model_feature_columns.joblib"
        try:
            feature_columns = joblib.load(TRAIN_COLS_PATH)
        except Exception:
            # Fallback: infer from training data
            feature_columns = [
                'year', 'mileage', 'make_ford', 'make_honda', 'make_hyundai', 'make_toyota',
                'model_accord', 'model_camry', 'model_corolla', 'model_fusion', 'model_mustang', 'model_sonata',
                'trim_ex', 'trim_gt', 'trim_le', 'trim_se',
                'location_chicago', 'location_houston', 'location_los angeles', 'location_miami', 'location_new york'
            ]
        # Build a DataFrame from input
        input_dict = {
            'year': features.year,
            'mileage': features.mileage,
            'make': features.make.lower(),
            'model': features.model.lower(),
            'trim': features.trim.lower(),
            'location': features.location.lower() if features.location else ""
        }
        df = pd.DataFrame([input_dict])
        X = pd.get_dummies(df, columns=["make", "model", "trim", "location"], drop_first=True)
        # Add missing columns as zeros to match training
        for col in feature_columns:
            if col not in X.columns:
                X[col] = 0
        X = X[feature_columns]
        X = X.astype(np.float64)
        desc = features.description if features.description else None
        pred = ensemble_predict(X.values[0], description=desc)
        predict_counter.inc()
        return {"predicted_price": float(pred)}
    except Exception as e:
        logging.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")


@app.post("/explain")
def explain_prediction(features: VehicleFeatures):
    if explainer is None:
        raise HTTPException(status_code=503, detail="SHAP explainer not available.")
    try:
        X = np.array([[features.year, features.mileage, features.engine_displacement]])
        shap_values = explainer.shap_values(X)
        return {"shap_values": shap_values[0].tolist()}
    except Exception as e:
        logging.error(f"Explainability error: {e}")
        raise HTTPException(status_code=500, detail="Explainability failed.")
