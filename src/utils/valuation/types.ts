
import { AdjustmentBreakdown } from '../rules/types';

export interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zip?: string;
  trim?: string;
  transmission?: string;
  fuelType?: string;
  accidentCount?: number;
  titleStatus?: string;
  premiumFeatures?: string[];
  mpg?: number | null;
  osmData?: any;
  censusData?: any;
  aiConditionData?: {
    condition: 'Excellent' | 'Good' | 'Fair' | 'Poor' | null;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  } | null;
}

export interface ValuationResult {
  estimatedValue: number;
  basePrice: number;
  adjustments: AdjustmentBreakdown[];
  priceRange: [number, number];
  confidenceScore: number;
}
