
export interface DecodedVehicleInfo {
  make: string;
  model: string;
  year: number;
  trim?: string;
  bodyType?: string;
  bodyStyle?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  color?: string;
  exteriorColor?: string;
  zipCode?: string;
  vin?: string;
  drivetrain?: string;
  mileage?: number;
  seats?: number;
  primaryPhoto?: string;
  photos?: string[];
}

export interface PlateLookupInfo extends DecodedVehicleInfo {
  plate: string;
  state: string;
  estimatedValue?: number;
  registration?: {
    expires: string;
    status: string;
  };
}

export interface VehicleTrim {
  id: string;
  name: string;
  trim_name: string; // Added missing property
  basePrice?: number;
  features?: string[];
}
