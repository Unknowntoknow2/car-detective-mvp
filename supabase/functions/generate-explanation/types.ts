
export interface Adjustment {
  factor: string;
  impact: number;
  description: string;
}

export interface ExplanationRequest {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  location: string;
  zipCode?: string;
  baseMarketValue: number;
  finalValuation: number;
  mileageAdj?: number;
  conditionAdj?: number;
  zipAdj?: number;
  featureAdjTotal?: number;
  adjustments?: Adjustment[];
}

export interface ExplanationResponse {
  explanation: string;
}
