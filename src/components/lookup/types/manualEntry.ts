
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  trim?: string;
  color?: string;
  features?: string[];
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  accident?: boolean; // Add accident property
  accidentDetails?: AccidentDetails; // Add accidentDetails property
  selectedFeatures?: string[]; // Add selectedFeatures property
}

// Add AccidentDetails interface
export interface AccidentDetails {
  hasAccident: boolean;
  description?: string;
  severity?: 'Minor' | 'Moderate' | 'Severe';
  repaired?: boolean;
}

// Add ConditionLevel for form components
export enum ConditionLevel {
  Excellent = 'Excellent',
  Good = 'Good',
  Fair = 'Fair',
  Poor = 'Poor'
}
