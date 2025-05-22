
export interface RulesEngineInput {
  baseValue?: number;
  basePrice?: number;
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
  premiumFeatures?: boolean[] | string[];
  aiConditionOverride?: any;
  photoScore?: number;
  carfaxData?: any;
  // Additional fields needed by calculators
  colorMultiplier?: number;
  hasOpenRecall?: boolean;
  warrantyStatus?: string;
  drivingScore?: number;
  bodyType?: string;
  bodyStyle?: string;
}

// Alias for backward compatibility
export type EnhancedRulesEngineInput = RulesEngineInput;

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}

export interface AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | Promise<AdjustmentBreakdown>;
}

export interface Rule {
  name: string;
  description: string;
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown | Promise<AdjustmentBreakdown>;
}
