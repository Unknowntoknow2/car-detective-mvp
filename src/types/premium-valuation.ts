
import { z } from 'zod';

export const premiumValuationSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Year must be valid").max(new Date().getFullYear() + 1, "Year cannot be in the future"),
  mileage: z.coerce.number().min(0, "Mileage cannot be negative").nullable().optional(),
  condition: z.enum(["excellent", "good", "fair", "poor"]),
  zipCode: z.string().regex(/^\d{5}$/, "ZIP code must be 5 digits"),
  features: z.array(z.string()).optional(),
  photos: z.array(z.any()).optional(),
  vin: z.string().optional(),
  bodyType: z.string().optional(),
  bodyStyle: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  color: z.string().optional(),
  trim: z.string().optional(),
  hasAccident: z.union([z.boolean(), z.enum(['yes', 'no'])]).optional(),
  accidentDescription: z.string().optional(),
  drivingProfile: z.enum(['light', 'average', 'heavy']).optional(),
  identifierType: z.enum(['vin', 'plate', 'manual', 'photo']).optional(),
  identifier: z.string().optional(),
  conditionLabel: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).optional(),
  conditionScore: z.number().optional(),
  valuationId: z.string().optional(),
  isPremium: z.boolean().optional(),
  saleDate: z.date().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  colorMultiplier: z.number().optional(),
  doors: z.number().optional(),
});

export type FormData = z.infer<typeof premiumValuationSchema>;

export interface PremiumValuationStep {
  id: string;
  title: string;
  description: string;
  isComplete: boolean;
  component: React.ComponentType<any>;
}

export interface FeatureOption {
  id: string;
  name: string;
  value: number;
  description?: string;
  category?: string;
  icon?: string; // Add icon property
}

// Add ConditionValues interface for condition-related components
export interface ConditionValues {
  exteriorBody: number;
  exteriorPaint: number;
  interiorSeats: number;
  interiorDashboard: number;
  mechanicalEngine: number;
  mechanicalTransmission: number;
  tireCondition: number;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
}

// Add ConditionTipsProps for condition tip components
export interface ConditionTipsProps {
  category: string;
  rating: number;
}
