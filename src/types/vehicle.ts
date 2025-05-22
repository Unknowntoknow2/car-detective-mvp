
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
  color?: string;
  exteriorColor?: string;
  interiorColor?: string;
  features?: string[];
}

export interface VinDecoderResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface PlateLookupResponse {
  success: boolean;
  data?: DecodedVehicleInfo;
  error?: string;
}

export interface ValuationResponse {
  estimatedValue: number;
  confidenceScore: number;
  valuationId: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  vin?: string;
  plate?: string;
  state?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  trim?: string;
  color?: string;
}

export interface VehicleIdentifier {
  type: 'vin' | 'plate' | 'manual';
  value: string;
  state?: string;
}
