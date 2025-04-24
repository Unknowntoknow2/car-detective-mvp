
import { VehicleCondition } from '../adjustments/types';
import { CarfaxData } from '../carfax/mockCarfaxService';

export interface AdjustmentBreakdown {
  label: string;
  value: number;
  description?: string;
  detailedAdjustments?: {
    factor: string;
    impact: number;
    description: string;
  }[];
}

export interface RulesEngineInput {
  make?: string;
  model?: string;
  year?: number;
  mileage: number;
  condition: string;
  zipCode?: string;
  trim?: string;
  accidentCount?: number;
  premiumFeatures?: string[];
  basePrice: number;
  carfaxData?: CarfaxData; // Add CARFAX data
}

export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null;
}
