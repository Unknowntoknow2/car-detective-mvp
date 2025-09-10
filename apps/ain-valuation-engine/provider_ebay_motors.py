from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import requests
from bs4 import BeautifulSoup
import re
import time

class EbayMotorsProvider(ListingProvider):
    def fetch_listings(self, max_pages=3, delay=2):
        base_url = "https://www.ebay.com/sch/Cars-Trucks/6001/i.html"
        listings = []
        for page in range(1, max_pages+1):
            params = {"_pgn": page}
            resp = requests.get(base_url, params=params, headers={"User-Agent": "Mozilla/5.0"})
            soup = BeautifulSoup(resp.text, "html.parser")
            for item in soup.select("li.s-item"):
                title = item.find("h3", class_="s-item__title")
                price = item.find("span", class_="s-item__price")
                link = item.find("a", class_="s-item__link")
                if not (title and price and link):
                    continue
                title_text = title.text.strip()
                price_text = price.text.strip()
                url = link["href"]
                m = re.match(r"(\d{4}) (\w+) (.+)", title_text)
                year, make, model = (m.group(1), m.group(2), m.group(3)) if m else (None, None, None)
                raw = {"title": title_text, "year": year, "make": make, "model": model, "price": price_text, "url": url}
                listings.append(raw)
            time.sleep(delay)
        return listings

    def normalize_listing(self, raw_listing):
        return {
            "source": "ebay_motors",
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
# provider = EbayMotorsProvider()
# listings = provider.fetch_listings(max_pages=1)
# for raw in listings:
#     print(provider.normalize_listing(raw))
