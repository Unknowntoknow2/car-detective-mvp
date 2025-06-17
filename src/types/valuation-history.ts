
export interface Valuation {
  id: string;
  created_at: string;
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  estimated_value?: number;
  is_premium: boolean;
  premium_unlocked: boolean;
}
