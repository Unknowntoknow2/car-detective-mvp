
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
  saved_at: string;
  // Add a nested valuation object to match what's being used in the component
  valuation: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    estimatedValue: number;
    confidenceScore: number;
  };
}
