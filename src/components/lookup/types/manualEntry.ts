
export enum ConditionLevel {
  Excellent = "Excellent",
  VeryGood = "Very Good",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor"
}

export interface AccidentDetails {
  hasAccident: boolean;
  severity?: string;
  description?: string;
  repairQuality?: string;
}

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
}
