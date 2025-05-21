
export interface Valuation {
  id: string;
  user_id?: string;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimated_value?: number;
  created_at: string;
  updated_at?: string;
  confidence_score?: number;
  status?: string;
  error_message?: string;
  is_premium?: boolean;
  paid_at?: string;
  stripe_session_id?: string;
  premium_unlocked?: boolean;
  accident_count?: number;
  titleStatus?: string;
  // Add missing fields needed by ValuationTable.tsx
  vin?: string;
  plate?: string;
  state?: string;
  valuation?: number;
}
