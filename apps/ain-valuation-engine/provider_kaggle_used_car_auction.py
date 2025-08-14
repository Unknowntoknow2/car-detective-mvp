from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class KaggleUsedCarAuctionProvider(ListingProvider):
    def fetch_listings(self, csv_path="car_prices.csv", max_rows=1000):
        # Kaggle Used Car Auction Prices dataset (public)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "kaggle_used_car_auction",
            "listing_id": raw_listing.get("id") or raw_listing.get("url"),
            "title": raw_listing.get("title"),
            "year": raw_listing.get("year"),
            "make": raw_listing.get("make"),
            "model": raw_listing.get("model"),
            "trim": raw_listing.get("trim"),
            "price": raw_listing.get("price"),
            "mileage": raw_listing.get("odometer"),
            "location": raw_listing.get("region"),
            "seller_type": None,
            "listing_date": raw_listing.get("date_posted"),
            "vin": raw_listing.get("vin"),
            "url": raw_listing.get("url"),
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = KaggleUsedCarAuctionProvider()
# listings = provider.fetch_listings(csv_path="car_prices.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
