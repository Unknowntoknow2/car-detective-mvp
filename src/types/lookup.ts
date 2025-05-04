
export interface PlateLookupInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  trim?: string;
  plate?: string; // Add this
  state?: string; // Add this
  registeredState?: string;
  estimatedValue?: number;
}
