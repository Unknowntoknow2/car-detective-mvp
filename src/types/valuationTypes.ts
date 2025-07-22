
// Market search types for the OpenAI agent
export interface MarketSearchInput {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  zip?: string;
  zipCode?: string; // Alternative name for zip
}

// Re-export the canonical MarketListing type
export { MarketListing } from './marketListing';

export interface MarketPriceEstimate {
  estimatedPrice: number | null;
  average: number | null;
  median: number | null;
  min: number | null;
  max: number | null;
  stdDev: number | null;
  confidence: number; // 0–100 scale
  usedListings: MarketListing[];
}
