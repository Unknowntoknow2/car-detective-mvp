
import { z } from 'zod';

export const premiumValuationSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Year must be valid").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative"),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  features: z.array(z.string()).optional(),
  photos: z.array(z.any()).optional(),
  vin: z.string().optional(),
  bodyType: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  color: z.string().optional()
});

export type FormData = z.infer<typeof premiumValuationSchema>;

export interface PremiumValuationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  component: React.ComponentType<any>;
}
