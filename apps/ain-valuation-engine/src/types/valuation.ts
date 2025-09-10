// Stub for valuation
export interface AdjustmentBreakdown {
  label: string;
  amount: number;
  reason?: string;
}

// Example value for Google-level build hygiene
export const DefaultAdjustmentBreakdown: AdjustmentBreakdown = {
  label: 'Base',
  amount: 0,
};

export interface ValuationInput {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  zip?: string;
  radius?: number;
  condition_grade?: number;
  [k: string]: unknown;
}

export interface ValuationOutput {
  value: number;
  confidence?: number; // 0..1
  breakdown?: AdjustmentBreakdown[];
}
// Stub for valuation
declare module "@/types/valuation" {
  export type EnrichedVehicleProfile = any;
  export type ValuationInputs = any;
}
