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

def test_train_and_eval():
    # Dummy data and models
    from sklearn.linear_model import Ridge
    class DummyModel:
        def predict(self, X):
            return np.ones(len(X))
    ens = EnsembleValuator(DummyModel(), DummyModel(), DummyModel(), DummyModel(), Ridge())
    X_tab = np.ones((20, 5))
    X_img = np.ones((20, 3, 224, 224))
    X_txt = ["test"] * 20
    y = np.ones(20)
    ens.fit(X_tab, X_img, X_txt, y)
    metrics = ens.evaluate(X_tab, X_img, X_txt, y)
    assert "mae" in metrics and "rmse" in metrics and "r2" in metrics

def test_explainability():
    try:
        from engine import shap_explain
        class DummyValInput:
            def dict(self):
                return {"year": 2020, "mileage": 10000}
        drivers = shap_explain.top_local_drivers(DummyValInput(), top_n=3, ensemble=True)
        assert isinstance(drivers, list) and len(drivers) == 3
        expl = shap_explain.explain_ensemble(DummyValInput(), top_n=2)
        assert "drivers" in expl and "narrative" in expl
    except ImportError:
        import pytest
        pytest.skip("shap or dependencies not installed")

def test_llm_narrative():
    from engine import llm_explain
    result = llm_explain.llm_explanation(
        numeric_output={"value": 12345},
        top_factors=[{"feature": "year", "direction": "positive", "abs_impact": 0.2}],
        method="stacking",
        data_sufficiency=True,
        ensemble_factors=[{"feature": "image:damage", "direction": "negative", "abs_impact": 0.15}]
    )
    assert "facts-only" in result["prompt"]
