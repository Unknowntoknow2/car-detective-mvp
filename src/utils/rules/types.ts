
export interface RulesEngineInput {
  make: string;
  model: string;
  year?: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  basePrice?: number;
  baseValue?: number; // Added for compatibility
  zipCode?: string;
  
  // Additional properties needed by calculators
  accidentCount?: number;
  carfaxData?: any;
  exteriorColor?: string;
  colorMultiplier?: number;
  hasOpenRecall?: boolean;
  transmission?: string;
  transmissionType?: string; // For backward compatibility
  transmissionMultiplier?: number;
  warrantyStatus?: string;
  
  // Any other properties that might be accessed
  [key: string]: any;
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
  name?: string;
  value?: number;
  percentAdjustment?: number;
}

export interface AdjustmentCalculator {
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown | Promise<AdjustmentBreakdown> | null | Promise<AdjustmentBreakdown | null>;
}

export interface EnhancedRulesEngineInput extends RulesEngineInput {
  baseValue?: number;
}
