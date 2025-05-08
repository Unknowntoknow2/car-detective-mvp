
// Add or update this interface to include zipCode
export interface DecodedVehicleInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  bodyType?: string;
  zipCode?: string;
  mileage?: number;
  condition?: string;
}
