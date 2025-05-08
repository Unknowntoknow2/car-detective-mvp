
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
