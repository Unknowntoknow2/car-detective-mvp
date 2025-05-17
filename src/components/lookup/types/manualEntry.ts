// src/components/lookup/types/manualEntry.ts

export enum ConditionLevel {
  Excellent = "Excellent",
  VeryGood = "Very Good",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor"
}
<<<<<<< HEAD
=======

export interface AccidentDetails {
  hasAccident: boolean;
  severity?: string;
  description?: string;
  repairQuality?: string;
  repaired?: boolean;
}
>>>>>>> origin/main

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel | string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  vin?: string;
  accidentDetails?: AccidentDetails;
  features?: string[];
  selectedFeatures?: string[];
<<<<<<< HEAD
  features?: string[];
}

export interface AccidentDetails {
  description?: string;
  count?: string; 
  severity?: 'Minor' | 'Moderate' | 'Severe';
  repaired?: boolean;
  hasAccident?: boolean;
  area?: string;
=======
>>>>>>> origin/main
}
