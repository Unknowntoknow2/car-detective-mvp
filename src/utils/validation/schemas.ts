
import * as z from 'zod';
import { isValidVIN } from './vin-validation';

export const VinSchema = z.string()
  .min(17, { message: 'VIN must be 17 characters long' })
  .max(17, { message: 'VIN must be 17 characters long' })
  .refine(val => isValidVIN(val), { 
    message: 'VIN can only contain alphanumeric characters and cannot contain I, O, or Q' 
  });

export const PlateSchema = z.object({
  plate: z.string().min(1, { message: 'License plate is required' }),
  state: z.string().min(1, { message: 'State is required' })
});

export const VehicleBasicSchema = z.object({
  make: z.string().min(1, { message: 'Make is required' }),
  model: z.string().min(1, { message: 'Model is required' }),
  year: z.string().or(z.number()).refine(val => {
    const year = typeof val === 'string' ? parseInt(val, 10) : val;
    return !isNaN(year) && year >= 1900 && year <= new Date().getFullYear() + 1;
  }, { message: 'Please enter a valid year' })
});
