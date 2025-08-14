# MANUAL_INTEGRATION_GUIDE.md

This document lists provider modules that cannot be completed 100% automatically due to lack of public APIs or legal scraping options. For these sources, use manual export, third-party tools, or future integration if/when access becomes available.

## Manual/Template Providers

- CarMax (`provider_carmax.py`)
- Carvana (`provider_carvana.py`)
- CarGurus (`provider_cargurus.py`)
- Oodle (`provider_oodle.py`)
- CarSoup (`provider_carsoup.py`)
- Truckbay (`provider_truckbay.py`)
- TRED (`provider_tred.py`)

### Instructions
- Check the provider module for the required data fields and normalization logic.
- Export data manually from the website or use a third-party data provider.
- Save the exported data as a CSV and place it in the project directory.
- Use the normalization function in the provider module to convert raw data to the canonical schema.
- Aggregate with other sources using `aggregate_all_sources.py`.

> Note: Attempting to scrape these sites without permission may violate their terms of service. Only use legal, compliant methods.
