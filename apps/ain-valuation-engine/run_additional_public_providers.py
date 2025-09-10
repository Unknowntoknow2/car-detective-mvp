"""
run_additional_public_providers.py
----------------------------------
Runs additional public provider modules (NHTSA vPIC, EPA Fuel Economy, GSA Auctions) and outputs their listings as CSVs for aggregation.
"""
import pandas as pd
from provider_nhtsa_vpic import NhtsaVpicProvider
from provider_epa_fuel_economy import EpaFuelEconomyProvider
from provider_gsa_auctions import GsaAuctionsProvider

PROVIDERS = [
    (NhtsaVpicProvider(), "nhtsa_vpic_listings.csv"),
    (EpaFuelEconomyProvider(), "epa_fuel_economy_listings.csv"),
    (GsaAuctionsProvider(), "gsa_auctions_listings.csv"),
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
