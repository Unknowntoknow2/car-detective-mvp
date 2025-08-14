"""
run_all_automatable_providers.py
-------------------------------
Runs all provider modules that are 100% automatable and aggregates their listings into CSVs for downstream use.
"""
import pandas as pd
from provider_craigslist import CraigslistProvider
from provider_ebay_motors import EbayMotorsProvider
from provider_bringatrailer import BringATrailerProvider
from provider_carsandbids import CarsAndBidsProvider
from provider_kaggle_used_car_auction import KaggleUsedCarAuctionProvider
from provider_uci_automobile_dataset import UciAutomobileDatasetProvider
from provider_eia_fuel_price import EiaFuelPriceProvider
from provider_fhwa_highway_stats import FhwaHighwayStatsProvider
from provider_cardekho_dataset import CardekhoDatasetProvider

PROVIDERS = [
    (CraigslistProvider(), "craigslist_listings.csv"),
    (EbayMotorsProvider(), "ebay_motors_listings.csv"),
    (BringATrailerProvider(), "bringatrailer_listings.csv"),
    (CarsAndBidsProvider(), "carsandbids_listings.csv"),
    (KaggleUsedCarAuctionProvider(), "kaggle_used_car_auction_listings.csv"),
    (UciAutomobileDatasetProvider(), "uci_automobile_dataset_listings.csv"),
    (EiaFuelPriceProvider(), "eia_fuel_price_listings.csv"),
    (FhwaHighwayStatsProvider(), "fhwa_highway_stats_listings.csv"),
    (CardekhoDatasetProvider(), "cardekho_dataset_listings.csv"),
]

def run_all():
    for provider, out_csv in PROVIDERS:
        print(f"Fetching from {provider.__class__.__name__}...")
        listings = provider.fetch_listings()
        norm = [provider.normalize_listing(l) for l in listings]
        df = pd.DataFrame(norm)
        df.to_csv(out_csv, index=False)
        print(f"Saved {len(df)} listings to {out_csv}")

if __name__ == "__main__":
    run_all()
