
import { z } from 'zod';

export enum ConditionLevel {
  Excellent = "excellent",
  VeryGood = "very-good", 
  Good = "good",
  Fair = "fair",
  Poor = "poor",
}

export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  location?: string;
  severity: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
  types?: string[];
  repairShops?: string[];
}

export interface ManualEntryFormData {
  make: string;
  makeName?: string;
  model: string;
  modelName?: string;
  trim?: string;
  trimName?: string;
  year: number;
  mileage: number;
  condition: ConditionLevel | string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  selectedFeatures?: string[];
  bodyStyle?: string;
  color?: string;
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
  fileType?: string;
  fileName?: string;
  _modelListVersion?: number;
}

export const manualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().min(5),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  vin: z.string().optional(),
  selectedFeatures: z.array(z.string()).optional(),
});

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}
