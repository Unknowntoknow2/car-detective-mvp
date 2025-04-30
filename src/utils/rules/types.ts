
import { CarfaxData } from '../carfax/mockCarfaxService';

export interface RulesEngineInput {
  make: string;
  model: string;
  year?: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  basePrice: number;
  carfaxData?: CarfaxData;
  photoScore?: number; // Add photo score to the input
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}

// Add the AdjustmentCalculator interface
export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null;
}
