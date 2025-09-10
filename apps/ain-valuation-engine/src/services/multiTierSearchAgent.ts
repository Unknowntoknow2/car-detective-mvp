import type { MarketListing } from '@/types/marketListing';
import { fetchMarketListings } from './marketSearchAgent';

export interface MultiTierInput {
  vin?: string; year: number; make: string; model: string; trim?: string;
  zipcode?: string; radiusMiles?: number;
}

export async function multiTierSearch(input: MultiTierInput): Promise<MarketListing[]> {
  const { listings } = await fetchMarketListings(input);
  return listings;
}

// Back-compat exports for any older callers:
export { fetchMarketListings };
