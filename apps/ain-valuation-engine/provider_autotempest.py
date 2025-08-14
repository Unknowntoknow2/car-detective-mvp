from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import requests
from bs4 import BeautifulSoup
import re

class AutoTempestProvider(ListingProvider):
    def fetch_listings(self, max_results=100):
        # AutoTempest aggregates other marketplaces; this is a template for scraping public search results
        url = "https://www.autotempest.com/results"
        listings = []
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for card in soup.select("div.result-card"):
            title = card.find("h2", class_="result-title").text if card.find("h2", class_="result-title") else None
            price = card.find("span", class_="result-price").text if card.find("span", class_="result-price") else None
            url_tag = card.find("a", href=True)
            url_listing = url_tag['href'] if url_tag else None
            m = re.match(r"(\d{4}) (\w+) (.+)", title) if title else None
            year, make, model = (m.group(1), m.group(2), m.group(3)) if m else (None, None, None)
            raw = {"title": title, "year": year, "make": make, "model": model, "price": price, "url": url_listing}
            listings.append(raw)
            if len(listings) >= max_results:
                break
        return listings

    def normalize_listing(self, raw_listing):
        return {
            "source": "autotempest",
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
            "listing_date": None,
            "vin": None,
            "url": raw_listing.get("url"),
            "features": None,
            "raw_data": raw_listing
        }

# Example usage:
# provider = AutoTempestProvider()
# listings = provider.fetch_listings(max_results=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
