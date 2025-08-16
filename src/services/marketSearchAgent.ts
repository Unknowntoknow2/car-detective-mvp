import { recordListingAudit } from '@/services/valuation/listingAuditService';
import type { MarketListing } from '@/types/valuation';

export interface MarketSearchInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  zipCode: string;
  radiusMiles?: number;
  valuationId?: string;
}

export interface MarketSearchResult {
  listings: MarketListing[];
  sources: string[];
  success: boolean;
  errors: string[];
}

export async function fetchMarketComps(input: MarketSearchInput): Promise<MarketSearchResult> {
  const { valuationId, make, model, year, zipCode } = input;
  const listings: MarketListing[] = [];
  const sources: string[] = [];
  const errors: string[] = [];

  // Enhanced parallel execution with timeout protection
  const searchPromises = [
    // Primary tier: Premium dealers
    fetchEchoParkListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
      .then(result => ({ source: 'EchoPark', result }))
      .catch(error => ({ source: 'EchoPark', error: error.message })),
    
    fetchCarsComListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode })
      .then(result => ({ source: 'Cars.com', result }))
      .catch(error => ({ source: 'Cars.com', error: error.message })),

    // Secondary tier: Marketplace scrapers
    fetchMarketplaceListings(make, model, year, zipCode)
      .then(result => ({ source: 'Marketplaces', result: { ok: true, listings: result } }))
      .catch(error => ({ source: 'Marketplaces', error: error.message }))
  ];

  // Execute all searches in parallel with timeout
  const results = await Promise.allSettled(
    searchPromises.map(promise => 
      Promise.race([
        promise,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Search timeout')), 20000)
        )
      ])
    )
  );

  // Process results
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const searchResult = result.value as any;
      
      if (searchResult.result && searchResult.result.ok && searchResult.result.listings) {
        const foundListings = Array.isArray(searchResult.result.listings) 
          ? searchResult.result.listings 
          : [];
        
        if (foundListings.length > 0) {
          listings.push(...foundListings);
          sources.push(searchResult.source);
          console.log(`✅ ${searchResult.source}: Found ${foundListings.length} listings`);
        } else {
          console.log(`ℹ️ ${searchResult.source}: No listings found`);
        }
      } else if (searchResult.error) {
        errors.push(`${searchResult.source}: ${searchResult.error}`);
        console.warn(`⚠️ ${searchResult.source}: ${searchResult.error}`);
      }
    } else {
      const sourceName = ['EchoPark', 'Cars.com', 'Marketplaces'][index];
      errors.push(`${sourceName}: ${result.reason}`);
      console.error(`❌ ${sourceName}: ${result.reason}`);
    }
  });

  console.log(`📊 Market search completed: ${listings.length} total listings from ${sources.length} sources`);

  return {
    listings: listings.slice(0, 50), // Limit to top 50 results
    sources,
    success: listings.length > 0,
    errors
  };
}

