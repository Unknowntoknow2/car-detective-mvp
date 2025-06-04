<<<<<<< HEAD

import * as z from 'zod';
=======
import { z } from "zod";
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

export const vehicleSchema = z.object({
<<<<<<< HEAD
  make: z.string().min(1, { message: "Make is required" }),
  model: z.string().min(1, { message: "Model is required" }),
  year: z.number().min(1900, { message: "Year must be valid" }).max(new Date().getFullYear() + 1),
  price: z.number().min(0, { message: "Price must be a positive number" }),
  mileage: z.number().min(0, { message: "Mileage must be a positive number" }).nullable().default(0),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]).default("Good"),
  status: z.enum(["available", "pending", "sold"]).default("available"),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().min(1, { message: "Zip code is required" }),
  description: z.string().optional()
=======
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number().int().min(1900, "Year must be 1900 or later").max(
    new Date().getFullYear() + 1,
    "Year cannot be in the future",
  ),
  price: z.number().min(0, "Price must be a positive number"),
  mileage: z.number().nullable().transform((val) => val === 0 ? null : val),
  vin: z.string().optional(),
  condition: z.enum(["Excellent", "Good", "Fair", "Poor"]),
  description: z.string().optional(),
  transmission: z.enum(["Automatic", "Manual"]).optional(),
  fuel_type: z.enum(["Gasoline", "Diesel", "Hybrid", "Electric"]).optional(),
  zip_code: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format")
    .optional(),
  status: z.enum(["available", "pending", "sold"]).default("available"),
  photos: z.array(z.string()).optional().default([]),
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
});

export type VehicleFormValues = z.infer<typeof vehicleSchema>;

export interface VehicleFormData {
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  price: number;
  condition: "Excellent" | "Good" | "Fair" | "Poor";
  status: "available" | "pending" | "sold";
  photos: string[];
  transmission?: "Automatic" | "Manual";
  fuel_type?: "Gasoline" | "Diesel" | "Hybrid" | "Electric";
  zip_code?: string;
  description?: string;
}

export interface DealerFormData {
  fullName: string;
  dealershipName: string;
  phone: string;
  email: string;
  password: string;
  contactName: string;
}

export interface DealerSignupFormData {
  fullName: string;
  dealershipName: string;
  phone: string;
  email: string;
  password: string;
}
