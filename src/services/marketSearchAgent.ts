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
    // Mock API call - replace with actual EchoPark API
    const url = `https://api.echopark.com/inventory/search?make=${args.make}&model=${args.model}&year=${args.year}&zip=${args.zipCode}`;
    const res = await fetch(url, { 
      method: 'GET',
      headers: {
        'User-Agent': 'CarDetective/1.0'
      }
    });
    
    httpStatus = res.status;
    ok = res.ok;
    
    if (!ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    
    // Normalize EchoPark listings to MarketListing format
    if (data.vehicles) {
      for (const vehicle of data.vehicles.slice(0, 20)) {
        listings.push({
          id: vehicle.id || `ep-${Math.random()}`,
          source: 'EchoPark',
          url: vehicle.detailUrl || '',
          price: vehicle.price || 0,
          mileage: vehicle.mileage || 0,
          year: vehicle.year || args.year,
          make: vehicle.make || args.make,
          model: vehicle.model || args.model,
          trim: vehicle.trim || '',
          location: vehicle.location || args.zipCode,
          condition: 'used',
          photos: vehicle.photos || [],
          listingDate: new Date().toISOString()
        });
      }
    }

    return { ok: true, httpStatus, listings };
  } catch (e: any) {
    error = e?.message ?? 'fetch_failed';
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
    // Mock API call - replace with actual Cars.com scraping/API
    const url = `https://www.cars.com/shopping/results/?make=${args.make}&model=${args.model}&year=${args.year}&zip=${args.zipCode}`;
    
    // Simulate network delay and potential failure
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
    
    if (Math.random() > 0.8) {
      throw new Error('Rate limited');
    }
    
    httpStatus = 200;
    ok = true;
    
    // Mock data - replace with actual scraping results
    const mockListings = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
      id: `cars-${args.make}-${i}`,
      source: 'Cars.com',
      url: `https://www.cars.com/vehicledetail/${i}`,
      price: Math.floor(Math.random() * 20000) + 15000,
      mileage: Math.floor(Math.random() * 80000) + 20000,
      year: args.year,
      make: args.make,
      model: args.model,
      trim: ['SE', 'LE', 'XLE', 'Limited'][Math.floor(Math.random() * 4)],
      location: args.zipCode,
      condition: 'used',
      photos: Array.from({ length: Math.floor(Math.random() * 20) + 5 }, (_, j) => `photo${j}.jpg`),
      listingDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
    }));

    listings.push(...mockListings);
    
    return { ok: true, httpStatus, listings };
  } catch (e: any) {
    error = e?.message ?? 'fetch_failed';
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