
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
  accident?: boolean;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
}

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void | Promise<void>;
  isLoading?: boolean; // Make isLoading an optional prop to fix the error
  submitButtonText?: string;
  isPremium?: boolean;
  initialData?: Partial<ManualEntryFormData>;
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
