export interface PlateLookupInfo {
  vin: string;
  make: string;
  model: string;
  year: number;
  color?: string;
  trim?: string;
  registeredState?: string;
  estimatedValue?: number;
}
