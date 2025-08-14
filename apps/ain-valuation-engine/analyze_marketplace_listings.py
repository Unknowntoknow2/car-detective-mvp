import pandas as pd

CSV_PATH = "aggregated_marketplace_listings.csv"

# Example filters (customize as needed)
FILTERS = {
    "make": None,  # e.g., "Toyota"
    "model": None, # e.g., "Camry"
    "year_min": None, # e.g., 2015
    "year_max": None, # e.g., 2022
    "price_min": None, # e.g., 5000
    "price_max": None, # e.g., 30000
}

def load_and_filter(csv_path=CSV_PATH, filters=FILTERS):
    df = pd.read_csv(csv_path)
    # Clean price and year columns
    df["price"] = pd.to_numeric(df["price"].str.replace("$", "").str.replace(",", ""), errors="coerce")
    df["year"] = pd.to_numeric(df["year"], errors="coerce")
    # Apply filters
    if filters["make"]:
        df = df[df["make"].str.lower() == filters["make"].lower()]
    if filters["model"]:
        df = df[df["model"].str.lower() == filters["model"].lower()]
    if filters["year_min"]:
        df = df[df["year"] >= filters["year_min"]]
    if filters["year_max"]:
        df = df[df["year"] <= filters["year_max"]]
    if filters["price_min"]:
        df = df[df["price"] >= filters["price_min"]]
    if filters["price_max"]:
        df = df[df["price"] <= filters["price_max"]]
    return df

def analytics_report(df):
    print(f"Total listings: {len(df)}")
    if len(df) == 0:
        return
    print(f"Average price: ${df['price'].mean():,.0f}")
    print(f"Median price: ${df['price'].median():,.0f}")
    print(f"Year range: {int(df['year'].min())} - {int(df['year'].max())}")
    print(f"Top 5 makes: {df['make'].value_counts().head(5).to_dict()}")
    print(f"Top 5 models: {df['model'].value_counts().head(5).to_dict()}")
    print(f"Sources: {df['source'].value_counts().to_dict()}")

if __name__ == "__main__":
    df = load_and_filter()
    analytics_report(df)
