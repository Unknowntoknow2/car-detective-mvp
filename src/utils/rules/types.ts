
export interface RulesEngineInput {
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  basePrice?: number;
  zipCode?: string;
  trim?: string;
  fuelType?: string;
  photoScore?: number;
  features?: string[] | Record<string, boolean>;
  transmission?: string;
  recallCount?: number;
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
  calculate(input: RulesEngineInput): AdjustmentBreakdown | Promise<AdjustmentBreakdown>;
}

export interface Rule {
  name: string;
  description?: string;
  priority?: number;
  condition: boolean | ((facts: any) => boolean);
  consequence: any | ((facts: any) => any);
}
