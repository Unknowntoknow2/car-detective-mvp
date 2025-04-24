
import { VehicleCondition } from '../adjustments/types';

export interface AdjustmentBreakdown {
  label: string;
  value: number;
  description?: string;
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
}

export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null;
}
