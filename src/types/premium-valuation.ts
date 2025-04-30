
export type FeatureOption = {
  id: string;
  name: string;
  icon: string;
  value: number;
  category?: string;
  description?: string;
};

export type FormData = {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  identifier: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
  fuelType: string | null;
  features: string[];
  condition: number;
  conditionLabel: string;
  hasAccident: boolean;
  accidentDescription: string;
  zipCode: string;
  exteriorColor?: string;
  interiorColor?: string;
  bodyType?: string;
  trim?: string;
  vin?: string;
  // Color multiplier for valuation adjustment
  colorMultiplier?: number;
  // Added fields for prediction results
  valuation?: number;
  confidenceScore?: number;
  valuationId?: string;
  // Transmission type
  transmissionType?: string;
};

export interface ValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  minValue?: number;
  maxValue?: number;
  validate?: (value: any) => boolean | string;
}

export interface FieldValidation {
  [fieldName: string]: ValidationRules;
}

export type FormSection = {
  id: number;
  title: string;
  fields: string[];
  validationRules: FieldValidation;
};
