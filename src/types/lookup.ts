
export interface PlateLookupInfo {
  plate: string;
  state: string;
  make: string;
  model: string;
  year: number;
  vin?: string;
  estimatedValue?: number;
  color?: string; // Add missing color property
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
  exteriorColor?: string;
  interiorColor?: string;
  doors?: string;
  seats?: string;
  displacement?: string;
  mileage?: number;
  condition?: string;
  bodyType?: string;
  drivetrain?: string;
  plate?: string;
  state?: string;
  photos?: string[];
  primaryPhoto?: string;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  vin?: string;
}
