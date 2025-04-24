
import { z } from 'zod';

export const manualEntryFormSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.coerce.number().min(1900, { message: 'Year must be valid' }),
  mileage: z.coerce.number().min(0, { message: 'Mileage must be valid' }),
  fuelType: z.string().min(1, { message: 'Fuel type is required' }),
  condition: z.string().min(1, { message: 'Condition is required' }),
  zipCode: z.string().optional(),
});

export type ManualEntryFormData = z.infer<typeof manualEntryFormSchema>;
