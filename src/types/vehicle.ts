
export interface DecodedVehicleInfo {
  vin?: string;
  plate?: string;
  state?: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  drivetrain?: string;
  doors?: number;
  seats?: number;
  color?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  valuationId?: string;
  isComplete?: boolean;
}

export interface VehicleLookupRequest {
  vin?: string;
  plate?: string;
  state?: string;
  zipCode?: string;
}

export interface VehicleLookupResponse {
  success: boolean;
  vehicle?: DecodedVehicleInfo;
  error?: string;
  message?: string;
}
