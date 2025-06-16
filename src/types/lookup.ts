
export interface PlateLookupInfo {
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  estimatedValue?: number;
}

export interface DecodedVehicleInfo {
  make?: string;
  model?: string;
  year?: number;
  vin?: string;
  trim?: string;
  engine?: string;
  transmission?: string;
  fuelType?: string;
  color?: string;
  zipCode?: string;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
}
