
export interface PlateLookupInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  trim?: string;
  plate: string; // Make this required since it's a plate lookup
  state: string; // Make this required since it's a plate lookup
  registeredState?: string;
  estimatedValue?: number;
  mileage?: number; // Add this for PDF generation
}
