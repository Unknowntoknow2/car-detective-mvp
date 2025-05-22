
export interface ValuationResponse {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: string;
  estimatedValue: number;
  confidenceScore?: number;
  valuationId: string;
  // Additional fields
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  color?: string;
  accidents?: number;
  trim?: string;
  vin?: string;
  // Any additional properties
  [key: string]: any;
}
