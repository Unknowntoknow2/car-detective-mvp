// Facebook Marketplace scraper implementation  
export async function fetchFacebookMarketplaceListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping Facebook Marketplace for:', { query, zipCode });
    
    // Facebook Marketplace requires authentication and has strict anti-bot measures
    // For now, we'll use a limited approach that tries to access public data
    const searchUrl = `https://www.facebook.com/marketplace/search/?query=${encodeURIComponent(query)}&radius=50&latitude=${getLatFromZip(zipCode)}&longitude=${getLngFromZip(zipCode)}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      console.warn(`Facebook Marketplace returned ${response.status} - likely blocked`);
      return [];
    }

    const html = await response.text();
    
    // Facebook's structure is heavily obfuscated and changes frequently
    // Try to extract basic listing data from any JSON-LD or structured data
    const listings = [];
    
    // Look for JSON data in the page
    const jsonMatches = html.match(/\{"marketplace_search":\{[^}]+\}/g);
    if (jsonMatches) {
      for (const jsonMatch of jsonMatches.slice(0, 5)) {
        try {
          const data = JSON.parse(jsonMatch);
          if (data.marketplace_search && data.marketplace_search.feed) {
            data.marketplace_search.feed.edges.forEach((edge: any, index: number) => {
              if (edge.node && edge.node.listing && listings.length < 10) {
                const listing = edge.node.listing;
                if (listing.marketplace_listing_price && listing.marketplace_listing_title) {
                  listings.push({
                    id: `fb-${listing.id || index}`,
                    title: listing.marketplace_listing_title,
                    price: parseInt(listing.marketplace_listing_price.replace(/[^\d]/g, '')),
                    mileage: extractMileageFromTitle(listing.marketplace_listing_title),
                    url: `https://www.facebook.com/marketplace/item/${listing.id}`,
                    location: zipCode,
                    platform: 'facebook',
                    vin: null,
                    created_at: new Date().toISOString()
                  });
                }
              }
            });
          }
        } catch (parseError) {
          console.warn('Failed to parse Facebook JSON data:', parseError);
        }
      }
    }

    // If no structured data found, Facebook likely blocked the request
    if (listings.length === 0) {
      console.warn('⚠️ Facebook Marketplace: No listings found - likely blocked by anti-bot measures');
      // Return empty instead of fake data
      return [];
    }

    console.log(`✅ Facebook Marketplace: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ Facebook Marketplace scraping failed:', error);
    return [];
  }
}

// Simplified coordinate mapping for major ZIP codes
function getLatFromZip(zipCode: string): number {
  const zipNum = parseInt(zipCode);
  if (zipNum >= 10000 && zipNum <= 14999) return 40.7128; // NYC
  if (zipNum >= 90000 && zipNum <= 96199) return 34.0522; // LA
  if (zipNum >= 60000 && zipNum <= 60999) return 41.8781; // Chicago
  return 39.8283; // Default to center of US
}

function getLngFromZip(zipCode: string): number {
  const zipNum = parseInt(zipCode);
  if (zipNum >= 10000 && zipNum <= 14999) return -74.0060; // NYC
  if (zipNum >= 90000 && zipNum <= 96199) return -118.2437; // LA  
  if (zipNum >= 60000 && zipNum <= 60999) return -87.6298; // Chicago
  return -98.5795; // Default to center of US
}

function extractMileageFromTitle(title: string): number {
  const mileageMatch = title.match(/(\d+),?(\d{3})?\s*mi/i);
  if (mileageMatch) {
    return parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
  }
  return 0;
}