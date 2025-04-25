
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
  valuation?: number | null;
}
