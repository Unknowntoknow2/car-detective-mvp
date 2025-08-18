import pandas as pd
import numpy as np
from sklearn.ensemble import GradientBoostingRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
import shap
import joblib
from xgboost import XGBRegressor
from sklearn.neural_network import MLPRegressor

# Load master aggregated data
DATA_PATH = "master_aggregated_listings.csv"

# Feature engineering

def prepare_features(df):
    # Basic cleaning
    df = df.dropna(subset=["price", "year", "make", "model"])
    df = df[df["price"] > 1000]  # Remove implausible prices
    df = df[df["year"] > 1980]
    # Encode categorical features
    df["make"] = df["make"].astype(str).str.lower()
    df["model"] = df["model"].astype(str).str.lower()
    df["trim"] = df["trim"].astype(str).str.lower()
    df["location"] = df["location"].astype(str).str.lower()
    X = pd.get_dummies(df[["year", "make", "model", "trim", "mileage", "location"]], drop_first=True)
    # Ensure all features are numeric (float64)
    X = X.apply(pd.to_numeric, errors='coerce').astype(np.float64)
    y = pd.to_numeric(df["price"], errors='coerce')
    return X, y, df

def train_xgboost(X_train, y_train):
    xgb = XGBRegressor(n_estimators=100, max_depth=4, random_state=42)
    xgb.fit(X_train, y_train)
    joblib.dump(xgb, "gradient_boosting_model.joblib")
    explainer = shap.Explainer(xgb, X_train)
    joblib.dump(explainer, "shap_explainer.joblib")
    print("XGBoost model and SHAP explainer saved.")
    return xgb

def train_mlp(X_train, y_train):
    mlp = MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
    mlp.fit(X_train, y_train)
    joblib.dump(mlp, "mlp_market_value_model.joblib")
    print("MLP model saved.")
    return mlp

def train_and_evaluate():
    df = pd.read_csv(DATA_PATH)
    X, y, df_clean = prepare_features(df)
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    model = GradientBoostingRegressor(n_estimators=200, max_depth=5, random_state=42)
    model.fit(X_train, y_train)
    preds = model.predict(X_test)
    print(f"MAE: ${mean_absolute_error(y_test, preds):,.0f}")
    print(f"R^2: {r2_score(y_test, preds):.3f}")
    # SHAP explainability
    explainer = shap.Explainer(model, X_train)
    shap_values = explainer(X_test[:100])
    shap.summary_plot(shap_values, X_test[:100], show=False)
    print("SHAP summary plot generated.")
    # Train and save XGBoost and MLP
    train_xgboost(X_train, y_train)
    train_mlp(X_train, y_train)
    return model, X_test, y_test, preds

if __name__ == "__main__":
    train_and_evaluate()
