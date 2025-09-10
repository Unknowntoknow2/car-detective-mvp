# Manufacturer Site Feature Extraction (Template)

## Purpose
Extract new vehicle features, trims, and options from manufacturer build & price/spec pages (where allowed by terms).

## Steps
1. Identify the manufacturer site and the model/trim/spec page URL.
2. Use requests/BeautifulSoup (or Selenium for dynamic pages) to fetch and parse the page.
3. Extract features: MSRP, trims, options, warranty, technical specs, etc.
4. Normalize and map to canonical schema.
5. Document the extraction logic and any limitations.

## Example (Pseudocode)

import requests
from bs4 import BeautifulSoup

url = "https://www.toyota.com/camry/"
resp = requests.get(url)
soup = BeautifulSoup(resp.text, "html.parser")
# Parse trims, features, etc. (site-specific selectors)

## Notes
- Always check and comply with the site’s robots.txt and terms of service.
- For dynamic content, use Selenium or Playwright.
- Document all extracted fields and mapping logic.

---
Update this template for each manufacturer as needed.
