
export enum ConditionLevel {
  Poor = "poor",
  Fair = "fair",
  Good = "good",
  VeryGood = "very_good",
  Excellent = "excellent"
}

export interface AccidentDetails {
  hasAccident: boolean;
  severity?: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  date?: string;
  description?: string;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  fuelType: string;
  transmission: string;
  trim?: string;
  color?: string;
  bodyStyle?: string;
  vin?: string;
  fileType?: string;
  fileName?: string;
  selectedFeatures?: string[];
  accidentDetails?: AccidentDetails;
}
