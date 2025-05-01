
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
  recallCount?: number; // Added this field
  recallMultiplier?: number;
  warrantyStatus?: string;
  warrantyMultiplier?: number;
  saleDate?: string | Date;
  bodyStyle?: string;
  drivingProfile?: string;
  drivingProfileMultiplier?: number;
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
