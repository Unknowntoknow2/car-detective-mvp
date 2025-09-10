from engine import inference_ensemble, llm_explain

def test_vin_and_car_details():
    # Example input for a Toyota Camry 2020, 39K miles, excellent condition
    val_input = {
        "tabular": {
            "vin": "4T1G11AK5LU897892",
            "year": 2020,
            "make": "Toyota",
            "model": "Camry",
            "mileage": 39000,
            "zip": "95821",
            "condition": "excellent"
        },
        # 'image': <np array or path>,
        # 'text': <inspection notes or description>
    }
    result = inference_ensemble.predict_value(val_input)
    print("Ensemble prediction:", result)
    # Get explainability
    top_factors = [
        {"feature": "year", "direction": "positive", "abs_impact": 0.2},
        {"feature": "mileage", "direction": "negative", "abs_impact": 0.15}
    ]
    llm_result = llm_explain.llm_explanation(
        numeric_output=result,
        top_factors=top_factors,
        method=result.get("method", "ensemble"),
        data_sufficiency=True,
        ensemble_factors=None
    )
    print("LLM explanation:", llm_result)
    assert "value" in result
    assert "explanation" in llm_result
