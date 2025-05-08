
export interface DecodedVehicleInfo {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  transmission?: string;
  bodyType?: string;
  fuelType?: string;
  engine?: string;
  drivetrain?: string;
  color?: string;
  state?: string;
  plate?: string;
  zipCode?: string;
  mileage?: number;
  condition?: string;
}
