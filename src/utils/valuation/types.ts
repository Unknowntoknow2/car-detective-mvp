
export interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  zip?: string;
  zipCode?: string; // Add this to match ValuationInput requirement
  features?: string[];
  aiConditionData?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  };
}

export interface ValuationResult {
  baseValue: number;
  adjustments: AdjustmentFactor[];
  finalValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  explanation?: string;
}

export interface AdjustmentFactor {
  name: string;
  value: number;
  percentAdjustment: number;
  description: string;
  factor?: string;
  impact?: number;
  adjustment?: number;
  impactPercentage?: number;
}

export interface EnhancedValuationParams extends ValuationParams {
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: string[];
  mpg?: number;
  zipCode: string; // Make zipCode required to match ValuationInput requirement
}

export interface FinalValuationResult {
  baseValue: number;
  adjustments: AdjustmentFactor[];
  finalValue: number;
  confidenceScore: number;
  priceRange: [number, number];
  estimatedValue: number;
  explanation?: string; // Add explanation field for buildValuationReport
}
