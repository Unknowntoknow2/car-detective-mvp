
import { z } from 'zod';
import { VIN_REGEX } from './enhanced-validation';

/**
 * Schema for VIN validation
 */
export const VinSchema = z.string()
  .min(17, "VIN must be 17 characters")
  .max(17, "VIN must be 17 characters")
  .regex(VIN_REGEX, "VIN must contain only alphanumeric characters excluding I, O, and Q")
  .refine(
    (vin) => !/[IOQ]/.test(vin.toUpperCase()),
    "VIN cannot contain letters I, O, or Q"
  );

/**
 * Schema for license plate validation
 */
export const PlateSchema = z.string()
  .min(1, "License plate is required")
  .max(10, "License plate too long")
  .refine(
    (plate) => /^[A-Z0-9\- ]+$/.test(plate.toUpperCase()),
    "License plate can only contain letters, numbers, spaces, and hyphens"
  );

/**
 * Schema for state validation
 */
export const StateSchema = z.string()
  .min(2, "State code is required")
  .max(2, "State code should be 2 characters")
  .regex(/^[A-Z]{2}$/, "State code should be two uppercase letters");
