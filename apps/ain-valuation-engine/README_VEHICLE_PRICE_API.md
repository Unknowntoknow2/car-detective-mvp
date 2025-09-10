# Vehicle Price Prediction API (FastAPI + XGBoost + SHAP)

## Overview
A production-ready FastAPI microservice for vehicle price prediction, using a trained XGBoost model and SHAP for explainability. Prometheus metrics are exposed for monitoring.

---

## Usage
1. **Start the API:**
   ```bash
   uvicorn vehicle_price_api:app --reload
   ```
2. **Predict Price:**
   ```bash
   curl -X POST "http://localhost:8000/predict" -H "Content-Type: application/json" -d '{"year":2020,"make":"TOYOTA","model":"CAMRY","mileage":30000,"engine_displacement":2.5,"fuel_type":"Gasoline"}'
   ```
3. **Explain Prediction:**
   ```bash
   curl -X POST "http://localhost:8000/explain" -H "Content-Type: application/json" -d '{"year":2020,"make":"TOYOTA","model":"CAMRY","mileage":30000,"engine_displacement":2.5,"fuel_type":"Gasoline"}'
   ```

---

## Monitoring
- Prometheus metrics available at `:9000`
- Integrate with Grafana for dashboards

---

## Extending
- Add more vehicle features to the `VehicleFeatures` model and update the model pipeline as needed.
- Replace the model and explainer files with your own trained artifacts.

---

## Architecture
See `ARCHITECTURE_VEHICLE_PRICE_PIPELINE.md` for a full pipeline overview.
