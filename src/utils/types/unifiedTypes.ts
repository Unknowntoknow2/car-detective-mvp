// Unified Type Definitions - Single Source of Truth
// Consolidates all valuation and market listing types

export interface ValuationInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
}

export interface ValuationResult {
  success: boolean;
  estimatedValue: number;
  confidenceScore: number;
  baseValue: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
    percentage?: number;
  }>;
  priceRange: [number, number];
  dataSourcesUsed: string[];
  marketListingsCount: number;
  error?: string;
}

export interface MarketListing {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  mileage: number;
  condition?: string;
  listing_url: string;
  source: string;
  dealer_name?: string;
  location?: string;
  photos?: string[];
  listing_date: string;
  confidence_score: number;
  created_at: string;
  updated_at: string;
  fetched_at: string;
}

// Adjustment types
export interface Adjustment {
  factor: string;
  impact: number;
  description: string;
  percentage?: number;
}