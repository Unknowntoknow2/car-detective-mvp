// eBay Motors scraper implementation
export async function fetchEbayMotorsListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping eBay Motors for:', { query, zipCode });
    
    // Format query for eBay Motors search
    const searchTerms = encodeURIComponent(query);
    const url = `https://www.ebay.com/sch/Cars-Trucks/6001/i.html?_nkw=${searchTerms}&_dcat=6001&_stpos=${zipCode}&_sop=1&_fosrp=1`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`eBay returned ${response.status}`);
    }

    const html = await response.text();
    const listings = [];

    // Parse eBay listings - they use structured data and specific CSS classes
    const itemRegex = /<div class="s-item__wrapper[^"]*"[\s\S]*?href="([^"]+)"[\s\S]*?<h3 class="s-item__title[^"]*">([^<]+)<\/h3>[\s\S]*?<span class="s-item__price[^"]*">([^<]+)<\/span>[\s\S]*?<span class="s-item__location[^"]*">([^<]*)<\/span>/g;
    
    let match;
    let count = 0;
    while ((match = itemRegex.exec(html)) !== null && count < 15) {
      const [, itemUrl, title, priceStr, location] = match;
      
      // Skip non-vehicle listings
      if (title.toLowerCase().includes('part') || title.toLowerCase().includes('wheel') || title.toLowerCase().includes('tire')) {
        continue;
      }
      
      const priceMatch = priceStr.match(/\$([\d,]+)/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/,/g, ''));
        
        if (price > 2000) { // Filter out parts/accessories
          // Extract mileage from title
          const mileageMatch = title.match(/(\d+),?(\d{3})?\s*mi/i);
          let mileage = 0;
          if (mileageMatch) {
            mileage = parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
          }

          listings.push({
            id: `ebay-${itemUrl.split('/').pop()?.split('?')[0]}`,
            title: title.trim(),
            price,
            mileage,
            url: itemUrl,
            location: location.trim(),
            platform: 'ebay',
            vin: null,
            created_at: new Date().toISOString()
          });
          count++;
        }
      }
    }

    // Also try to parse JSON-LD structured data if available
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">(\{[^<]+\})<\/script>/);
    if (jsonLdMatch && listings.length < 10) {
      try {
        const structuredData = JSON.parse(jsonLdMatch[1]);
        if (structuredData['@type'] === 'ItemList' && structuredData.itemListElement) {
          structuredData.itemListElement.slice(0, 10 - listings.length).forEach((item: any, index: number) => {
            if (item.item && item.item.offers && item.item.offers.price) {
              const price = parseInt(String(item.item.offers.price).replace(/[^\d]/g, ''));
              if (price > 2000) {
                listings.push({
                  id: `ebay-structured-${index}`,
                  title: item.item.name || 'eBay Vehicle Listing',
                  price,
                  mileage: extractMileageFromDescription(item.item.description || ''),
                  url: item.item['@id'] || item.item.url || '#',
                  location: zipCode,
                  platform: 'ebay',
                  vin: null,
                  created_at: new Date().toISOString()
                });
              }
            }
          });
        }
      } catch (parseError) {
        console.warn('Failed to parse eBay structured data:', parseError);
      }
    }

    console.log(`✅ eBay Motors: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ eBay Motors scraping failed:', error);
    return [];
  }
}

function extractMileageFromDescription(description: string): number {
  const mileageMatch = description.match(/(\d+),?(\d{3})?\s*(miles?|mi)/i);
  if (mileageMatch) {
    return parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
  }
  return 0;
}