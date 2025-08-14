from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class NhtsaVpicProvider(ListingProvider):
    def fetch_listings(self, csv_path="nhtsa_vpic.csv", max_rows=1000):
        # NHTSA vPIC API data (public, can be downloaded as CSV)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "nhtsa_vpic",
            "listing_id": raw_listing.get("VIN"),
            "title": raw_listing.get("Model"),
            "year": raw_listing.get("Model Year"),
            "make": raw_listing.get("Make"),
            "model": raw_listing.get("Model"),
            "trim": raw_listing.get("Trim"),
            "price": None,
            "mileage": None,
            "location": None,
            "seller_type": None,
            "listing_date": None,
            "vin": raw_listing.get("VIN"),
            "url": None,
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = NhtsaVpicProvider()
# listings = provider.fetch_listings(csv_path="nhtsa_vpic.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
