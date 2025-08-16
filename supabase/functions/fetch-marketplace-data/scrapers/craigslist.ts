
export async function fetchCraigslistListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping Craigslist for:', { query, zipCode });
    
    // Craigslist search URL for cars
    const searchUrl = `https://${getRegionFromZip(zipCode)}.craigslist.org/search/ctd?query=${encodeURIComponent(query)}&purveyor-input=all&search_distance=50&postal=${zipCode}`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      console.warn(`Craigslist returned ${response.status}`);
      return [];
    }

    const html = await response.text();
    const listings: any[] = [];
    
    // Parse HTML using regex patterns (since DOMParser may not be available)
    const listingPattern = /<li class="result-row"[\s\S]*?<\/li>/g;
    const matches = html.match(listingPattern) || [];
    
    for (const match of matches.slice(0, 10)) {
      try {
        const priceMatch = match.match(/class="result-price">.*?\$(\d+(?:,\d{3})*)/);
        const titleMatch = match.match(/class="result-title hdrlnk"[^>]*>([^<]+)/);
        const linkMatch = match.match(/href="([^"]*)" class="result-title hdrlnk"/);
        const locationMatch = match.match(/class="result-hood".*?\(([^)]+)\)/);
        
        if (priceMatch && titleMatch && linkMatch) {
          const price = parseInt(priceMatch[1].replace(/,/g, ''));
          const title = titleMatch[1].trim();
          const url = linkMatch[1].startsWith('http') ? linkMatch[1] : `https://craigslist.org${linkMatch[1]}`;
          
          listings.push({
            id: `cl-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            price,
            mileage: extractMileageFromTitle(title),
            url,
            location: locationMatch ? locationMatch[1] : zipCode,
            platform: 'craigslist',
            vin: null,
            created_at: new Date().toISOString()
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse Craigslist listing:', parseError);
      }
    }

    console.log(`✅ Craigslist: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ Craigslist scraping failed:', error);
    return [];
  }
}

function getRegionFromZip(zipCode: string): string {
  const zipNum = parseInt(zipCode);
  
  // Map ZIP codes to Craigslist regions
  if (zipNum >= 10000 && zipNum <= 14999) return 'newyork';
  if (zipNum >= 90000 && zipNum <= 96199) return 'losangeles';
  if (zipNum >= 60000 && zipNum <= 60999) return 'chicago';
  if (zipNum >= 94000 && zipNum <= 94999) return 'sfbay';
  if (zipNum >= 30000 && zipNum <= 39999) return 'atlanta';
  if (zipNum >= 75000 && zipNum <= 75999) return 'dallas';
  if (zipNum >= 98000 && zipNum <= 99499) return 'seattle';
  if (zipNum >= 33000 && zipNum <= 34999) return 'miami';
  
  return 'sfbay'; // Default fallback
}

function extractMileageFromTitle(title: string): number {
  const mileageMatch = title.match(/(\d+),?(\d{3})?\s*(?:miles?|mi|k\s*miles)/i);
  if (mileageMatch) {
    return parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
  }
  return 0;
}
