
import { z } from 'zod';

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

// Proper Zod schema
export const manualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  mileage: z.number().min(0, "Mileage must be positive"),
  condition: z.nativeEnum(ConditionLevel),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  vin: z.string().optional(),
  trim: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  color: z.string().optional(),
  titleStatus: z.enum(['clean', 'salvage', 'rebuilt', 'branded', 'lemon']).optional(),
  previousOwners: z.number().optional(),
  previousUse: z.enum(['personal', 'commercial', 'rental', 'emergency']).optional(),
  serviceHistory: z.enum(['dealer', 'independent', 'owner', 'unknown']).optional(),
  hasRegularMaintenance: z.boolean().optional(),
  maintenanceNotes: z.string().optional(),
  accidentDetails: z.object({
    hadAccident: z.boolean(),
    severity: z.enum(['minor', 'moderate', 'severe']),
    repaired: z.boolean(),
    count: z.number().optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
  tireCondition: z.enum(['excellent', 'good', 'worn', 'replacement']).optional(),
  dashboardLights: z.array(z.string()).optional(),
  hasModifications: z.boolean().optional(),
  modificationTypes: z.array(z.string()).optional(),
});
