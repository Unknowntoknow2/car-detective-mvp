from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class MecumProvider(ListingProvider):
    def fetch_listings(self, csv_path="mecum_auctions.csv", max_rows=1000):
        # Assumes you have downloaded the CSV from Mecum's public auction results
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "mecum",
            "listing_id": raw_listing.get("Lot") or raw_listing.get("url"),
            "title": raw_listing.get("Year Make Model") or raw_listing.get("title"),
            "year": raw_listing.get("Year"),
            "make": raw_listing.get("Make"),
            "model": raw_listing.get("Model"),
            "trim": None,
            "price": raw_listing.get("Sale Price"),
            "mileage": raw_listing.get("Odometer"),
            "location": raw_listing.get("Auction Location"),
            "seller_type": None,
            "listing_date": raw_listing.get("Auction Date"),
            "vin": raw_listing.get("VIN"),
            "url": raw_listing.get("url"),
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = MecumProvider()
# listings = provider.fetch_listings(csv_path="mecum_auctions.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
