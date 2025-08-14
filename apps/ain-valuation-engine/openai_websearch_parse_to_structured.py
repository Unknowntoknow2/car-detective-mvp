"""
openai_websearch_parse_to_structured.py
--------------------------------------
Fetches auction summary from OpenAI, parses the summary into structured vehicle data using basic pattern matching, and saves to CSV.
"""
import openai
import pandas as pd
import os
import re
from typing import List, Dict

def parse_summary_to_data(summary: str) -> List[Dict]:
    # Basic pattern: YEAR MAKE MODEL, $PRICE, URL
    pattern = re.compile(r"(\d{4}) ([A-Za-z]+) ([A-Za-z0-9\- ]+),? \$?(\d{3,6})(?:,| )?(https?://\S+)")
    data = []
    for match in pattern.finditer(summary):
        year, make, model, price, url = match.groups()
        data.append({
            "year": int(year),
            "make": make,
            "model": model.strip(),
            "price": int(price.replace(',', '')),
            "url": url
        })
    return data

def fetch_and_save_auction_data(query: str, out_csv: str):
    openai.api_key = os.getenv("OPENAI_API_KEY")
    response = openai.ChatCompletion.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": "You are a helpful assistant that summarizes public vehicle auction results."},
            {"role": "user", "content": query}
        ]
    )
    summary = response.choices[0].message['content']
    print(f"OpenAI Web Search Summary for query '{query}':\n", summary)
    parsed_data = parse_summary_to_data(summary)
    if not parsed_data:
        print("No structured data found. Please review the summary and parsing logic.")
        return
    df = pd.DataFrame(parsed_data)
    if os.path.exists(out_csv):
        df.to_csv(out_csv, mode='a', header=False, index=False)
    else:
        df.to_csv(out_csv, index=False)
    print(f"Inserted {len(df)} rows into {out_csv}")

if __name__ == "__main__":
    # Example usage for Barrett-Jackson Auctions
    query = "Summarize the latest public Barrett-Jackson vehicle auction results. List vehicles with year, make, model, price, and auction link. Format each as: YEAR MAKE MODEL, $PRICE, URL."
    out_csv = "barrett_jackson_auctions_listings.csv"
    fetch_and_save_auction_data(query, out_csv)
