export interface Valuation {
  id: string;
  user_id?: string;
  year?: number;
  make?: string;
  model?: string;
  mileage?: number;
  condition?: string;
<<<<<<< HEAD
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
=======
  created_at: string;

>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  vin?: string;
  plate?: string;
  state?: string;
  valuation?: number;
<<<<<<< HEAD
=======
  estimatedValue?: number;
  estimated_value?: number;
  is_premium?: boolean;
  premium_unlocked?: boolean;
  confidence_score?: number;
  condition_score?: number;
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
}
