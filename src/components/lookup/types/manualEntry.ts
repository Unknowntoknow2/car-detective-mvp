
export enum ConditionLevel {
  Excellent = "excellent",
  VeryGood = "very good",
  Good = "good",
  Fair = "fair",
  Poor = "poor"
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel | string;
  zipCode: string;
  vin?: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  color?: string;
  bodyType?: string;
  selectedFeatures?: string[];
}

export interface AccidentDetails {
  hasAccidents: boolean;
  accidentCount?: number;
  accidentSeverity?: 'minor' | 'moderate' | 'severe';
  repairHistory?: string;
}
