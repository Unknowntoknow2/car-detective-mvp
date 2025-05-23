
export interface ValuationResult {
  id: string;
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  body_type?: string;
  fuel_type?: string;
  transmission?: string;
  color?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  estimatedValue?: number;
  estimated_value?: number;
  accident_count?: number;
  manual_entry?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ValuationResponse {
  success: boolean;
  data?: ValuationResult;
  message?: string;
  error?: any;
}
