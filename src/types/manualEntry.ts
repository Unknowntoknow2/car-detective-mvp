import { z } from "zod";

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
});

// Inferred TypeScript type (already exists)
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
}
