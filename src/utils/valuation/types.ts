
import { type ValuationInput } from '@/types/valuation';

export interface EnhancedValuationParams extends ValuationInput {
  // Original fields from ValuationInput plus additional fields
  identifierType?: 'vin' | 'plate' | 'manual' | 'photo';
  trim?: string;
  bodyType?: string;
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: boolean[];
  mpg?: number;
  aiConditionData?: any;
  
  // Demand-related properties
  saleDate?: string;
  bodyStyle?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
  
  // Add additional fields to fix errors
  zip?: string;
}

export interface FinalValuationResult {
  // Core valuation data
  baseValue: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
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
  };
  
  // Add any additional properties needed by the application
  valuationId?: string;
  vin?: string;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
}
