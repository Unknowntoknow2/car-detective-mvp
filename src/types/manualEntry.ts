
export enum ConditionLevel {
  Poor = "Poor",
  Fair = "Fair", 
  Good = "Good",
  VeryGood = "Very Good",
  Excellent = "Excellent"
}

export interface AccidentDetails {
  hadAccident: boolean;
  severity: 'minor' | 'moderate' | 'severe';
  repaired: boolean;
  count?: number;
  location?: string;
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
  fuelType?: string;
  transmission?: string;
  bodyType?: string;
  color?: string;
  
  // Premium fields
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean | null;
  maintenanceNotes?: string;
  accidentDetails?: AccidentDetails;
  tireCondition?: 'excellent' | 'good' | 'worn' | 'replacement';
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
}

export interface VehicleData {
  make: string;
  model: string;
  year: number;
  trim?: string;
  vin?: string;
  mileage?: number;
  condition?: string;
}

export const manualEntrySchema = {
  // Basic validation schema placeholder
  make: { required: true },
  model: { required: true },
  year: { required: true, type: 'number' },
  mileage: { required: true, type: 'number' },
  condition: { required: true },
  zipCode: { required: true }
};
