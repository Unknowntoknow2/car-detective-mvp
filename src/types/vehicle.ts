
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
  interiorColor?: string;
  zipCode?: string;
  vin?: string;
  drivetrain?: string;
  mileage?: number;
  condition?: string;
  seats?: string;
  doors?: string;
  displacement?: string;
  primaryPhoto?: string;
  photos?: string[];
  plate?: string;
  state?: string;
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
  trim_name: string;
  basePrice?: number;
  features?: string[];
}
