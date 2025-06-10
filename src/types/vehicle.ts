
export interface DecodedVehicleInfo {
  vin?: string;
  make?: string;
  model?: string;
  year?: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  drivetrain?: string;
  bodyStyle?: string;
  bodyType?: string;
  fuelType?: string;
  engineCylinders?: string;
  displacementL?: string;
  seats?: string;
  doors?: string;
  // Add missing properties that components expect
  mileage?: number;
  primaryPhoto?: string;
  photos?: string[];
  exteriorColor?: string;
  interiorColor?: string;
  condition?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  plate?: string;
  state?: string;
}

export interface VehicleTrim {
  id: string;
  trim_name: string;
  make_id?: string;
  model_id?: string;
  year?: number;
}

export interface Make {
  id: string;
  make_name: string;
  logo_url?: string | null;
  country_of_origin?: string | null;
  nhtsa_make_id?: number | null;
  popular?: boolean;
}

export interface Model {
  id: string;
  make_id: string;
  model_name: string;
  nhtsa_model_id?: string | null;
  popular: boolean;
}
