import torch
import joblib
from engine.types import ValuationInput
from ml.dnn_model import ValuationDNN

_model = None
_pipeline = None

def load_model():
    global _model, _pipeline
    if _model is None or _pipeline is None:
        _pipeline = joblib.load("dnn_pipeline.joblib")
        input_dim = len(_pipeline.get_feature_names_out())
        _model = ValuationDNN(input_dim)
        _model.load_state_dict(torch.load("dnn_model.pt"))
        _model.eval()

def predict_value(val_input: ValuationInput):
    load_model()
    X = _pipeline.transform([val_input.dict()])
    X_tensor = torch.tensor(X, dtype=torch.float32)
    with torch.no_grad():
        pred = _model(X_tensor).item()
    return {"value": float(pred), "confidence": 0.8}
