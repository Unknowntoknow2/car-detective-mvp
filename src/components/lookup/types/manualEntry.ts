
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
  // Basic vehicle info - store both ID and name for proper data flow
  make: string; // This will store the make ID
  makeName?: string; // Display name for UI
  model: string; // This will store the model ID
  modelName?: string; // Display name for UI
  trim?: string; // This will store the trim ID
  trimName?: string; // Display name for UI
  year: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  selectedFeatures?: string[];
  bodyStyle?: string;
  color?: string;
  
  // Title & Ownership
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  
  // Service History
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean | null;
  maintenanceNotes?: string;
  
  // Accident History
  accidentDetails?: AccidentDetails;
  
  // Additional Details
  tireCondition?: 'excellent' | 'good' | 'worn' | 'replacement';
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
  
  // File upload properties
  fileType?: string;
  fileName?: string;
}

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}
