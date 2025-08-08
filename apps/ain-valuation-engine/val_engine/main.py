from model import train_model, predict_price
from shap_explainer import explain_prediction
from llm_summary import generate_valuation_summary
from utils.data_loader import load_training_data, preprocess_input
import pandas as pd
import json

def run_valuation(input_dict):
    df = load_training_data()
    train_model(df)
    input_df = preprocess_input(input_dict)
    # Ensure input_df is a DataFrame with correct feature names
    if not isinstance(input_df, pd.DataFrame):
        input_df = pd.DataFrame([input_dict])
    price = predict_price(input_df)
    shap_vals = explain_prediction(input_df)
    # Convert shap_vals.data to a list for JSON serialization
    adjustments = shap_vals.data
    if hasattr(adjustments, "tolist"):
        adjustments = adjustments.tolist()
    summary = generate_valuation_summary(input_dict, adjustments)
    return {
        "estimated_value": price,
        "adjustments": adjustments,
        "summary": summary
    }

if __name__ == "__main__":
    sample = {
        "year": 2019,
        "mileage": 60000,
        "make": "Honda",
        "model": "Civic",
        "zipcode": 94103,
        "condition": "Excellent"
    }
    result = run_valuation(sample)
    print(result)

    # Always export to JSON file for persistency (convert non-serializables)
    with open("valuation_output.json", "w") as f:
        json.dump(result, f, indent=2)