
export interface DecodedVehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  engine?: string;
  transmission?: string;
  bodyStyle?: string;
  fuelType?: string;
  // Add missing properties that components expect
  mileage?: number;
  primaryPhoto?: string;
  photos?: string[];
  exteriorColor?: string;
  seats?: number;
}
