
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
  fuelType: string;
  condition: string;
  zipCode?: string;
  accident?: string;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
}
