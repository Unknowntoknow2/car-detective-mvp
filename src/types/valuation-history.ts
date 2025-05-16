
export interface Valuation {
  id: string;
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  condition?: string;
  estimatedValue?: number;
  created_at: string; // This is required
}
