from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
# iSeeCars does not have a public API; this is a template for future integration or manual export.

class ISeeCarsProvider(ListingProvider):
    def fetch_listings(self, max_results=100):
        # Placeholder: No public scraping implemented
        return []

    def normalize_listing(self, raw_listing):
        return {
            "source": "iseecars",
            "listing_id": raw_listing.get("url") if raw_listing else None,
            "title": raw_listing.get("title") if raw_listing else None,
            "year": None,
            "make": None,
            "model": None,
            "trim": None,
            "price": None,
            "mileage": None,
            "location": None,
            "seller_type": None,
            "listing_date": None,
            "vin": None,
            "url": raw_listing.get("url") if raw_listing else None,
            "features": None,
            "raw_data": raw_listing
        }
# Note: Use manual export or third-party tools for iSeeCars listings if needed.
