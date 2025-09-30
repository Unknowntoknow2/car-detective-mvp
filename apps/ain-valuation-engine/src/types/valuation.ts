// Google-level: Add missing types for codeQuality.test.ts compatibility
export interface NHTSARecall {
  recallNumber: string;
  component: string;
  summary: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  issuedDate: string;
  isResolved: boolean;
}

export interface VehicleSpecification {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  [key: string]: any;
}

export interface EnrichedVehicleProfile {
  vin: string;
  make: string;
  model: string;
  year: number;
  features?: string[];
  recalls?: NHTSARecall[];
  specifications?: VehicleSpecification;
  [key: string]: any;
}
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
  export type ValuationInputs = any;
}
