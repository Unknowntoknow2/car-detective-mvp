
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  vin?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  features?: string[];
}
