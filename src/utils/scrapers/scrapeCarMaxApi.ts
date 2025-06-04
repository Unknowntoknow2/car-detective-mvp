// src/scripts/scrapeCarMaxApi.ts

import { fetchCarMaxApiListings } from "../utils/scrapers/carmax-api";

(async () => {
  const listings = await fetchCarMaxApiListings("Toyota", "Camry", "95814", 5);
  console.log("✅ CarMax API Listings:", listings);
})();
