
import os
import threading
import joblib
import xgboost as xgb
import numpy as np
from engine.types import ValuationInput, ValuationOutput

_model = None
_pipeline = None
_lock = threading.Lock()

def init_model(model_uri=None):
	global _model, _pipeline
	with _lock:
		if _model is not None and _pipeline is not None:
			return
		model_uri = model_uri or os.environ.get("MODEL_URI")
		if not model_uri:
			raise RuntimeError("MODEL_URI not set")
		# For S3: download to local, or for local: use as is
		# Here, assume local path for simplicity
		_pipeline = joblib.load(os.path.join(model_uri, "pipeline.joblib"))
		_model = xgb.Booster()
		_model.load_model(os.path.join(model_uri, "xgb.json"))

def predict_value(val_input: ValuationInput) -> dict:
	if _model is None or _pipeline is None:
		init_model()
	X = _pipeline.transform([val_input.dict()])
	dmatrix = xgb.DMatrix(X)
	pred = _model.predict(dmatrix)[0]
	# Example: 10% range, confidence 0.85 for ML
	return {
		"value": float(pred),
		"range_low": float(pred * 0.9),
		"range_high": float(pred * 1.1),
		"confidence": 0.85,
		"method": "ml_xgb",
		"model_version": os.environ.get("MODEL_VERSION", "unknown")
	}
