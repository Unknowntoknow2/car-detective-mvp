
import { AICondition } from '@/types/photo';

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
}

export interface RulesEngineInput {
  basePrice?: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  transmissionType?: string; // Added for compatibility
  color?: string;
  photoScore?: number;
  recallCount?: number;
  accidentCount?: number;
  carfaxScore?: number;
  features?: string[];
  valuationId?: string;
  aiConditionOverride?: AICondition;
  // Additional properties for compatibility
  premiumFeatures?: boolean;
  equipmentIds?: string[];
  exteriorColor?: string;
  colorMultiplier?: number;
  fuelTypeMultiplier?: number;
  transmissionMultiplier?: number;
  hasOpenRecall?: boolean;
  recallMultiplier?: number;
  warrantyStatus?: string;
}

export type AdjustmentCalculator = (
  input: RulesEngineInput
) => AdjustmentBreakdown[];

export interface ValuationInput {
  baseMarketValue: number;
  vehicleYear: number;
  make: string;
  model: string;
  mileage: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  zipCode: string;
  features: string[];
  trim?: string;
  fuelType?: string;
  transmission?: string;
  accidentCount?: number;
  color?: string;
  premiumFeatures?: boolean;
  valuationId?: string;
  aiConditionOverride?: AICondition;
}
