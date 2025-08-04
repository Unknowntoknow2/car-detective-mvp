import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.preprocessing import LabelEncoder

model = GradientBoostingRegressor()
encoders = {}

def train_model(dataframe: pd.DataFrame):
    df = dataframe.copy()
    for col in ["make", "model", "condition"]:
        le = LabelEncoder()
        df[col] = le.fit_transform(df[col])
        encoders[col] = le  # Save for use in prediction

    X = df[["year", "mileage", "make", "model", "condition", "zipcode"]]
    y = df["price"]
    model.fit(X, y)
    from shap_explainer import set_explainer
    set_explainer(model)

def predict_price(input_df: pd.DataFrame):
    # input_df: DataFrame with one row
    encoded_input = []
    row = input_df.iloc[0]  # Get the first row as a Series

    for key in ["year", "mileage"]:
        encoded_input.append(row[key])

    for col in ["make", "model", "condition"]:
        label = row[col]
        le = encoders.get(col)
        if le is not None and label in le.classes_:
            encoded_input.append(le.transform([label])[0])
        else:
            encoded_input.append(0)  # Fallback for unseen label

    encoded_input.append(int(row["zipcode"]))
    return model.predict([encoded_input])[0]
