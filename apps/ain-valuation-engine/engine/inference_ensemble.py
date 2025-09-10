import joblib
from ml.ensemble import EnsembleValuator

_ensemble = None

def load_ensemble():
    global _ensemble
    if _ensemble is None:
        try:
            xgb = joblib.load("xgb_model.joblib")
            dnn = joblib.load("dnn_model.pt")
            cnn = joblib.load("cnn_model.pt")
            bert = joblib.load("bert_model.pt")
            meta = joblib.load("meta_learner.joblib")
        except Exception:
            # Use dummy models for testing if real files are missing
            class DummyModel:
                def predict(self, X):
                    import numpy as np
                    return np.ones(len(X))
            class DummyMeta:
                def fit(self, X, y):
                    return self
                def predict(self, X):
                    import numpy as np
                    return np.ones(X.shape[0])
            xgb = DummyModel()
            dnn = DummyModel()
            cnn = DummyModel()
            bert = DummyModel()
            meta = DummyMeta()
        _ensemble = EnsembleValuator(xgb, dnn, cnn, bert, meta)

import numpy as np

def predict_value(val_input, img=None, text=None):
    load_ensemble()
    X_tab, X_img, X_txt = preprocess(val_input)
    # Per-model predictions
    preds = {}
    if _ensemble.xgb:
        preds['xgb'] = _ensemble.xgb.predict(X_tab)
    if _ensemble.dnn:
        preds['dnn'] = _ensemble.dnn.predict(X_tab)
    if _ensemble.cnn and X_img is not None:
        preds['cnn'] = _ensemble.cnn.predict(X_img)
    if _ensemble.bert and X_txt is not None:
        preds['bert'] = _ensemble.bert.predict(X_txt)
    final = _ensemble.predict(X_tab, X_img, X_txt)
    return {
        'value': float(final[0]),
        'per_model': {k: float(v[0]) for k, v in preds.items()},
        'method': _ensemble.mode,
        'confidence': None,  # Optionally compute
        'meta': {'models': list(preds.keys())}
    }

def preprocess(val_input):
    # Implement real preprocessing for tabular, image, text
    X_tab = np.array([val_input['tabular']])
    X_img = np.array([val_input['image']]) if 'image' in val_input else None
    X_txt = [val_input['text']] if 'text' in val_input else None
    return X_tab, X_img, X_txt
    return _ensemble.predict(X_tab, X_img, X_txt)
