
export interface Valuation {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  created_at: string; // This is required
  
  // Add back all the needed properties
  vin?: string;
  plate?: string;
  state?: string;
  valuation?: number;
  estimatedValue?: number;
  estimated_value?: number; // Some components use this naming convention
  is_premium?: boolean;
  premium_unlocked?: boolean;
  confidence_score?: number;
  condition_score?: number;
}
