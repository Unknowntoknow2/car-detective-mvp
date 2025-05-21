export interface ValuationResult {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  estimated_value?: number;
  confidence_score?: number;
  condition_score?: number;
  mileage?: number;
  vin?: string;
  zip_code?: string;
  created_at?: string;
  premium_unlocked?: boolean;
  // Add other valuation properties as needed
}
