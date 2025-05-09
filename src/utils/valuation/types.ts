
import { type ValuationInput } from '@/types/valuation';
import { AdjustmentBreakdown } from '@/types/photo';
import { AICondition } from '@/types/photo';

export interface EnhancedValuationParams extends ValuationInput {
  // Original fields from ValuationInput plus additional fields
  identifierType?: 'vin' | 'plate' | 'manual' | 'photo';
  trim?: string;
  bodyType?: string;
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: boolean[] | string[];
  mpg?: number;
  aiConditionData?: any;
  aiConditionOverride?: AICondition;
  vehicleYear?: number;
  
  // Demand-related properties
  saleDate?: string;
  bodyStyle?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
  carfaxData?: any;
  
  // Add additional fields to fix errors
  zip?: string;
  baseMarketValue?: number;
  basePrice?: number; // Add basePrice property
  titleStatus?: string; // Add for compatibility with tests
}

export interface FinalValuationResult {
  // Core valuation data
  baseValue: number;
  basePrice?: number;
  adjustments: AdjustmentBreakdown[];
  finalValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  estimatedValue: number;
  explanation?: string;
  
  // Additional fields to match test expectations
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  photoScore?: number;
  bestPhotoUrl?: string | null;
  isPremium?: boolean;
  pdfUrl?: string;
  features?: string[];
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  };
  
  // Add any additional properties needed by the application
  valuationId?: string;
  vin?: string;
  regionalAdjustment?: number;
}

// Add ValuationParams and ValuationResult for backwards compatibility
export type ValuationParams = EnhancedValuationParams & { 
  baseMarketValue: number; // Make this required here
};
export type ValuationResult = FinalValuationResult;

// Add ValuationOutput for backward compatibility with existing code
export type ValuationOutput = FinalValuationResult;
