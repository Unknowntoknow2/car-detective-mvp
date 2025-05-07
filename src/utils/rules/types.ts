
export interface Rule {
  name: string;
  condition: any;
  consequence: any;
  priority?: number;
  description?: string;
}

export interface RulesEngineInput {
  [key: string]: any;
  make: string;
  model: string;
  year: number;
  condition: string;
  mileage: number;
  zipCode?: string;
  basePrice?: number;
  accidentCount?: number;
}

export interface AdjustmentBreakdown {
  factor: string;  // Primary key used by newer code
  impact: number;  // Primary value used by newer code
  name?: string;   // Legacy field - supported for backward compatibility
  value?: number;  // Legacy field - supported for backward compatibility
  description: string;
  percentAdjustment?: number;
  
  // Adding these fields to support usage elsewhere in the codebase
  label?: string;
  amount?: number;
}

export interface AdjustmentCalculator {
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown[] | AdjustmentBreakdown | null | Promise<AdjustmentBreakdown | null>;
}
