
export interface Valuation {
  id: string;
  make: string;
  model: string;
  year: number;
  estimated_value: number;
  confidence_score: number;
  mileage?: number;
  condition?: string;
  fuel_type?: string;
  zip_code?: string;
  body_type: string;
  color: string;
  condition_score: number;
  created_at: string;
  is_vin_lookup: boolean;
}
