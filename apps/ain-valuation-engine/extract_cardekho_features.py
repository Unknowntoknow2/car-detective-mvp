import pandas as pd

# Example: Extract features from Kaggle CarDekho dataset

def extract_features_from_cardekho(csv_path="car data.csv", out_path="cardekho_features.csv"):
    df = pd.read_csv(csv_path)
    # Normalize and map features
    df["make"] = df["name"].str.split().str[0]
    df["model"] = df["name"].str.split().str[1]
    df["year"] = df["year"]
    df["fuel"] = df["fuel"]
    df["transmission"] = df["transmission"]
    df["owner"] = df["owner"]
    df["mileage"] = df["mileage"]
    df["price"] = df["selling_price"]
    # Add more mappings as needed
    df[["make", "model", "year", "fuel", "transmission", "owner", "mileage", "price"]].to_csv(out_path, index=False)
    print(f"Extracted features to {out_path}")

if __name__ == "__main__":
    extract_features_from_cardekho()
