
/**
 * Types for the generate-explanation edge function
 */

// Request payload type
export interface ExplanationRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  zipCode?: string;
  baseMarketValue: number;
  mileageAdj?: number;
  conditionAdj?: number;
  zipAdj?: number;
  featureAdjTotal?: number;
  finalValuation: number;
  adjustments?: AdjustmentFactor[];
}

// Adjustment factor definition
export interface AdjustmentFactor {
  factor: string;
  impact: number;
  description: string;
}

// Response data
export interface ExplanationResponse {
  explanation: string;
}
