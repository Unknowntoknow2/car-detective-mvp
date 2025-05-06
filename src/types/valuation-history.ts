
export interface Valuation {
  id: string;
  created_at: string;
  make?: string | null;
  model?: string | null;
  year?: number | null;
  vin?: string | null;
  plate?: string | null;
  state?: string | null;
  estimated_value?: number | null;
  is_premium?: boolean;
  premium_unlocked?: boolean;
  valuation?: number | null;
  mileage?: number | null;
  
  // Adding missing properties that are used in MyValuationsPage
  condition?: string | null;
  confidence_score?: number | null;
  color?: string | null;
  body_style?: string | null;
  body_type?: string | null;
  fuel_type?: string | null;
  explanation?: string | null;
  transmission?: string | null;
}
