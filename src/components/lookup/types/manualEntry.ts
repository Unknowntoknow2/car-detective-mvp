
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
  repaired?: boolean;
  description?: string;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  vin?: string;
  trim?: string;
  color?: string;
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  selectedFeatures?: string[];
  accidentDetails?: AccidentDetails;
}
