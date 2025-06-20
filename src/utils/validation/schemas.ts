
import { z } from 'zod';

export const vehicleSchema = z.object({
  make: z.string().min(1),
  model: z.string().min(1),
  year: z.number().min(1900).max(new Date().getFullYear() + 1),
  mileage: z.number().min(0),
  condition: z.string().min(1),
  zipCode: z.string().min(5).max(10)
});

export const vinSchema = z.string().length(17);

export const plateSchema = z.object({
  plate: z.string().min(2).max(8),
  state: z.string().length(2)
});
