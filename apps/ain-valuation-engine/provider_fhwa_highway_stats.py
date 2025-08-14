from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class FhwaHighwayStatsProvider(ListingProvider):
    def fetch_listings(self, csv_path="fhwa_highway_stats.csv", max_rows=1000):
        # FHWA Highway Statistics (public, CSV)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "fhwa_highway_stats",
            "listing_id": raw_listing.get("id") or raw_listing.get("url"),
            "title": raw_listing.get("Vehicle Type"),
            "year": raw_listing.get("Year"),
            "make": None,
            "model": None,
            "trim": None,
            "price": None,
            "mileage": None,
            "location": raw_listing.get("State"),
            "seller_type": None,
            "listing_date": None,
            "vin": None,
            "url": None,
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = FhwaHighwayStatsProvider()
# listings = provider.fetch_listings(csv_path="fhwa_highway_stats.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
