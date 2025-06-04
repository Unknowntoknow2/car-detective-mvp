import { fetchCarMaxListings } from "../utils/scrapers/carmax"; // Use relative import for CLI

(async () => {
  const listings = await fetchCarMaxListings("Toyota", "Camry", "95814", 5);
  console.log("✅ Listings:", listings);
})();
