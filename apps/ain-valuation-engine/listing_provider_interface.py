# Provider interface for vehicle listing sources
from abc import ABC, abstractmethod

class ListingProvider(ABC):
    @abstractmethod
    def fetch_listings(self, **kwargs):
        """Fetch and return a list of raw listings from the provider."""
        pass

    @abstractmethod
    def normalize_listing(self, raw_listing):
        """Normalize a single raw listing to the canonical schema."""
        pass

# Canonical schema for vehicle listings
CANONICAL_LISTING_FIELDS = [
    "source", "listing_id", "title", "year", "make", "model", "trim", "price", "mileage", "location", "seller_type", "listing_date", "vin", "url", "features", "raw_data"
]

# Example usage:
# class CraigslistProvider(ListingProvider):
#     def fetch_listings(self, **kwargs):
#         ...
#     def normalize_listing(self, raw_listing):
#         ...

# Aggregator function

def aggregate_listings(providers, **kwargs):
    all_listings = []
    for provider in providers:
        raw_listings = provider.fetch_listings(**kwargs)
        for raw in raw_listings:
            norm = provider.normalize_listing(raw)
            all_listings.append(norm)
    return all_listings
