
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

export interface ValuationHistory {
  id: string;
  created_at: string;
  valuation_amount: number;
  vehicle_info: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  user_id?: string;
}

export interface ValuationBreakdownItem {
  factor: string;
  description: string;
  adjustment: number;
}
