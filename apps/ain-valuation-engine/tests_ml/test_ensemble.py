import numpy as np
from ml.ensemble import EnsembleValuator
import pytest

def test_ensemble_shape_and_coherence():
    # Dummy base model stubs
    class DummyModel:
        def predict(self, X):
            return np.ones(len(X))
    xgb = DummyModel()
    dnn = DummyModel()
    cnn = DummyModel()
    bert = DummyModel()
    meta = DummyModel()
    ens = EnsembleValuator(xgb, dnn, cnn, bert, meta)
    X_tab = np.ones((10, 5))
    X_img = np.ones((10, 3, 224, 224))
    X_txt = ["test"] * 10
    preds = ens.predict(X_tab, X_img, X_txt)
    assert preds.shape[0] == 10
    # Coherence: all predictions should be 1
    assert np.allclose(preds, 1)
