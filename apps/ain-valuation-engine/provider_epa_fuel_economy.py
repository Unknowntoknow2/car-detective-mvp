from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import pandas as pd

class EpaFuelEconomyProvider(ListingProvider):
    def fetch_listings(self, csv_path="epa_fuel_economy.csv", max_rows=1000):
        # EPA Fuel Economy Data (public)
        df = pd.read_csv(csv_path)
        if max_rows:
            df = df.head(max_rows)
        return df.to_dict(orient="records")

    def normalize_listing(self, raw_listing):
        return {
            "source": "epa_fuel_economy",
            "listing_id": raw_listing.get("id") or raw_listing.get("url"),
            "title": raw_listing.get("model"),
            "year": raw_listing.get("year"),
            "make": raw_listing.get("make"),
            "model": raw_listing.get("model"),
            "trim": raw_listing.get("trany"),
            "price": None,
            "mileage": raw_listing.get("comb08"),
            "location": None,
            "seller_type": None,
            "listing_date": None,
            "vin": None,
            "url": None,
            "features": None,
            "raw_data": raw_listing
        }
# Example usage:
# provider = EpaFuelEconomyProvider()
# listings = provider.fetch_listings(csv_path="epa_fuel_economy.csv", max_rows=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
