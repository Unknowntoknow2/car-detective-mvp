
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
