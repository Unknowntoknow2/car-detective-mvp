from listing_provider_interface import ListingProvider, CANONICAL_LISTING_FIELDS
import requests
from bs4 import BeautifulSoup
import re

class OfferUpProvider(ListingProvider):
    def fetch_listings(self, max_results=100):
        # OfferUp does not have a public API; this is a template for public search scraping (subject to robots.txt)
        url = "https://offerup.com/cars-trucks/"
        listings = []
        resp = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for card in soup.select("div[data-testid='listing-card']"):
            title = card.find("span", class_="_1r1u1t6").text if card.find("span", class_="_1r1u1t6") else None
            price = card.find("span", class_="_1r1u1t7").text if card.find("span", class_="_1r1u1t7") else None
            url_tag = card.find("a", href=True)
            url_listing = f"https://offerup.com{url_tag['href']}" if url_tag else None
            m = re.match(r"(\d{4}) (\w+) (.+)", title) if title else None
            year, make, model = (m.group(1), m.group(2), m.group(3)) if m else (None, None, None)
            raw = {"title": title, "year": year, "make": make, "model": model, "price": price, "url": url_listing}
            listings.append(raw)
            if len(listings) >= max_results:
                break
        return listings

    def normalize_listing(self, raw_listing):
        return {
            "source": "offerup",
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
# provider = OfferUpProvider()
# listings = provider.fetch_listings(max_results=10)
# for raw in listings:
#     print(provider.normalize_listing(raw))
