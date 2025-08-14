"""
fetch_marketplace_data.py
------------------------
Fetches summary vehicle listing data (title, price, year, make, model, and URL) from all compliant, automatable marketplaces: Craigslist, eBay Motors, Bring a Trailer, and Cars & Bids.
"""
import pandas as pd
from provider_craigslist import CraigslistProvider
from provider_ebay_motors import EbayMotorsProvider
from provider_bringatrailer import BringATrailerProvider
from provider_carsandbids import CarsAndBidsProvider

PROVIDERS = [
    (CraigslistProvider(), "craigslist_listings.csv"),
    (EbayMotorsProvider(), "ebay_motors_listings.csv"),
    (BringATrailerProvider(), "bringatrailer_listings.csv"),
    (CarsAndBidsProvider(), "carsandbids_listings.csv"),
]

def fetch_all():
    for provider, out_csv in PROVIDERS:
        print(f"Fetching from {provider.__class__.__name__}...")
        listings = provider.fetch_listings()
        norm = [provider.normalize_listing(l) for l in listings]
        df = pd.DataFrame(norm)
        # Only keep summary fields and URL
        summary_cols = [
            "title", "price", "year", "make", "model", "mileage", "location", "url"
        ]
        df = df[[col for col in summary_cols if col in df.columns]]
        df.to_csv(out_csv, index=False)
        print(f"Saved {len(df)} listings to {out_csv}")

if __name__ == "__main__":
    fetch_all()
