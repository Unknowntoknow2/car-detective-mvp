
import { z } from "zod";

export interface ManualEntryFormData {
  year: string;
  make: string;
  model: string;
  trim?: string;
  mileage: string;
  condition: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  accidentDetails?: {
    hadAccident: boolean;
    severity?: string;
  };
  [key: string]: any;
}

// Add the missing schema export
export const manualEntrySchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().min(4, "Year is required"),
  mileage: z.string().min(1, "Mileage is required"),
  condition: z.string().min(1, "Condition is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  trim: z.string().optional(),
});
