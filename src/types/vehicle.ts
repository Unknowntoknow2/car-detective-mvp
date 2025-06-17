
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
}
