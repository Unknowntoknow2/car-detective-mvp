
export enum ConditionLevel {
  Excellent = "excellent",
  VeryGood = "very_good",
  Good = "good",
  Fair = "fair",
  Poor = "poor"
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  vin?: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  color?: string;
  bodyType?: string;
}
