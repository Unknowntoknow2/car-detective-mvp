
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission: string;
  drivetrain?: string;
  bodyType?: string;
}
