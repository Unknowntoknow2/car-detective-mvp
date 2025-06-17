
export interface DecodedVehicleInfo {
  vin?: string;
  plate?: string;
  state?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  drivetrain?: string;
  exteriorColor?: string;
  interiorColor?: string;
  doors?: string;
  seats?: string;
  displacement?: string;
  mileage?: number;
  condition?: string;
  photos?: string[];
  primaryPhoto?: string;
  confidenceScore?: number;
  color?: string;
  estimatedValue?: number;
  zipCode?: string; // Add missing property
}

export interface VehicleTrim {
  id: string;
  trim_name: string;
  make_id?: string;
  model_id?: string;
}

export interface PlateLookupInfo {
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  estimatedValue?: number;
  color?: string;
}
