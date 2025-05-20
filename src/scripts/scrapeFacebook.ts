// src/scripts/scrapeFacebook.ts

import { fetchFacebookMarketplaceListings } from '../utils/scrapers/facebook';

(async () => {
  const results = await fetchFacebookMarketplaceListings('Toyota', 'Camry', '95814', 5);
  console.log('✅ Facebook Listings:', results);
})();
