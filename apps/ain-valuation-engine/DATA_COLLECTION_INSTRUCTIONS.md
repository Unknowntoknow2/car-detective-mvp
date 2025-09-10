# DATA_COLLECTION_INSTRUCTIONS.md

## How to Collect Vehicle Listings Data (No Coding Required)

### Fully Automated Sources (Ready to Use)
You can automatically collect summary data (price, year, make, model, mileage, and a link to the original listing) from these sources:
- Craigslist
- eBay Motors
- Bring a Trailer
- Cars & Bids

#### To collect data:
1. Run the provided scripts (ask your developer or IT to run `run_all_automatable_providers.py`).
2. The system will fetch the latest listings and save them as CSV files.
3. Each listing will include a direct link to the original website.

### Manual or Semi-Automated Sources
For other sites (like CarMax, CarGurus, Carvana, etc.), you must:
- Export listings manually (CSV, Excel, or copy-paste) from the website, or use a third-party data provider.
- Place the exported file in the project folder.
- Ask your developer or IT to run the normalization script for that source (template modules are provided).

### Not Possible to Automate
Some sites do not allow any automated data collection. For these, you can only use official APIs, affiliate programs, or manual export if available.

### Important Notes
- The system only collects summary data and links, not full descriptions or images.
- All data collection respects each website’s rules and legal requirements.
- If you want to add a new source, check with your developer or IT to see if it’s allowed and possible.

---

If you need help running the scripts or exporting data, ask your technical team or reach out for support.
