
export interface AccidentDetails {
  hadAccident: boolean;
  severity?: 'minor' | 'moderate' | 'severe';
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType: string;
  transmission: string;
  accidentDetails: AccidentDetails;
  selectedFeatures?: string[];
  bodyStyle?: string;
  vin?: string;
}
