
export interface SavedValuation {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  valuation: number;
  confidence_score: number;
  condition_score?: number;
  created_at: string;
  saved_at: string; // This matches the required property in the error
}
