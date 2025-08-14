from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class UciAutomobileDatasetProvider(ListingProvider):
    def fetch_listings(self, csv_path="auto-mpg.csv", max_rows=1000):
        # UCI ML Automobile Dataset (public)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "uci_automobile_dataset",
            "listing_id": raw_listing.get("car name"),
            "title": raw_listing.get("car name"),
            "year": raw_listing.get("model year"),
            "make": raw_listing.get("car name", "").split()[0] if raw_listing.get("car name") else None,
            "model": None,
            "trim": None,
            "price": None,
            "mileage": raw_listing.get("miles per gallon"),
            "location": None,
            "seller_type": None,
            "listing_date": None,
            "vin": None,
            "url": None,
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = UciAutomobileDatasetProvider()
# listings = provider.fetch_listings(csv_path="auto-mpg.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
