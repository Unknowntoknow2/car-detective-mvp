
export interface FormData {
  // Vehicle identification
  identifierType?: 'vin' | 'plate' | 'manual' | 'photo';
  identifier?: string;
  vin?: string;
  licensePlate?: string;
  state?: string;
  
  // Vehicle details
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  fuelType?: string;
  zipCode?: string;
  condition?: string;
  conditionLabel?: string;
  
  // Vehicle features
  features: string[];
  exteriorColor?: string;
  colorMultiplier?: number;
  interiorColor?: string;
  transmissionType?: string;
  
  // Vehicle condition
  hasAccident?: boolean | string; 
  accidentDescription?: string;
  photoScore?: number;
  titleStatus?: string;
  
  // Add-ons
  hasOpenRecall?: boolean;
  warrantyStatus?: string;
  
  // Market factors
  saleDate?: Date;
  bodyStyle?: string;
  bodyType?: string;
  
  // Driving behavior
  drivingProfile?: string;
  
  // Calculation results
  valuation?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  valuationId?: string;
  
  // Photo data
  bestPhotoUrl?: string;
  
  // Additional data
  explanation?: string;
  color?: string;
  
  // Missing properties
  adjustments?: Array<{
    factor: string;
    impact: number;
    description?: string;
  }>;
  estimatedValue?: number;
  aiCondition?: {
    condition: string;
    confidenceScore: number;
    issuesDetected?: string[];
    aiSummary?: string;
  };
}

// Add FeatureOption interface used by component files
export interface FeatureOption {
  id: string;
  name: string;
  icon?: string;
  value: number;
}

// Add types for field validation
export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  minValue?: number;
  maxValue?: number;
  validate?: (value: any) => boolean | string;
}

export type FieldValidation = Record<string, ValidationRule>;
export type ValidationRules = Record<string, ValidationRule>;
