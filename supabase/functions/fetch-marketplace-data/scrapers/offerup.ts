// OfferUp scraper implementation
export async function fetchOfferUpListings(query: string, zipCode: string) {
  try {
    console.log('🔍 Scraping OfferUp for:', { query, zipCode });
    
    // Format query for OfferUp search
    const searchTerms = encodeURIComponent(query);
    const url = `https://offerup.com/search/?q=${searchTerms}&radius=50&location=${zipCode}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://offerup.com/',
        'Connection': 'keep-alive'
      }
    });

    if (!response.ok) {
      throw new Error(`OfferUp returned ${response.status}`);
    }

    const html = await response.text();
    const listings = [];

    // OfferUp uses React/SPA architecture, so look for data in JSON scripts
    const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/);
    
    if (nextDataMatch) {
      try {
        const nextData = JSON.parse(nextDataMatch[1]);
        const searchResults = nextData?.props?.pageProps?.searchResults?.data || [];
        
        searchResults.slice(0, 15).forEach((item: any, index: number) => {
          if (item.title && item.price && item.price > 2000) {
            // Filter out non-vehicle items
            const title = item.title.toLowerCase();
            if (!title.includes('part') && !title.includes('wheel') && !title.includes('tire')) {
              
              // Extract mileage from title or description
              const mileageMatch = (item.title + ' ' + (item.description || '')).match(/(\d+),?(\d{3})?\s*(miles?|mi)/i);
              let mileage = 0;
              if (mileageMatch) {
                mileage = parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
              }

              listings.push({
                id: `offerup-${item.id || index}`,
                title: item.title,
                price: parseInt(String(item.price)),
                mileage,
                url: `https://offerup.com/item/detail/${item.id}`,
                location: item.location?.display_name || zipCode,
                platform: 'offerup',
                vin: null,
                created_at: new Date().toISOString()
              });
            }
          }
        });
      } catch (parseError) {
        console.warn('Failed to parse OfferUp Next.js data:', parseError);
      }
    }

    // Fallback: try to parse HTML elements if JSON parsing fails
    if (listings.length === 0) {
      const itemRegex = /<a[^>]+href="([^"]*\/item\/detail\/[^"]*)"[^>]*>[\s\S]*?<h2[^>]*>([^<]+)<\/h2>[\s\S]*?\$([0-9,]+)[\s\S]*?<p[^>]*>([^<]*)<\/p>/g;
      
      let match;
      let count = 0;
      while ((match = itemRegex.exec(html)) !== null && count < 10) {
        const [, itemUrl, title, priceStr, description] = match;
        
        const price = parseInt(priceStr.replace(/,/g, ''));
        if (price > 2000) {
          // Extract mileage from title or description
          const mileageMatch = (title + ' ' + description).match(/(\d+),?(\d{3})?\s*(miles?|mi)/i);
          let mileage = 0;
          if (mileageMatch) {
            mileage = parseInt(mileageMatch[1] + (mileageMatch[2] || ''));
          }

          listings.push({
            id: `offerup-html-${count}`,
            title: title.trim(),
            price,
            mileage,
            url: itemUrl.startsWith('http') ? itemUrl : `https://offerup.com${itemUrl}`,
            location: zipCode,
            platform: 'offerup',
            vin: null,
            created_at: new Date().toISOString()
          });
          count++;
        }
      }
    }

    console.log(`✅ OfferUp: Found ${listings.length} listings`);
    return listings;

  } catch (error) {
    console.error('❌ OfferUp scraping failed:', error);
    return [];
  }
}