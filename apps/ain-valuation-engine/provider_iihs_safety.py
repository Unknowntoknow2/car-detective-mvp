"""
provider_iihs_safety.py
----------------------
Fetches and normalizes IIHS crash test and safety ratings data (public, downloadable CSVs).
"""
from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class IihsSafetyProvider(ListingProvider):
    def fetch_listings(self, csv_path="iihs_safety_ratings.csv", max_rows=1000):
        # IIHS crash test and safety ratings (public, downloadable)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "iihs_safety",
            "listing_id": raw_listing.get("Vehicle ID") or raw_listing.get("url"),
            "title": raw_listing.get("Vehicle"),
            "year": raw_listing.get("Year"),
            "make": raw_listing.get("Make"),
            "model": raw_listing.get("Model"),
            "trim": raw_listing.get("Trim"),
            "price": None,
            "mileage": None,
            "location": None,
            "seller_type": None,
            "listing_date": None,
            "vin": raw_listing.get("VIN"),
            "url": raw_listing.get("url"),
            "features": raw_listing.get("Safety Features"),
            "raw_data": raw_listing
        }
# Example usage:
# provider = IihsSafetyProvider()
# listings = provider.fetch_listings(csv_path="iihs_safety_ratings.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
