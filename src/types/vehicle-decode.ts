
export interface VehicleDecodeResponse {
  success: boolean;
  vin: string;
  source: 'nhtsa' | 'autoapi' | 'cache' | 'failed';
  decoded?: DecodedVehicleInfo;
  error?: string;
}

export interface DecodedVehicleInfo {
  vin: string;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyType?: string;
  fuelType?: string;
  engineCylinders?: string;
  displacementL?: string;
  seats?: string;
  doors?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  mileage?: number;
  condition?: string;
  exteriorColor?: string;
  plate?: string;
  state?: string;
}
