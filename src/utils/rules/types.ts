
export interface Rule {
  name: string;
  condition: any;
  consequence: any;
  priority?: number;
  description?: string;
}

export interface RulesEngineInput {
  [key: string]: any;
}

export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description: string;
}

export interface AdjustmentCalculator {
  calculate: (input: RulesEngineInput) => AdjustmentBreakdown[];
}
