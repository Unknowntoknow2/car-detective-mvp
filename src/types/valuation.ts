
export interface ValuationResult {
  id: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  estimated_value?: number;
  estimatedValue?: number;
  confidence_score?: number;
  confidenceScore?: number;
  mileage?: number;
  condition?: string;
  created_at: string;
  adjustments?: Array<{
    label: string;
    value: number;
  }>;
  price_range?: [number, number];
  priceRange?: [number, number];
}

export interface ValuationAdjustment {
  label: string;
  value: number;
  description?: string;
}

export interface ValuationFactor {
  name: string;
  impact: number;
  description?: string;
}
