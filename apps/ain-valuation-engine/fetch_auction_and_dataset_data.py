"""
fetch_auction_and_dataset_data.py
---------------------------------
Fetches data from all 100% automatable, public/free auction and dataset sources:
- GSA Auctions
- Kaggle CarDekho Dataset
- Kaggle Used Car Auction Prices
- UCI ML Automobile Dataset
- EPA Fuel Economy Data
- NHTSA vPIC API (CSV)
- FHWA Highway Statistics
- EIA Fuel Price Data
"""
import pandas as pd
from provider_gsa_auctions import GsaAuctionsProvider
from provider_cardekho_dataset import CardekhoDatasetProvider
from provider_kaggle_used_car_auction import KaggleUsedCarAuctionProvider
from provider_uci_automobile_dataset import UciAutomobileDatasetProvider
from provider_epa_fuel_economy import EpaFuelEconomyProvider
from provider_nhtsa_vpic import NhtsaVpicProvider
from provider_fhwa_highway_stats import FhwaHighwayStatsProvider
from provider_eia_fuel_price import EiaFuelPriceProvider

PROVIDERS = [
    (GsaAuctionsProvider(), "gsa_auctions_listings.csv"),
    (CardekhoDatasetProvider(), "cardekho_dataset_listings.csv"),
    (KaggleUsedCarAuctionProvider(), "kaggle_used_car_auction_listings.csv"),
    (UciAutomobileDatasetProvider(), "uci_automobile_dataset_listings.csv"),
    (EpaFuelEconomyProvider(), "epa_fuel_economy_listings.csv"),
    (NhtsaVpicProvider(), "nhtsa_vpic_listings.csv"),
    (FhwaHighwayStatsProvider(), "fhwa_highway_stats_listings.csv"),
    (EiaFuelPriceProvider(), "eia_fuel_price_listings.csv"),
]

def fetch_all():
    for provider, out_csv in PROVIDERS:
        print(f"Fetching from {provider.__class__.__name__}...")
        listings = provider.fetch_listings()
        norm = [provider.normalize_listing(l) for l in listings]
        df = pd.DataFrame(norm)
        df.to_csv(out_csv, index=False)
        print(f"Saved {len(df)} listings to {out_csv}")

if __name__ == "__main__":
    fetch_all()
