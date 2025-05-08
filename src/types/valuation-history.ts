
export interface Valuation {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  created_at: string;
  vin?: string;
  plate?: string;
  state?: string;
  valuation?: number;
  estimated_value?: number;
  is_premium?: boolean;
}
