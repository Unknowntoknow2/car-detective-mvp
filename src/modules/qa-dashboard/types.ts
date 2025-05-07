
export interface Valuation {
  id: string;
  created_at: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: string;
  confidence_score: number;
  source_type: 'vin' | 'plate' | 'manual';
  is_premium: boolean;
  estimated_value: number;
  explanation?: string;
  user_id?: string;
  zip_code?: string;
}

export interface HealthMetrics {
  gptExplanationRate: number;
  photoScoringRate: number;
  pdfSuccessRate: number;
  paymentMatchRate: number;
}
