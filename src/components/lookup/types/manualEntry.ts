
// If this file doesn't exist, we'll create it
export interface AccidentDetails {
  count: string;
  severity: string;
  area: string;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zipCode?: string;
  fuelType: string;
  condition: string;
  accident: string;
  accidentDetails?: AccidentDetails;
}
