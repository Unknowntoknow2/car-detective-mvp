import { fetchCarsDotComListings } from "../utils/scrapers/carsdotcom";

(async () => {
  const results = await fetchCarsDotComListings("Toyota", "Camry", "95814", 5);
  console.log("✅ Cars.com Listings:", results);
})();
