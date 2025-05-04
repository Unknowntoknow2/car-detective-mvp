
export interface SavedValuation {
  id: string;
  user_id: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  confidence_score: number;
  condition_score?: number;
  created_at: string;
  saved_at: string;
  
  // The nested valuation object that provides access to the data in the format used by components
  valuationDetails: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    estimatedValue: number;
    confidenceScore: number;
  };
}
