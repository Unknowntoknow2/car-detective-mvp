
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
  titleStatus?: string;
  premiumFeatures?: string[];
  basePrice: number;
  carfaxData?: CarfaxData;
  photoScore?: number;
  equipmentIds?: number[]; // Added field for equipment IDs
  equipmentMultiplier?: number; // Added field for equipment multiplier
  equipmentValueAdd?: number; // Added field for equipment value add
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
