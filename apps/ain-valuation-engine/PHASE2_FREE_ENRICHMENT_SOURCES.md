# Phase 2: Free/Public Enrichment Sources for Vehicle Data

This table summarizes free and open resources for enriching vehicle records in Phase 2, covering title history, recalls, auction data, and more. Each source is mapped to an enrichment category, with notes on data scope and limitations.

| Enrichment category            | Free resource & description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                | Evidence & usage notes |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| **Title/ownership history**    | **Approved NMVTIS provider list ([VehicleHistory.gov](https://vehiclehistory.bja.ojp.gov))** – The U.S. DOJ lists Bumper.com, Carsforsale.com, CarVertical, CheckThatVIN, ClearVIN, EpicVIN, VINData, VINSmart, and others as approved NMVTIS data providers. These businesses sell vehicle history reports with NMVTIS info; there is **no free, full-history API**. Use this list to pick a provider or direct users to purchase a report. For a truly no-cost check, **NICB’s VINCheck** service provides a free stolen/salvage lookup but does not include ownership counts or branding details. | NMVTIS data is not free; use for prototyping, user direction, or fallback. NICB VINCheck is limited to theft/salvage flags. |
| **Recall data**                | **NHTSA Vehicle API & Recalls endpoint ([vpic.nhtsa.dot.gov](https://vpic.nhtsa.dot.gov/api/))** – The U.S. National Highway Traffic Safety Administration offers a public “vPIC” API; in the FAQ, NHTSA states “there is no licensing requirement” and the services “are free for use by the public.” Use `/recalls/recallsByVin/{vin}` on the [NHTSA API](https://api.nhtsa.gov/recalls/recallsByVin/{vin}) to retrieve open and closed recalls, including affected components and remedy info. This API is rate-limit-free for moderate use. | Official, free, reliable recall lookup for U.S. vehicles. |
| **Auction/service history**    | **Kaggle “Used Car Auction Prices” dataset** – A Kaggle dataset ([raw.githubusercontent.com](https://raw.githubusercontent.com/saadpasta/deploy-react-app/master/car_prices.csv)) provides historical sold used car data in the U.S. over ~2 years. The CSV is large and free to download, containing auction sale prices and features for building resale-value models. Use for analyzing auction performance and training price-prediction models.<br/>**CarDekho-based used car dataset** – An open dataset ([Kaggle](https://www.kaggle.com/nehalbirla/vehicle-dataset-from-cardekho)) includes 8,128 used car records with fuel type, year, miles driven, and number of owners. Useful for resale and usage pattern modeling. | Auction dataset = real U.S. auction prices. CarDekho dataset = real-world sale prices and owner count. No live per-VIN service/auction history. |
| **Historical resale patterns** | **CarDekho & Kaggle auction datasets** – These datasets supply time-stamped sale prices and vehicle attributes, suitable for computing depreciation curves and price volatility. CarDekho covers fuel type, year, km driven, owners, etc. Kaggle auction dataset adds U.S. auction sale prices for broader market trends. | Free, open, ideal for ML/analytics—not for real-time VIN lookup. |
| **Service history**            | **No comprehensive free API** – There is no widely available free service-history API. Allow users to upload maintenance receipts or self-report service events. Alternatively, select an NMVTIS provider who offers maintenance or odometer readings for a fee. | User-upload/self-report only for free; flag as “user-reported.” |

---

## Recommendations

- **Combine sources:** Use NHTSA’s recall API for unresolved safety recalls, and pair with VIN decoding for identification.
- **Leverage open datasets for modeling:** CarDekho and Kaggle auction datasets are free for building depreciation models and analyzing how year, fuel type, and mileage affect value.
- **Offer user-supplied data as fallback:** Since full title and service history aren’t free, prompt users to self-report title brands, number of owners, and service records. Flag this data as “user-reported” and give it lower confidence in valuation.
- **Monitor NMVTIS providers:** For production, plan to integrate a paid NMVTIS provider for legal title info and owner counts, but prototype with the above free resources.

---

### Key Links

- NMVTIS Providers: [vehiclehistory.bja.ojp.gov](https://vehiclehistory.bja.ojp.gov)
- NHTSA vPIC/Recalls API: [vpic.nhtsa.dot.gov/api/](https://vpic.nhtsa.dot.gov/api/)
- NICB VINCheck: [nicb.org/vincheck](https://www.nicb.org/vincheck)
- Kaggle Auction Dataset: [car_prices.csv](https://raw.githubusercontent.com/saadpasta/deploy-react-app/master/car_prices.csv)
- CarDekho Dataset: [Kaggle Vehicle Dataset](https://www.kaggle.com/nehalbirla/vehicle-dataset-from-cardekho)

---
