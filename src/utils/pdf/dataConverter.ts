
import { ValuationResult } from '@/types/valuation';

interface ConvertedData {
  vehicle: {
    year: number;
    make: string;
    model: string;
    vin?: string;
    mileage?: number;
    condition?: string;
    fuelType?: string;
    transmission?: string;
    bodyType?: string;
    color?: string;
    trim?: string;
  };
  valuation: {
    estimatedValue: number;
    confidenceScore?: number;
    priceRange?: { min: number; max: number };
    adjustments?: Array<{
      factor: string;
      impact: number;
      description?: string;
    }>;
  };
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected: string[];
  };
}

export const convertValuationData = (data: ValuationResult): ConvertedData => {
  // Handle price range - check if it's an object or array
  let priceRange: { min: number; max: number } | undefined;
  
  if (data.price_range) {
    if (typeof data.price_range === 'object' && 'low' in data.price_range && 'high' in data.price_range) {
      priceRange = {
        min: data.price_range.min || data.price_range.low,
        max: data.price_range.max || data.price_range.high
      };
    }
  } else if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length >= 2) {
    priceRange = {
      min: data.priceRange[0],
      max: data.priceRange[1]
    };
  }

  return {
    vehicle: {
      year: data.year,
      make: data.make,
      model: data.model,
      vin: data.vin,
      mileage: data.mileage,
      condition: data.condition,
      fuelType: data.fuelType,
      transmission: data.transmission,
      bodyType: data.bodyType,
      color: data.color,
      trim: data.trim
    },
    valuation: {
      estimatedValue: data.estimatedValue || data.estimated_value || 0,
      confidenceScore: data.confidenceScore || data.confidence_score,
      priceRange,
      adjustments: data.adjustments
    },
    aiCondition: data.aiCondition ? {
      condition: data.condition || 'Unknown',
      confidenceScore: data.confidenceScore || data.confidence_score || 0,
      issuesDetected: []
    } : undefined
  };
};
