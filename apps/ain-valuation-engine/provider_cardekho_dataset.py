from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class CardekhoDatasetProvider(ListingProvider):
    def fetch_listings(self, csv_path="car data.csv", max_rows=1000):
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "cardekho_dataset",
            "listing_id": raw_listing.get("name"),
            "title": raw_listing.get("name"),
            "year": raw_listing.get("year"),
            "make": raw_listing.get("name", "").split()[0] if raw_listing.get("name") else None,
            "model": raw_listing.get("name", "").split()[1] if raw_listing.get("name") and len(raw_listing.get("name").split()) > 1 else None,
            "trim": None,
            "price": raw_listing.get("selling_price"),
            "mileage": raw_listing.get("mileage"),
            "location": None,
            "seller_type": raw_listing.get("owner"),
            "listing_date": None,
            "vin": None,
            "url": None,
            "features": None,
            "raw_data": raw_listing
        }

# Example usage:
# provider = CardekhoDatasetProvider()
# listings = provider.fetch_listings(csv_path="car data.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
