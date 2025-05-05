
import { AdjustmentBreakdown } from '../rules/types';

export interface ValuationParams {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zip?: string;
  trim?: string;
  accidentCount?: number;
  titleStatus?: string;
  premiumFeatures?: string[];
  mpg?: number | null;
  osmData?: any;
  censusData?: any;
}

export interface ValuationResult {
  estimatedValue: number;
  basePrice: number;
  adjustments: AdjustmentBreakdown[];
  priceRange: [number, number];
  confidenceScore: number;
}
