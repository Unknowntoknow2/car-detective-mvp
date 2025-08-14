import requests
from bs4 import BeautifulSoup
import re
import csv
import time

# Template for scraping eBay Motors car listings (public search results)
def scrape_ebay_motors(max_pages=3, delay=2):
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
            # Try to extract year, make, model from title
            m = re.match(r"(\d{4}) (\w+) (.+)", title_text)
            year, make, model = (m.group(1), m.group(2), m.group(3)) if m else (None, None, None)
            listings.append({"title": title_text, "year": year, "make": make, "model": model, "price": price_text, "url": url})
        print(f"Scraped page {page}, total listings: {len(listings)}")
        time.sleep(delay)
    with open("ebay_motors_listings.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=listings[0].keys())
        writer.writeheader()
        writer.writerows(listings)
    print(f"Scraped {len(listings)} listings to ebay_motors_listings.csv")

if __name__ == "__main__":
    scrape_ebay_motors()
