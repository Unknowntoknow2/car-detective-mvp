
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  zipCode: string;
  trim?: string;
  color?: string;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
}
