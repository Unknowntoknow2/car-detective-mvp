
import * as z from 'zod';

export const vehicleSchema = z.object({
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
