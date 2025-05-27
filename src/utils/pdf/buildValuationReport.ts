
import { ValuationResult } from '@/types/valuation';

interface ReportData {
  id: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  price: number;
  zipCode: string;
  vin: string;
  fuelType: string;
  transmission: string;
  color: string;
  bodyType: string;
  confidenceScore: number;
  isPremium: boolean;
  priceRange: [number, number];
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  generatedAt: string;
  explanation: string;
  userId: string;
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

export const buildValuationReport = (data: ValuationResult | null): ReportData => {
  if (!data) {
    return {
      id: 'N/A',
      make: 'N/A',
      model: 'N/A',
      year: 0,
      mileage: 0,
      condition: 'N/A',
      price: 0,
      zipCode: 'N/A',
      vin: 'N/A',
      fuelType: 'N/A',
      transmission: 'N/A',
      color: 'N/A',
      bodyType: 'N/A',
      confidenceScore: 0,
      isPremium: false,
      priceRange: [0, 0],
      adjustments: [],
      generatedAt: new Date().toISOString(),
      explanation: 'N/A',
      userId: 'N/A',
      vehicle: {
        year: 0,
        make: 'N/A',
        model: 'N/A',
        vin: 'N/A',
        mileage: 0,
        condition: 'N/A',
        fuelType: 'N/A',
        transmission: 'N/A',
        bodyType: 'N/A',
        color: 'N/A',
        trim: 'N/A'
      },
      valuation: {
        estimatedValue: 0,
        confidenceScore: 0,
        priceRange: { min: 0, max: 0 },
        adjustments: []
      }
    };
  }

  // Handle price range - check if it's an object or array
  let priceRange: { min: number; max: number } | undefined;
  let priceRangeArray: [number, number] = [0, 0];
  
  if (data.price_range) {
    if (typeof data.price_range === 'object' && 'low' in data.price_range && 'high' in data.price_range) {
      priceRange = {
        min: data.price_range.min || data.price_range.low,
        max: data.price_range.max || data.price_range.high
      };
      priceRangeArray = [priceRange.min, priceRange.max];
    }
  } else if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length >= 2) {
    priceRange = {
      min: data.priceRange[0],
      max: data.priceRange[1]
    };
    priceRangeArray = [data.priceRange[0], data.priceRange[1]];
  }

  const adjustments = (data.adjustments || []).map(adj => ({
    factor: adj.factor || '',
    impact: adj.impact || 0,
    description: adj.description || ''
  }));

  return {
    id: data.id || 'N/A',
    make: data.make || 'N/A',
    model: data.model || 'N/A',
    year: data.year || 0,
    mileage: data.mileage || 0,
    condition: data.condition || 'N/A',
    price: data.estimatedValue || data.estimated_value || 0,
    zipCode: data.zipCode || 'N/A',
    vin: data.vin || 'N/A',
    fuelType: data.fuelType || 'N/A',
    transmission: data.transmission || 'N/A',
    color: data.color || 'N/A',
    bodyType: data.bodyType || 'N/A',
    confidenceScore: data.confidenceScore || data.confidence_score || 0,
    isPremium: data.isPremium || data.premium_unlocked || false,
    priceRange: priceRangeArray,
    adjustments,
    generatedAt: new Date().toISOString(),
    explanation: data.explanation || data.gptExplanation || 'N/A',
    userId: data.userId || 'N/A',
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
