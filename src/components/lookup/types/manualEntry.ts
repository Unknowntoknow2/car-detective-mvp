
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  condition: string;
  zipCode: string;
  mileage?: number;
  trim?: string;
  bodyStyle?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  accidents?: {
    hasAccident: boolean;
    count?: number;
    severity?: string;
  };
  fileType?: string;
  fileName?: string;
}

export interface VinLookupFormData {
  vin: string;
  zipCode: string;
}

export interface PlateLookupFormData {
  plate: string;
  state: string;
  zipCode: string;
}
