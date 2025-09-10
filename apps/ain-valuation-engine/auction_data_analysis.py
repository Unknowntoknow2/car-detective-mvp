# auction_data_analysis.py
"""
Download and analyze the Kaggle Used Car Auction Prices dataset for analytics/modeling.
This is NOT for per-VIN lookup, but for building depreciation models, price analytics, etc.
"""
import pandas as pd
import requests
import io

def download_auction_dataset():
    url = "https://raw.githubusercontent.com/saadpasta/deploy-react-app/master/car_prices.csv"
    response = requests.get(url)
    if response.status_code != 200:
        raise Exception("Failed to download auction dataset")
    return pd.read_csv(io.StringIO(response.text))

def basic_stats(df):
    print("Total records:", len(df))
    print("Columns:", df.columns.tolist())
    print(df.describe(include='all'))

if __name__ == "__main__":
    df = download_auction_dataset()
    basic_stats(df)
