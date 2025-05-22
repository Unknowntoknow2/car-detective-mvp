
export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  engine?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  exteriorColor?: string;
  interiorColor?: string;
  drivetrain?: string;
  features?: string[];
}

export interface VehicleDetails extends DecodedVehicleInfo {
  mileage?: number;
  condition?: string;
  price?: number;
  zipCode?: string;
  state?: string;
}

export interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  conditionScore?: number;
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
}

export interface VinDecoderResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface PlateLookupResponse {
  success: boolean;
  data?: {
    make: string;
    model: string;
    year: number;
    color?: string;
    vin?: string;
  };
  error?: string;
}

export interface ManualValuationResponse {
  success: boolean;
  data?: ValuationResponse;
  error?: string;
}
