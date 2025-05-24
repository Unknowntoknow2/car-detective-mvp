
// src/scripts/scrapeFacebook.ts

import { fetchFacebookMarketplaceListings } from '../utils/scrapers/facebook';

(async () => {
  console.log('🔍 Running Facebook Marketplace mock search...');
  
  const results = await fetchFacebookMarketplaceListings('Toyota', 'Camry', '95814', 5);
  
  console.log('✅ Facebook Listings (Mock):', results);
  console.log(`Found ${results.length} mock listings`);
})();

