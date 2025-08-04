from model import train_model, predict_price
from shap_explainer import explain_prediction
from llm_summary import generate_valuation_summary
from utils.data_loader import load_training_data, preprocess_input

def run_valuation(input_dict):
    df = load_training_data()
    train_model(df)
    input_df = preprocess_input(input_dict)
    price = predict_price(input_df)
    shap_vals = explain_prediction(input_df)
    summary = generate_valuation_summary(input_dict, shap_vals.data)
    return {
        "estimated_value": price,
        "adjustments": shap_vals.data,
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
