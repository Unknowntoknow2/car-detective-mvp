
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
  condition?: number;
  conditionLabel?: string;
  
  // Vehicle features
  features?: string[];
  exteriorColor?: string;
  colorMultiplier?: number;
  interiorColor?: string;
  transmissionType?: string;
  
  // Vehicle condition
  hasAccident?: boolean;
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
  
  // Calculation results
  valuation?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  valuationId?: string;
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
