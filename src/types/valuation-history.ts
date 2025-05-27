
export interface Valuation {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
  photos?: string[];
  features?: string[];
  accidents?: boolean;
  accidentCount?: number;
  
  // Database snake_case properties for compatibility
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  estimated_value?: number;
  confidence_score?: number;
  accident_count?: number;
  is_premium?: boolean;
  premium_unlocked?: boolean;
  valuation?: number;
  plate?: string;
  state?: string;
}

export interface ValuationHistory {
  valuations: Valuation[];
  total: number;
  page: number;
  limit: number;
}
