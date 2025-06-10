
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  condition: string;
  zipCode: string;
  vin?: string;
  trim?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  trim?: string;
  vin?: string;
  mileage?: number;
  condition?: string;
}
