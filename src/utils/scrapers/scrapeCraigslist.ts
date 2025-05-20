// ✅ File: src/scripts/scrapeCraigslist.ts

import { fetchCraigslistListings } from '../utils/scrapers/craigslist';

(async () => {
  const listings = await fetchCraigslistListings('Toyota', 'Camry', '95814', 5);
  console.log('✅ Craigslist Listings:', listings);
})();
