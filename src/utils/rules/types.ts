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
  carfaxData?: any;
  photoScore?: number;
  equipmentIds?: number[];
  equipmentMultiplier?: number;
  equipmentValueAdd?: number;
  exteriorColor?: string;
  colorMultiplier?: number;
  fuelType?: string;
  fuelTypeMultiplier?: number;
  transmissionType?: string;
  transmissionMultiplier?: number;
  hasOpenRecall?: boolean;
  recallMultiplier?: number;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}

// Interface for adjustment calculators - updated to support async calculators
export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> | AdjustmentBreakdown | null;
}
