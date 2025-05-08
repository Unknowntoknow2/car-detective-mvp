
export interface Rule {
  name: string;
  description?: string;
  condition: boolean | ((input: RulesEngineInput) => boolean);
  consequence: any | ((input: RulesEngineInput) => any);
  priority?: number;
}

export interface RulesEngineInput {
  baseValue: number;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  trim?: string;
  bodyType?: string;
  // Add additional properties being used in demand adjustments
  saleDate?: string;
  bodyStyle?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
  carfaxData?: any;
  [key: string]: any; // Allow dynamic properties
}

export interface AdjustmentCalculator {
  calculate: (input: RulesEngineInput) => {
    factor: string;
    impact: number;
    description: string;
  };
}

export interface RuleResult {
  result: any;
  auditTrail: AdjustmentBreakdown[];
}

export interface AdjustmentBreakdown {
  name: string;
  value: number;
  description: string;
  percentAdjustment: number;
  factor?: string;
  impact?: number;
}

// Add enhanced interface to avoid errors in demand adjustments
export interface EnhancedRulesEngineInput extends RulesEngineInput {
  baseValue: number;
  saleDate?: string;
  bodyStyle?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
}
