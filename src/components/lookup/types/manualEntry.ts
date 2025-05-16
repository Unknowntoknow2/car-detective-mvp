// src/components/lookup/types/manualEntry.ts

export enum ConditionLevel {
  Excellent = "Excellent",
  VeryGood = "Very Good",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor"
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number | string;
  mileage: number | string;
  condition: ConditionLevel | string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  color?: string;
  bodyType?: string; 
  vin?: string;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  accident?: string | boolean;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
  features?: string[];
}

export interface AccidentDetails {
  description?: string;
  count?: string; 
  severity?: 'Minor' | 'Moderate' | 'Severe';
  repaired?: boolean;
  hasAccident?: boolean;
  area?: string;
}
