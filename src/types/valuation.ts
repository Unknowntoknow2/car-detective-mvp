
export interface ValuationResult {
  id: string;
  estimatedValue?: number;
  estimated_value?: number;
  confidenceScore?: number;
  confidence_score?: number;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
  basePrice?: number;
  priceRange?: [number, number];
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  marketDemand?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AICondition {
  score: number;
  category: string;
  confidence: number;
  summary?: string;
  issuesDetected?: string[];
}

export interface Valuation {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  estimatedValue?: number;
  estimated_value?: number;
  confidenceScore?: number;
  confidence_score?: number;
  mileage?: number;
  condition?: string;
  createdAt?: string;
  updatedAt?: string;
}
