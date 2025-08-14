from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import requests
from bs4 import BeautifulSoup
import re

class CraigslistProvider(ListingProvider):
    def fetch_listings(self, region="sfbay", max_results=100):
        url = f"https://{region}.craigslist.org/search/cta"
        params = {"hasPic": 1, "auto_title_status": 1, "s": 0}
        listings = []
        for start in range(0, max_results, 120):
            params["s"] = start
            resp = requests.get(url, params=params)
            soup = BeautifulSoup(resp.text, "html.parser")
            for row in soup.select("li.result-row"):
                title = row.find("a", class_="result-title").text
                price = row.find("span", class_="result-price").text if row.find("span", class_="result-price") else None
                date = row.find("time", class_="result-date")["datetime"]
                link = row.find("a", class_="result-title")["href"]
                m = re.match(r"(\d{4}) (\w+) (.+)", title)
                year, make, model = (m.group(1), m.group(2), m.group(3)) if m else (None, None, None)
                raw = {"title": title, "year": year, "make": make, "model": model, "price": price, "listing_date": date, "url": link}
                listings.append(raw)
            if len(listings) >= max_results:
                break
        return listings

    def normalize_listing(self, raw_listing):
        return {
            "source": "craigslist",
            "listing_id": raw_listing.get("url"),
            "title": raw_listing.get("title"),
            "year": raw_listing.get("year"),
            "make": raw_listing.get("make"),
            "model": raw_listing.get("model"),
            "trim": None,
            "price": raw_listing.get("price"),
            "mileage": None,
            "location": None,
            "seller_type": None,
            "listing_date": raw_listing.get("listing_date"),
            "vin": None,
            "url": raw_listing.get("url"),
            "features": None,
            "raw_data": raw_listing
        }

# Example usage:
# provider = CraigslistProvider()
# listings = provider.fetch_listings(region="sfbay", max_results=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
