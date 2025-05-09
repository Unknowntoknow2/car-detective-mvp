

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
  basePrice?: number;
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
  // Additional properties used in calculators
  exteriorColor?: string;
  colorMultiplier?: number;
  carfaxData?: any;
  saleDate?: string;
  bodyStyle?: string;
  features?: string[];
  fuelTypeMultiplier?: number;
  transmissionType?: string;
  transmissionMultiplier?: number;
  warrantyStatus?: string;
  hasOpenRecall?: boolean;
  recallCount?: number;
  aiConditionOverride?: any;
  drivingProfile?: any;
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

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
}

export interface Rule {
  name: string;
  description?: string;
  condition: boolean | ((facts: RulesEngineInput) => boolean);
  consequence: any | ((facts: RulesEngineInput) => any);
  priority?: number;
}

