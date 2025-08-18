import csv
from listing_provider_interface import aggregate_listings
from provider_craigslist import CraigslistProvider
from provider_ebay_motors import EbayMotorsProvider
from provider_offerup import OfferUpProvider
from provider_autotempest import AutoTempestProvider
from provider_hemmings import HemmingsProvider
from provider_carsandbids import CarsAndBidsProvider
from provider_bringatrailer import BringATrailerProvider
from provider_cardekho_dataset import CardekhoDatasetProvider

# List of all fully automated, free, and public providers
PROVIDERS = [
    CraigslistProvider(),
    EbayMotorsProvider(),
    OfferUpProvider(),
    AutoTempestProvider(),
    HemmingsProvider(),
    CarsAndBidsProvider(),
    BringATrailerProvider(),
    CardekhoDatasetProvider()
]

def main(max_results=50):
    all_listings = []
    for provider in PROVIDERS:
        print(f"Fetching from {provider.__class__.__name__}...")
        try:
            listings = provider.fetch_listings(max_results=max_results)
            for raw in listings:
                norm = provider.normalize_listing(raw)
                all_listings.append(norm)
        except Exception as e:
            print(f"Error fetching from {provider.__class__.__name__}: {e}")
    # Write to CSV
    if all_listings:
        with open("aggregated_marketplace_listings.csv", "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=all_listings[0].keys())
            writer.writeheader()
            writer.writerows(all_listings)
        print(f"Wrote {len(all_listings)} listings to aggregated_marketplace_listings.csv")
    else:
        print("No listings found.")

if __name__ == "__main__":
    main()
