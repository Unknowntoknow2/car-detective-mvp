
export enum ConditionLevel {
  Poor = 'Poor',
  Fair = 'Fair',
  Good = 'Good',
  Excellent = 'Excellent',
  VeryGood = 'Very Good' // Adding VeryGood condition level
}

export interface AccidentDetails {
  hasAccident: boolean;
  count?: number;
  severity?: string;
  description?: string; // Adding description property
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  condition: ConditionLevel | string;
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
  accidentDetails?: AccidentDetails;
  vin?: string;
  selectedFeatures?: string[];
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
