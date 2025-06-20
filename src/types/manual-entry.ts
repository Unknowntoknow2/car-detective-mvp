
import { z } from "zod";
import { AccidentDetails } from "./accident-details";
import { ConditionOption, TireConditionOption } from "./condition";

export interface ManualEntryFormData {
  year: string;
  make: string;
  model: string;
  trim?: string;
  mileage: string;
  condition: ConditionOption;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  accidentDetails?: AccidentDetails;
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean;
  maintenanceNotes?: string;
  tireCondition?: TireConditionOption;
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
  [key: string]: any;
}

// Zod schema for validation
export const manualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  mileage: z.string().min(1, "Mileage is required"),
  condition: z.enum(['excellent', 'very-good', 'good', 'fair', 'poor']),
  zipCode: z.string().min(5, "ZIP code is required"),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  trim: z.string().optional(),
});
