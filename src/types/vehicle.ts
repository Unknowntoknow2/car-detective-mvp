
export interface DecodedVehicleInfo {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  engine?: string;
  drivetrain?: string;
  mpgCity?: string;
  mpgHighway?: string;
  exteriorColor?: string;
  interiorColor?: string;
}
