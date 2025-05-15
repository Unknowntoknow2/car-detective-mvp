// src/types/manualEntry.ts

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  accident?: boolean;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
}

export interface AccidentDetails {
  description?: string;
  severity?: 'Minor' | 'Moderate' | 'Severe';
  repaired?: boolean;
  hasAccident?: boolean;
}

export enum ConditionLevel {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor'
}
