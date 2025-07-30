import pandas as pd

df = pd.read_csv("sample.csv")
# Example: Clean price column
df['price'] = df['price'].astype(float)
df.to_csv('processed.csv', index=False)
print("Processed data saved to processed.csv")
