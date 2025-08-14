from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class EiaFuelPriceProvider(ListingProvider):
    def fetch_listings(self, csv_path="eia_fuel_prices.csv", max_rows=1000):
        # EIA Fuel Price Data (public, CSV)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "eia_fuel_price",
            "listing_id": raw_listing.get("id") or raw_listing.get("url"),
            "title": raw_listing.get("Product Name"),
            "year": raw_listing.get("Year"),
            "make": None,
            "model": None,
            "trim": None,
            "price": raw_listing.get("Price"),
            "mileage": None,
            "location": raw_listing.get("Region"),
            "seller_type": None,
            "listing_date": raw_listing.get("Date"),
            "vin": None,
            "url": None,
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = EiaFuelPriceProvider()
# listings = provider.fetch_listings(csv_path="eia_fuel_prices.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
