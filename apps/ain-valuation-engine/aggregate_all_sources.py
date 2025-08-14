import pandas as pd
import numpy as np
from glob import glob

# List all CSVs from provider outputs (marketplaces, auctions, datasets)
CSV_FILES = glob("*.csv")

# Canonical fields for aggregation
CANONICAL_FIELDS = [
    "source", "listing_id", "title", "year", "make", "model", "trim", "price", "mileage", "location", "seller_type", "listing_date", "vin", "url", "features", "raw_data"
]

def aggregate_all_sources(csv_files=CSV_FILES, out_path="master_aggregated_listings.csv"):
    dfs = []
    for csv_file in csv_files:
        try:
            df = pd.read_csv(csv_file)
            # Only keep canonical fields
            df = df[[col for col in CANONICAL_FIELDS if col in df.columns]]
            dfs.append(df)
        except Exception as e:
            print(f"Error reading {csv_file}: {e}")
    if not dfs:
        print("No data to aggregate.")
        return
    master = pd.concat(dfs, ignore_index=True)
    # Drop duplicates by VIN or listing_id
    if "vin" in master.columns:
        master = master.drop_duplicates(subset=["vin", "listing_id"], keep="last")
    else:
        master = master.drop_duplicates(subset=["listing_id"], keep="last")
    # Save
    master.to_csv(out_path, index=False)
    print(f"Aggregated {len(master)} listings to {out_path}")

if __name__ == "__main__":
    aggregate_all_sources()
