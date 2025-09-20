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

// MarketListing type moved to canonical location: src/types/marketListing.ts
// Import with: import { MarketListing } from '@/types/marketListing';

// Adjustment types
export interface Adjustment {
  factor: string;
  impact: number;
  description: string;
  percentage?: number;
}