from engine.llm_explain import llm_explanation, fallback_explanation

def test_fallback_explanation():
    numeric_output = {"value": 20000, "confidence": 0.85}
    top_factors = [{"feature": "mileage"}, {"feature": "age_years"}]
    method = "ml_xgb"
    data_sufficiency = True
    text = fallback_explanation(numeric_output, top_factors, method, data_sufficiency)
    assert "Estimated value" in text
    assert "mileage" in text

def test_llm_timeout():
    # Should fall back if no API key or timeout
    numeric_output = {"value": 20000, "confidence": 0.85}
    top_factors = [{"feature": "mileage"}, {"feature": "age_years"}]
    method = "ml_xgb"
    data_sufficiency = True
    text = llm_explanation(numeric_output, top_factors, method, data_sufficiency, timeout=0.01)
    assert "Estimated value" in text or "limited data" in text
