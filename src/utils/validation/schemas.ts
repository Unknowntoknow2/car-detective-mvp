
import { z } from "zod";

// VIN validation schema
export const VinSchema = z.string()
  .trim()
  .length(17, { message: "VIN must be exactly 17 characters long" })
  .regex(/^[A-HJ-NPR-Z0-9]+$/, { 
    message: "VIN can only contain letters A-H, J-N, P, R-Z and numbers. Letters I, O, Q are not used in VINs" 
  });

// License plate validation schema
export const PlateSchema = z.string()
  .trim()
  .min(2, { message: "License plate must have at least 2 characters" })
  .max(8, { message: "License plate can't be longer than 8 characters" })
  .regex(/^[A-Z0-9]+$/, {
    message: "License plate can only contain uppercase letters and numbers"
  });
