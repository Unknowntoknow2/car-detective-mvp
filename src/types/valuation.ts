
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
    label?: string;
    factor: string;
    value?: number;
    impact: number;
    description?: string;
  }>;
  price_range?: [number, number] | { low: number; high: number; min: number; max: number };
  priceRange?: [number, number];
  features?: string[];
  pdfUrl?: string;
  gptExplanation?: string;
  explanation?: string;
}

export interface ValuationAdjustment {
  label?: string;
  factor: string;
  value?: number;
  impact: number;
  description?: string;
}

export interface ValuationFactor {
  name: string;
  impact: number;
  description?: string;
}
