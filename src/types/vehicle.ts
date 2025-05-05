
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string; // Make transmission optional
  drivetrain?: string;
  bodyType?: string;
  mileage?: number;
  fuelType?: string;
  color?: string;
  condition?: string;
  zipCode?: string;
  plate?: string; // Add plate field to support usage in ValuationTable
  state?: string; // Add state field
}
