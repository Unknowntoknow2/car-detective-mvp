
export interface PlateLookupInfo {
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  color?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  estimatedValue?: number;
  zipCode?: string;
  condition?: string;
}

export interface VINLookupResponse {
  success: boolean;
  data?: {
    make: string;
    model: string;
    year: number;
    trim?: string;
    engine?: string;
    transmission?: string;
  };
  error?: string;
}
