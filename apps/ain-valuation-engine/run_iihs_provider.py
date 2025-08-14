"""
run_iihs_provider.py
-------------------
Fetches and normalizes IIHS crash test and safety ratings data for aggregation.
"""
import pandas as pd
from provider_iihs_safety import IihsSafetyProvider

def run():
    provider = IihsSafetyProvider()
    listings = provider.fetch_listings()
    norm = [provider.normalize_listing(l) for l in listings]
    df = pd.DataFrame(norm)
    df.to_csv("iihs_safety_listings.csv", index=False)
    print(f"Saved {len(df)} listings to iihs_safety_listings.csv")

if __name__ == "__main__":
    run()
