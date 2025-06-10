
export interface AdjustmentBreakdown {
  factor: string;
  impact: number;
  description?: string;
}

export interface ValuationAdjustment {
  type: string;
  value: number;
  reason: string;
}
