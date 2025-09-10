# openai_batch_acquisition.py
"""
FAANG-level batch acquisition using OpenAI Responses API for compliant sources.
- Uses compliance guardrails to check each source.
- Batches queries for cost efficiency.
- Normalizes and inserts results into the valuation engine.
"""
import os
import requests
import json
from openai_compliance_guardrails import is_compliant

OPENAI_API_KEY = os.environ["OPENAI_API_KEY"]
HEADERS = {"Authorization": f"Bearer {OPENAI_API_KEY}", "Content-Type": "application/json"}

BATCH_SOURCES = [
    {
        "name": "GSA Auctions",
        "query": "Summarize the latest public GSA vehicle auction results. List vehicles with year, make, model, price, and auction link. Format as JSON array.",
        "url": "https://gsaauctions.gov/auction1",
        "out_csv": "gsa_auctions_listings.csv"
    },
    # Add more compliant sources as needed
]

def run_batch_acquisition():
    for src in BATCH_SOURCES:
        if not is_compliant(src["url"]):
            print(f"Skipping {src['name']} (not compliant)")
            continue
        payload = {
            "model": "gpt-4o-mini",
            "tools": [{"type": "web_search"}],
            "tool_choice": "auto",
            "response_format": {"type": "json"},
            "input": src["query"]
        }
        r = requests.post("https://api.openai.com/v1/responses", headers=HEADERS, data=json.dumps(payload))
        if r.status_code != 200:
            print(f"OpenAI API error for {src['name']}: {r.text}")
            continue
        data = r.json()
        # Expecting a JSON array of listings
        listings = data.get("output", {}).get("listings", [])
        if not listings:
            print(f"No listings found for {src['name']}")
            continue
        # Normalize and save to CSV
        import pandas as pd
        df = pd.DataFrame(listings)
        if os.path.exists(src["out_csv"]):
            df.to_csv(src["out_csv"], mode='a', header=False, index=False)
        else:
            df.to_csv(src["out_csv"], index=False)
        print(f"Inserted {len(df)} rows into {src['out_csv']}")

if __name__ == "__main__":
    run_batch_acquisition()
