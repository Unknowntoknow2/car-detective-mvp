
export interface AdjustmentCalculator {
  calculate: (input: RulesEngineInput) => {
    factor: string;
    impact: number;
    description: string;
    name?: string;
    value?: number;
    percentAdjustment?: number;
  } | Promise<{
    factor: string;
    impact: number;
    description: string;
    name?: string;
    value?: number;
    percentAdjustment?: number;
  }>;
}

export interface RulesEngineInput {
  baseValue: number;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  photoScore?: number;
  accidentCount?: number;
  premiumFeatures?: boolean[] | string[];
  mpg?: number;
  zipCode?: string;
  aiConditionData?: any;
  // Add properties used in calculators
  exteriorColor?: string;
  colorMultiplier?: number;
  carfaxData?: any;
  basePrice?: number;
  saleDate?: string;
  bodyStyle?: string;
}

export interface RuleResult {
  result: number | null;
  auditTrail: Array<{
    factor: string;
    impact: number;
    description: string;
    name?: string;
    value?: number;
    percentAdjustment?: number;
  }>;
}
