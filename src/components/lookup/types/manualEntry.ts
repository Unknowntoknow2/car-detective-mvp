
/**
 * Enum for condition levels of vehicles
 */
export enum ConditionLevel {
  Excellent = "Excellent",
  Good = "Good",
  Fair = "Fair",
  Poor = "Poor"
}

/**
 * Interface for accident details
 */
export interface AccidentDetails {
  hasAccident?: boolean;
  severity?: 'Minor' | 'Moderate' | 'Severe';
  description?: string;
  repaired?: boolean;
}

/**
 * Interface for manual entry form data
 */
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: ConditionLevel;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  trim?: string;
  color?: string;
  vin?: string;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
  bodyType?: string;
  features?: string[];
  accident?: boolean;
}
