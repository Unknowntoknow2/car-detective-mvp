
export async function fetchOfferUpListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping OfferUp for:', { query, zipCode });
    
    // OfferUp search URL
    const searchUrl = `https://offerup.com/search/?q=${encodeURIComponent(query)}&category_id=4&location=${zipCode}&radius=50`;
    
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!response.ok) {
      console.warn(`OfferUp returned ${response.status} - likely blocked`);
      return [];
    }

    const html = await response.text();
    const listings: any[] = [];
    
    // OfferUp has heavy anti-bot measures, so we'll try basic pattern matching
    const listingPattern = /<div[^>]*data-testid="listing-card"[^>]*>[\s\S]*?<\/div>/g;
    const matches = html.match(listingPattern) || [];
    
    for (const match of matches.slice(0, 10)) {
      try {
        const priceMatch = match.match(/\$([0-9,]+)/);
        const titleMatch = match.match(/alt="([^"]+)"/);
        const linkMatch = match.match(/href="([^"]*)" /);
        
        if (priceMatch && titleMatch) {
          const price = parseInt(priceMatch[1].replace(/,/g, ''));
          const title = titleMatch[1].trim();
          const url = linkMatch ? `https://offerup.com${linkMatch[1]}` : '#';
          
          if (price > 1000 && price < 200000) {
            listings.push({
              id: `offerup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title,
              price,
              mileage: extractMileageFromTitle(title),
              url,
              location: zipCode,
              platform: 'offerup',
              vin: null,
              created_at: new Date().toISOString()
            });
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse OfferUp listing:', parseError);
      }
    }

    // If no listings found via parsing, OfferUp likely blocked the request
    if (listings.length === 0) {
      console.warn('⚠️ OfferUp: No listings found - likely blocked by anti-bot measures');
    }

    console.log(`✅ OfferUp: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ OfferUp scraping failed:', error);
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
