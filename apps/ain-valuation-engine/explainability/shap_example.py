import pandas as pd
import shap
from sklearn.linear_model import LinearRegression

df = pd.read_csv("../data/processed.csv")
X = df[['mileage', 'year']]
y = df['price']

model = LinearRegression().fit(X, y)
explainer = shap.Explainer(model, X)
shap_values = explainer(X)
shap.summary_plot(shap_values, X)
