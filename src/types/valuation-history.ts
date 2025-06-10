
export interface ValuationHistory {
  id: string;
  vehicle_info: {
    make: string;
    model: string;
    year: number;
    vin?: string;
  };
  valuation_amount: number;
  created_at: string;
  is_premium: boolean;
}

export interface ValuationBreakdownItem {
  factor: string;
  adjustment: number;
  description: string;
}
