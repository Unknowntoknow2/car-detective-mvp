import { calculateConfidenceScore } from './confidenceScore';
import rulesEngine, { AdjustmentBreakdown } from './rulesEngine';
import type { VehicleCondition } from './adjustments/types';

// Sample base prices for testing - in production this would come from a database
const SAMPLE_BASE_PRICES: Record<string, Record<string, number>> = {
  'Toyota': {
    'Camry': 25000,
    'Corolla': 20000,
    'RAV4': 28000
  },
  'Honda': {
    'Civic': 22000,
    'Accord': 27000,
    'CR-V': 29000
  },
  // Add more makes/models as needed
};

const DEFAULT_BASE_PRICE = 20000;

export interface ValuationInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zip?: string;
  condition: string;
  vin?: string;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  hasCarfax?: boolean;
}

export interface ValuationResult {
  basePrice: number;
  adjustments: AdjustmentBreakdown[];
  estimatedValue: number;
  confidenceScore: number;
  priceRange: [number, number];
}

/**
 * Get base price for a vehicle from our sample data
 */
function getBasePrice(make: string, model: string): number {
  return SAMPLE_BASE_PRICES[make]?.[model] || DEFAULT_BASE_PRICE;
}

/**
 * Calculate complete vehicle valuation including all adjustments
 */
export function calculateValuation(input: ValuationInput): ValuationResult {
  // Get base price from our sample data
  const basePrice = getBasePrice(input.make, input.model);
  
  // Calculate adjustments using the rules engine
  const adjustments = rulesEngine.calculateAdjustments({
    make: input.make,
    model: input.model,
    mileage: input.mileage,
    condition: input.condition,
    zipCode: input.zip,
    trim: input.trim,
    accidentCount: input.accidentCount,
    premiumFeatures: input.premiumFeatures,
    basePrice: basePrice
  });
  
  // Calculate total adjustment
  const totalAdjustment = rulesEngine.calculateTotalAdjustment(adjustments);

  // Calculate estimated value
  const estimatedValue = Math.round(basePrice + totalAdjustment);

  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore({
    vin: input.vin,
    zip: input.zip,
    mileage: input.mileage,
    year: input.year,
    make: input.make,
    model: input.model,
    condition: input.condition,
    hasCarfax: input.hasCarfax
  });

  // Calculate price range (±$500 or ±2.5% of estimated value, whichever is greater)
  const variation = Math.max(500, estimatedValue * 0.025);
  const priceRange: [number, number] = [
    Math.round(estimatedValue - variation),
    Math.round(estimatedValue + variation)
  ];

  return {
    basePrice,
    adjustments,
    estimatedValue,
    confidenceScore,
    priceRange
  };
}
