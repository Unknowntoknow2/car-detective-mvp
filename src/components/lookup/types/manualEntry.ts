
// src/types/manualEntry.ts

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
  vin?: string;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  accident?: string | boolean;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
}

export interface AccidentDetails {
  description?: string;
  count?: string;
  severity?: 'Minor' | 'Moderate' | 'Severe';
  repaired?: boolean;
  hasAccident?: boolean;
  area?: string;
}

export enum ConditionLevel {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor'
}
