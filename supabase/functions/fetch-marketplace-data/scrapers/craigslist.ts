// Real Craigslist scraper implementation
export async function fetchCraigslistListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping Craigslist for:', { query, zipCode });
    
    // Format query for Craigslist search
    const searchTerms = query.replace(/\s+/g, '+');
    const url = `https://${getAreaFromZip(zipCode)}.craigslist.org/search/cta?query=${searchTerms}&sort=date&hasPic=1&search_distance=50`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`Craigslist returned ${response.status}`);
    }

    const html = await response.text();
    const listings = [];

    // Parse Craigslist listings
    const listingRegex = /<a href="([^"]+)" class="result-title[^"]*"[^>]*>([^<]+)<\/a>[\s\S]*?<span class="result-price">(\$[\d,]+)<\/span>[\s\S]*?<span class="result-hood">([^<]*)<\/span>/g;
    
    let match;
    let count = 0;
    while ((match = listingRegex.exec(html)) !== null && count < 20) {
      const [, detailUrl, title, priceStr, location] = match;
      
      const price = parseInt(priceStr.replace(/[\$,]/g, ''));
      if (price > 1000) {
        // Extract mileage from title
        const mileageMatch = title.match(/(\d+k?)\s*mi/i);
        let mileage = 0;
        if (mileageMatch) {
          mileage = parseInt(mileageMatch[1].replace('k', '000'));
        }

        listings.push({
          id: `cl-${detailUrl.split('/').pop()}`,
          title: title.trim(),
          price,
          mileage,
          url: detailUrl.startsWith('http') ? detailUrl : `https://craigslist.org${detailUrl}`,
          location: location.trim().replace(/[()]/g, ''),
          platform: 'craigslist',
          vin: null,
          created_at: new Date().toISOString()
        });
        count++;
      }
    }

    console.log(`✅ Craigslist: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ Craigslist scraping failed:', error);
    return [];
  }
}

// Map ZIP codes to Craigslist areas (simplified mapping)
function getAreaFromZip(zipCode: string): string {
  const zipNum = parseInt(zipCode);
  
  // Major metro area mappings
  if (zipNum >= 10000 && zipNum <= 14999) return 'newyork'; // NYC area
  if (zipNum >= 90000 && zipNum <= 96199) return 'losangeles'; // LA area  
  if (zipNum >= 60000 && zipNum <= 60999) return 'chicago'; // Chicago area
  if (zipNum >= 77000 && zipNum <= 77999) return 'houston'; // Houston area
  if (zipNum >= 33000 && zipNum <= 34999) return 'miami'; // Miami area
  if (zipNum >= 94000 && zipNum <= 94999) return 'sfbay'; // SF Bay area
  if (zipNum >= 98000 && zipNum <= 99499) return 'seattle'; // Seattle area
  if (zipNum >= 85000 && zipNum <= 85999) return 'phoenix'; // Phoenix area
  if (zipNum >= 19000 && zipNum <= 19999) return 'philadelphia'; // Philadelphia area
  if (zipNum >= 30000 && zipNum <= 31999) return 'atlanta'; // Atlanta area
  
  // Default to nearest major city
  return 'newyork';
}