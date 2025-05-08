
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  transmission?: string;
  fuelType?: string;
  // Adding missing properties
  engine?: string;
  drivetrain?: string;
  bodyType?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
}
