
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
  // Original fields used in the code base
  name?: string;   
  value?: number;  
  description: string;
  percentAdjustment?: number;
  
  // New fields required by type check
  factor?: string;  
  impact?: number;  
  
  // Additional fields to support other parts of the codebase
  label?: string;
  amount?: number;
}

export interface AdjustmentCalculator {
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown[] | AdjustmentBreakdown | null | Promise<AdjustmentBreakdown | null>;
}
