
import shap
import joblib
import xgboost as xgb
import numpy as np
from engine.types import ValuationInput
import os
import threading

_explainer = None
_pipeline = None
_model = None
_lock = threading.Lock()

def _load_model_and_pipeline(model_uri=None):
	global _pipeline, _model
	if _pipeline is not None and _model is not None:
		return
	model_uri = model_uri or os.environ.get("MODEL_URI")
	if not model_uri:
		raise RuntimeError("MODEL_URI not set")
	_pipeline = joblib.load(os.path.join(model_uri, "pipeline.joblib"))
	_model = xgb.Booster()
	_model.load_model(os.path.join(model_uri, "xgb.json"))

def _get_explainer():
	global _explainer
	with _lock:
		if _explainer is not None:
			return _explainer
		_load_model_and_pipeline()
		# SHAP expects XGBRegressor, so wrap Booster if needed
		explainer = shap.TreeExplainer(_model)
		_explainer = explainer
		return explainer

def top_local_drivers(val_input: ValuationInput, top_n=5):
	_load_model_and_pipeline()
	explainer = _get_explainer()
	X = _pipeline.transform([val_input.dict()])
	shap_values = explainer.shap_values(X)
	feature_names = _pipeline.named_steps['preprocessor'].get_feature_names_out()
	impacts = list(zip(feature_names, shap_values[0]))
	# Sort by absolute impact
	impacts = sorted(impacts, key=lambda x: abs(x[1]), reverse=True)
	result = []
	for feat, val in impacts[:top_n]:
		result.append({
			"feature": feat,
			"direction": "positive" if val > 0 else "negative",
			"abs_impact": abs(val)
		})
	return result
def top_local_drivers(val_input: ValuationInput, top_n=5, ensemble=False):
	if ensemble:
		# Stub: Use KernelExplainer or meta-learner SHAP for ensemble
		# Aggregate importances from all base models
		return [{"feature": "ensemble_feature", "direction": "positive", "abs_impact": 0.1} for _ in range(top_n)]
	else:
		_load_model_and_pipeline()
		explainer = _get_explainer()
		X = _pipeline.transform([val_input.dict()])
		shap_values = explainer.shap_values(X)
		feature_names = _pipeline.named_steps['preprocessor'].get_feature_names_out()
		impacts = list(zip(feature_names, shap_values[0]))
		impacts = sorted(impacts, key=lambda x: abs(x[1]), reverse=True)
		result = []
		for feat, val in impacts[:top_n]:
			result.append({
				"feature": feat,
				"direction": "positive" if val > 0 else "negative",
				"abs_impact": abs(val)
			})
		return result
