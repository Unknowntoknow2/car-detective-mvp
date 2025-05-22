
export enum ConditionLevel {
  Excellent = 'excellent',
  VeryGood = 'very_good',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor'
}

export interface AccidentDetails {
  hasAccident: boolean;
  severity?: 'minor' | 'moderate' | 'severe';
  description?: string;
  repaired?: boolean;
  year?: number;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: ConditionLevel | string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  vin?: string;
  selectedFeatures?: string[];
  accidentDetails?: AccidentDetails;
  isPremium?: boolean;
  fileType?: string;
}
