
import * as z from 'zod';

export interface FormData {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  identifier: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number | null; // Allow null for mileage
  zipCode: string;
  condition: string;
  conditionLabel?: string;
  conditionScore?: number;
  hasAccident: 'yes' | 'no' | boolean;
  accidentDescription?: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  bodyStyle?: string; // Make bodyStyle optional
  saleDate?: Date; // Make saleDate optional
  features: string[];
  photos: string[] | File[]; // Allow both string[] and File[]
  drivingProfile: string;
  isPremium: boolean;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  colorMultiplier?: number;
  exteriorColor?: string;
  interiorColor?: string; // Add interiorColor
  explanation?: string;
  photoAnalysisResult?: any; // Add photoAnalysisResult for photo uploads
  email?: string; // Add email field
  agreeToTerms?: boolean; // Add terms agreement field
}

// Add FeatureOption interface for features components
export interface FeatureOption {
  id: string;
  name: string;
  category: string;
  description: string;
  value: number;
  selected?: boolean;
}

// Add validation related types
export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  min?: number;
  max?: number;
  custom?: (value: any) => boolean;
}

export interface FieldValidation {
  value: any;
  rules: ValidationRules;
  errorMessage?: string;
  isValid: boolean;
}

// Add Zod schema for premium valuation form validation
export const premiumValuationSchema = z.object({
  vin: z.string().optional(),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.union([z.coerce.number().min(0, "Mileage cannot be negative"), z.null()]).optional(),
  zipCode: z.string().min(5, "Valid ZIP code required").max(10),
  condition: z.string().optional(),
  fuelType: z.string().optional(),
  transmission: z.string().optional(),
  bodyType: z.string().optional(),
  features: z.array(z.string()).optional().default([]),
  email: z.string().email("Valid email required").optional(),
  agreeToTerms: z.boolean().optional()
});
