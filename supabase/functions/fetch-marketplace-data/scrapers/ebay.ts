
export async function fetchEbayMotorsListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping eBay Motors for:', { query, zipCode });
    
    // eBay Motors search URL
    const searchUrl = `https://www.ebay.com/sch/Cars-Trucks/6001/i.html?_nkw=${encodeURIComponent(query)}&_sop=1&_fpos=${zipCode}&_fsrp=1`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      console.warn(`eBay returned ${response.status}`);
      return [];
    }

    const html = await response.text();
    const listings: any[] = [];
    
    // Parse eBay listings using regex patterns
    const listingPattern = /<div class="s-item__wrapper[^>]*>[\s\S]*?<\/div>/g;
    const matches = html.match(listingPattern) || [];
    
    for (const match of matches.slice(0, 10)) {
      try {
        const priceMatch = match.match(/class="s-item__price"[^>]*>.*?\$([0-9,]+)/);
        const titleMatch = match.match(/class="s-item__title"[^>]*><span[^>]*>([^<]+)/);
        const linkMatch = match.match(/href="([^"]*)" class="s-item__link"/);
        
        if (priceMatch && titleMatch && linkMatch) {
          const price = parseInt(priceMatch[1].replace(/,/g, ''));
          const title = titleMatch[1].trim();
          const url = linkMatch[1];
          
          if (price > 1000 && price < 200000) { // Reasonable car price range
            listings.push({
              id: `ebay-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title,
              price,
              mileage: extractMileageFromTitle(title),
              url,
              location: zipCode,
              platform: 'ebay',
              vin: null,
              created_at: new Date().toISOString()
            });
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse eBay listing:', parseError);
      }
    }

    console.log(`✅ eBay Motors: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ eBay Motors scraping failed:', error);
    return [];
  }
}

function extractMileageFromTitle(title: string): number {
  const mileageMatch = title.match(/(\d+),?(\d{3})?\s*(?:miles?|mi)/i);
  if (mileageMatch) {
    return parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
  }
  return 0;
}
