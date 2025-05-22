
export enum ConditionLevel {
  Poor = "Poor",
  Fair = "Fair",
  Good = "Good",
  VeryGood = "Very Good",
  Excellent = "Excellent"
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage?: number;
  condition: ConditionLevel | string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  bodyStyle?: string;
  color?: string;
  // Optional properties to handle various use cases
  fileType?: string;
  fileName?: string;
  vin?: string;
  // Any additional properties
  [key: string]: any;
}
