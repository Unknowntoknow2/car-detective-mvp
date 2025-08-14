import requests
from bs4 import BeautifulSoup
import re
import csv

# Example: Scrape public Craigslist car listings (where allowed)
def scrape_craigslist_cars(region="sfbay", max_results=100):
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
            # Extract year, make, model from title (simple regex)
            m = re.match(r"(\d{4}) (\w+) (.+)", title)
            year, make, model = (m.group(1), m.group(2), m.group(3)) if m else (None, None, None)
            listings.append({"title": title, "year": year, "make": make, "model": model, "price": price, "date": date, "url": link})
        if len(listings) >= max_results:
            break
    with open("craigslist_listings.csv", "w", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=listings[0].keys())
        writer.writeheader()
        writer.writerows(listings)
    print(f"Scraped {len(listings)} listings to craigslist_listings.csv")

if __name__ == "__main__":
    scrape_craigslist_cars()
