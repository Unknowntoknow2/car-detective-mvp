
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
