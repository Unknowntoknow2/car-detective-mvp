
// Basic type definitions for the rules engine

export interface RulesEngineInput {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  trim?: string;
  fuelType?: string;
  transmissionType?: string;
  accidentCount?: number;
  exteriorColor?: string;
  features?: string[];
  aiConditionOverride?: any;
  photoScore?: number;
  basePrice?: number;
  bodyType?: string;
  bodyStyle?: string;
  colorMultiplier?: number;
  baseValue?: number;
  drivingScore?: number;  // Added for DrivingBehaviorCalculator
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}
