import shap
from model import encoders

explainer = None  # Will be set after model is trained

def set_explainer(trained_model):
    global explainer
    explainer = shap.TreeExplainer(trained_model)

def encode_input(input_df):
    df = input_df.copy()
    for col in ["make", "model", "condition"]:
        le = encoders.get(col)
        if le is not None and df[col].iloc[0] in le.classes_:
            df[col] = le.transform(df[col])
        else:
            df[col] = 0
    return df

def explain_prediction(input_df):
    if explainer is None:
        raise RuntimeError("SHAP explainer not initialized. Call set_explainer(model) after training.")
    encoded_df = encode_input(input_df)
    shap_values = explainer.shap_values(encoded_df)
    return shap_values