
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
  titleStatus?: number; // Add titleStatus property
  premiumFeatures?: string[];
  basePrice: number;
  carfaxData?: CarfaxData;
  photoScore?: number;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}

// Interface for adjustment calculators
export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null;
}
