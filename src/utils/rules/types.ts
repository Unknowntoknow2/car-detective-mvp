
/**
 * Types for the rules engine
 */

export interface RulesEngineInput {
  basePrice: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  features?: string[];
  accidentCount?: number;
  color?: string;
  premiumFeatures?: boolean;
  aiConditionOverride?: any;
  photoScore?: number;
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
}

export interface Rule {
  id: string;
  name: string;
  description: string;
  calculate: (input: RulesEngineInput) => number;
  getDescription: (input: RulesEngineInput, impact: number) => string;
}
