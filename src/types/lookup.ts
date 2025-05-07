
export interface PlateLookupInfo {
  vin?: string;
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  mileage?: number;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
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