async function fetchMarketplaceListings(make: string, model: string, year: number, zipCode: string): Promise<MarketListing[]> {
  console.log(`🔍 Fetching marketplace listings for ${year} ${make} ${model} in ${zipCode}`);
  
  try {
    // Use the existing marketplace data edge function
    const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-marketplace-data?query=${year} ${make} ${model}&zip=${zipCode}&platform=all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY`
      }
    });

    if (!response.ok) {
      console.warn(`⚠️ Marketplace API failed: ${response.status}`);
      return [];
    }

    const result = await response.json();
    
    if (result.success && result.listings) {
      // Convert to MarketListing format
      const marketListings: MarketListing[] = result.listings.map((listing: any) => ({
        id: listing.id || `mkt-${Math.random().toString(36).substr(2, 9)}`,
        source: listing.source || listing.platform || 'Marketplace',
        url: listing.url || listing.listing_url || '#',
        price: typeof listing.price === 'number' ? listing.price : parseInt(String(listing.price || '0').replace(/[^\d]/g, '')),
        mileage: typeof listing.mileage === 'number' ? listing.mileage : parseInt(String(listing.mileage || '0').replace(/[^\d]/g, '')),
        year: listing.year || year,
        make: listing.make || make,
        model: listing.model || model,
        trim: listing.trim || '',
        location: listing.location || zipCode,
        condition: listing.condition || 'used',
        source_type: 'marketplace',
        fetchedAt: new Date().toISOString(),
        confidence_score: 75
      })).filter((listing: MarketListing) => 
        listing.price > 1000 && listing.price < 200000 // Basic validation
      );

      console.log(`✅ Marketplace listings: Found ${marketListings.length} valid listings`);
      return marketListings;
    }

    return [];

  } catch (error) {
    console.error('❌ Marketplace listings fetch failed:', error);
    return [];
  }
}

async function fetchEchoParkListings(args: { valuationId: string; make: string; model: string; year: number; zipCode: string }) {
  let httpStatus: number | undefined;
  let ok = false;
  let error: string | undefined;
  const listings: MarketListing[] = [];
  const maxRetries = 2;
  let retryCount = 0;

  while (retryCount <= maxRetries) {
    try {
      // Real EchoPark scraping with enhanced error handling
      const searchQuery = `${args.year} ${args.make} ${args.model}`.replace(/\s+/g, '+');
      const url = `https://www.echopark.com/search?query=${searchQuery}&zipCode=${args.zipCode}&radius=50`;
      
      console.log(`🔍 Fetching EchoPark listings (attempt ${retryCount + 1}):`, url);
      
      // Randomize user agent to avoid detection
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      ];
      const randomUA = userAgents[Math.floor(Math.random() * userAgents.length)];
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const res = await fetch(url, { 
        method: 'GET',
        headers: {
          'User-Agent': randomUA,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Cache-Control': 'no-cache'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      httpStatus = res.status;
      ok = res.ok;
      
      if (!ok) {
        if (res.status === 429 && retryCount < maxRetries) {
          console.warn(`⚠️ EchoPark rate limited, retrying in ${(retryCount + 1) * 2}s...`);
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
          retryCount++;
          continue;
        }
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      
      const html = await res.text();
      
      if (html.includes('blocked') || html.includes('captcha') || html.length < 1000) {
        if (retryCount < maxRetries) {
          console.warn('⚠️ EchoPark may have blocked request, retrying...');
          await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 3000));
          retryCount++;
          continue;
        }
        throw new Error('Request blocked or invalid response');
      }
      
      // Multiple parsing strategies for better reliability
      const patterns = [
        /"price":(\d+).*?"year":(\d+).*?"make":"([^"]+)".*?"model":"([^"]+)".*?"trim":"([^"]*)".*?"mileage":(\d+).*?"stockNumber":"([^"]+)".*?"detailUrl":"([^"]+)"/g,
        /{"vehicleId":"[^"]*","price":(\d+),"year":(\d+),"make":"([^"]+)","model":"([^"]+)","trim":"([^"]*)","mileage":(\d+),"stockNumber":"([^"]+)","url":"([^"]+)"/g,
        /price.*?:.*?(\d{4,}).*?year.*?:.*?(\d{4}).*?make.*?:.*?"([^"]+)".*?model.*?:.*?"([^"]+)".*?mileage.*?:.*?(\d+)/gi
      ];
      
      let parsed = false;
      for (const pattern of patterns) {
        let match;
        let count = 0;
        while ((match = pattern.exec(html)) !== null && count < 20) {
          const price = parseInt(match[1]);
          const year = parseInt(match[2]);
          const make = match[3];
          const model = match[4];
          const trim = match[5] || '';
          const mileage = parseInt(match[6] || '0');
          const stockNumber = match[7] || `ep-${Date.now()}-${count}`;
          const detailUrl = match[8] || `/inventory/${stockNumber}`;
          
          // Validate data quality
          if (price > 5000 && price < 200000 && year >= 2000 && mileage < 300000) {
            listings.push({
              id: `ep-${stockNumber}`,
              source: 'EchoPark',
              url: detailUrl.startsWith('http') ? detailUrl : `https://www.echopark.com${detailUrl}`,
              price,
              mileage,
              year,
              make: make.trim(),
              model: model.trim(),
              trim: trim.trim(),
              location: args.zipCode,
              condition: 'used',
              stock_number: stockNumber,
              dealer_name: 'EchoPark',
              source_type: 'dealer',
              fetchedAt: new Date().toISOString(),
              confidence_score: 88
            });
            count++;
            parsed = true;
          }
        }
        if (parsed) break;
      }

      console.log(`✅ EchoPark: Found ${listings.length} listings`);
      return { ok: true, httpStatus, listings };
      
    } catch (e: any) {
      error = e?.message ?? 'fetch_failed';
      if (retryCount >= maxRetries) {
        console.error('❌ EchoPark fetch failed after retries:', error);
        break;
      }
      console.warn(`⚠️ EchoPark attempt ${retryCount + 1} failed:`, error);
      retryCount++;
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }

  return { ok: false, httpStatus, error, listings: [] };
}

async function fetchCarsComListings(args: { valuationId: string; make: string; model: string; year: number; zipCode: string }) {
  let httpStatus: number | undefined;
  let ok = false;
  let error: string | undefined;
  const listings: MarketListing[] = [];

  try {
    // Real Cars.com scraping
    const makeFormatted = args.make.toLowerCase().replace(/\s+/g, '-');
    const modelFormatted = args.model.toLowerCase().replace(/\s+/g, '-');
    const url = `https://www.cars.com/shopping/results/?makes[]=${makeFormatted}&models[]=${makeFormatted}-${modelFormatted}&list_price_max=&list_price_min=&makes[]=${makeFormatted}&maximum_distance=50&models[]=${modelFormatted}&page_size=20&sort=relevance&stock_type=used&year_max=${args.year}&year_min=${args.year}&zip=${args.zipCode}`;
    
    console.log('🔍 Fetching Cars.com listings:', url);
    
    const res = await fetch(url, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Referer': 'https://www.cars.com/',
        'Connection': 'keep-alive'
      }
    });
    
    httpStatus = res.status;
    ok = res.ok;
    
    if (!ok) throw new Error(`HTTP ${res.status}`);
    
    const html = await res.text();
    
    // Parse Cars.com HTML for vehicle listings using improved regex patterns
    const listingRegex = /data-testid="vehicle-card"[\s\S]*?href="([^"]+)"[\s\S]*?data-qa="vehicle-price">[\$,]*?([\d,]+)[\s\S]*?mileage[^>]*>([^<]+)<[\s\S]*?title[^>]*>([^<]+)</g;
    
    let match;
    let count = 0;
    while ((match = listingRegex.exec(html)) !== null && count < 20) {
      const [, detailUrl, priceStr, mileageStr, title] = match;
      
      const price = parseInt(priceStr.replace(/,/g, ''));
      const mileage = parseInt(mileageStr.replace(/,/g, '').replace(/[^\d]/g, ''));
      
      // Extract vehicle details from title
      const titleMatch = title.match(/(\d{4})\s+([^,]+?)\s+([^,]+)/);
      if (titleMatch && price > 1000 && mileage > 0) {
        const [, year, make, model] = titleMatch;
        
        listings.push({
          id: `cars-${detailUrl.split('/').pop()}`,
          source: 'Cars.com',
          url: detailUrl.startsWith('http') ? detailUrl : `https://www.cars.com${detailUrl}`,
          price,
          mileage,
          year: parseInt(year),
          make: make.trim(),
          model: model.trim(),
          trim: '',
          location: args.zipCode,
          condition: 'used',
          source_type: 'marketplace',
          fetchedAt: new Date().toISOString(),
          confidence_score: 90
        });
        count++;
      }
    }

    // If regex parsing fails, try alternative JSON data extraction
    if (listings.length === 0) {
      const jsonDataMatch = html.match(/window\.__APOLLO_STATE__\s*=\s*({.*?});/);
      if (jsonDataMatch) {
        try {
          const apolloState = JSON.parse(jsonDataMatch[1]);
          // Extract vehicle data from Apollo GraphQL state
          Object.values(apolloState).forEach((item: any) => {
            if (item && item.price && item.mileage && item.year && listings.length < 20) {
              listings.push({
                id: `cars-apollo-${item.id || Math.random()}`,
                source: 'Cars.com',
                url: item.detailPageUrl || '#',
                price: parseInt(String(item.price).replace(/[^\d]/g, '')),
                mileage: parseInt(String(item.mileage).replace(/[^\d]/g, '')),
                year: item.year,
                make: item.make || args.make,
                model: item.model || args.model,
                trim: item.trim || '',
                location: item.location || args.zipCode,
                condition: 'used',
                source_type: 'marketplace',
                fetchedAt: new Date().toISOString(),
                confidence_score: 88
              });
            }
          });
        } catch (parseError) {
          console.warn('Failed to parse Apollo state:', parseError);
        }
      }
    }

    console.log(`✅ Cars.com: Found ${listings.length} listings`);
    return { ok: true, httpStatus, listings };
    
  } catch (e: any) {
    error = e?.message ?? 'fetch_failed';
    console.error('❌ Cars.com fetch failed:', error);
    return { ok: false, httpStatus, error, listings: [] };
  } finally {
    await recordListingAudit({
      valuationId: args.valuationId,
      source: 'Cars.com',
      api: { ok, httpStatus, error, retries: 0 },
      stageStatus: { market_search: ok }
    });
  }
}

export async function searchMarketListings(input: MarketSearchInput): Promise<MarketListing[]> {
  const result = await fetchMarketComps(input);
  return result.listings;
}