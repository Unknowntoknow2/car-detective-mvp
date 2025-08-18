import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

df = pd.read_csv("../data/processed.csv")
X = df[['mileage', 'year']]
y = df['price']

model = LinearRegression()
model.fit(X, y)
print("Model trained. Example prediction:", model.predict([[35000, 2019]]))

# Save the model to the required path for the API
joblib.dump(model, "tabular_xgb_0.joblib")