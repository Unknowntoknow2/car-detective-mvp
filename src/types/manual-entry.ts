
import { z } from "zod";

// Enum for condition levels
export enum ConditionLevel {
  Excellent = "excellent",
  VeryGood = "very-good", 
  Good = "good",
  Fair = "fair",
  Poor = "poor",
}

// Accident details interface
export interface AccidentDetails {
  hadAccident: boolean;
  severity?: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  count?: number;
  location?: string;
  description?: string;
}

// Vehicle data interface
export interface VehicleData {
  make: string;
  model: string;
  year: number;
  vin?: string;
  trim?: string;
  bodyType?: string;
  fuelType?: string;
  transmission?: string;
  engine?: string;
  drivetrain?: string;
}

// Extended manual entry form data interface
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  vin?: string;
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  color?: string;
  accidents?: number;
  trim?: string;
  
  // Extended properties
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean;
  maintenanceNotes?: string;
  accidentDetails?: AccidentDetails;
  tireCondition?: 'excellent' | 'good' | 'worn' | 'replacement';
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
  
  // Additional backward compatibility properties
  fuel_type?: string;
  zip_code?: string;
  plate?: string;
  state?: string;
}

// Zod schema for validation
export const manualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1886, "Year must be valid"),
  mileage: z.number().int().positive().optional(),
  condition: z.string().optional(),
  zipCode: z.string().optional(),
  vin: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyStyle: z.string().optional(),
  color: z.string().optional(),
  accidents: z.number().int().min(0).optional(),
  trim: z.string().optional(),
  titleStatus: z.enum(['clean', 'salvage', 'rebuilt', 'branded', 'lemon']).optional(),
  previousOwners: z.number().int().min(0).optional(),
  previousUse: z.enum(['personal', 'commercial', 'rental', 'emergency']).optional(),
  serviceHistory: z.enum(['dealer', 'independent', 'owner', 'unknown']).optional(),
  hasRegularMaintenance: z.boolean().optional(),
  maintenanceNotes: z.string().optional(),
  tireCondition: z.enum(['excellent', 'good', 'worn', 'replacement']).optional(),
  dashboardLights: z.array(z.string()).optional(),
  hasModifications: z.boolean().optional(),
  modificationTypes: z.array(z.string()).optional(),
  accidentDetails: z.object({
    hadAccident: z.boolean(),
    severity: z.enum(['minor', 'moderate', 'severe']).optional(),
    repaired: z.boolean().optional(),
    count: z.number().int().min(0).optional(),
    location: z.string().optional(),
    description: z.string().optional(),
  }).optional(),
});
