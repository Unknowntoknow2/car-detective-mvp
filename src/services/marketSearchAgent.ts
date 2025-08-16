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

  // Try EchoPark
  try {
    const echoParkResult = await fetchEchoParkListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode });
    if (echoParkResult.ok && echoParkResult.listings.length > 0) {
      listings.push(...echoParkResult.listings);
      sources.push('EchoPark');
    }
  } catch (error) {
    errors.push(`EchoPark: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  // Try Cars.com
  try {
    const carsComResult = await fetchCarsComListings({ valuationId: valuationId || crypto.randomUUID(), make, model, year, zipCode });
    if (carsComResult.ok && carsComResult.listings.length > 0) {
      listings.push(...carsComResult.listings);
      sources.push('Cars.com');
    }
  } catch (error) {
    errors.push(`Cars.com: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return {
    listings,
    sources,
    success: listings.length > 0,
    errors
  };
}

async function fetchEchoParkListings(args: { valuationId: string; make: string; model: string; year: number; zipCode: string }) {
  let httpStatus: number | undefined;
  let ok = false;
  let error: string | undefined;
  const listings: MarketListing[] = [];

  try {
    // Real EchoPark scraping - use their search endpoint
    const searchQuery = `${args.year} ${args.make} ${args.model}`.replace(/\s+/g, '+');
    const url = `https://www.echopark.com/search?query=${searchQuery}&zipCode=${args.zipCode}&radius=50`;
    
    console.log('🔍 Fetching EchoPark listings:', url);
    
    const res = await fetch(url, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1'
      }
    });
    
    httpStatus = res.status;
    ok = res.ok;
    
    if (!ok) throw new Error(`HTTP ${res.status}`);
    
    const html = await res.text();
    
    // Parse EchoPark HTML for vehicle listings
    const vehiclesRegex = /"price":(\d+).*?"year":(\d+).*?"make":"([^"]+)".*?"model":"([^"]+)".*?"trim":"([^"]*)".*?"mileage":(\d+).*?"stockNumber":"([^"]+)".*?"detailUrl":"([^"]+)"/g;
    
    let match;
    let count = 0;
    while ((match = vehiclesRegex.exec(html)) !== null && count < 20) {
      const [, price, year, make, model, trim, mileage, stockNumber, detailUrl] = match;
      
      listings.push({
        id: `ep-${stockNumber}`,
        source: 'EchoPark',
        url: `https://www.echopark.com${detailUrl}`,
        price: parseInt(price),
        mileage: parseInt(mileage),
        year: parseInt(year),
        make,
        model,
        trim: trim || '',
        location: args.zipCode,
        condition: 'used',
        stock_number: stockNumber,
        dealer_name: 'EchoPark',
        source_type: 'dealer',
        fetchedAt: new Date().toISOString(),
        confidence_score: 85
      });
      count++;
    }

    console.log(`✅ EchoPark: Found ${listings.length} listings`);
    return { ok: true, httpStatus, listings };
    
  } catch (e: any) {
    error = e?.message ?? 'fetch_failed';
    console.error('❌ EchoPark fetch failed:', error);
    return { ok: false, httpStatus, error, listings: [] };
  } finally {
    await recordListingAudit({
      valuationId: args.valuationId,
      source: 'EchoPark',
      api: { ok, httpStatus, error, retries: 0 },
      stageStatus: { market_search: ok }
    });
  }
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