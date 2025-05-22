
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
  accidentDetails?: AccidentDetails;
}

export interface AccidentDetails {
  hasAccidents: boolean;
  accidentCount?: number;
  accidentSeverity?: 'minor' | 'moderate' | 'severe';
  repairHistory?: string;
  
  // These properties are used in some components but weren't in the original interface
  hasAccident?: boolean;    // Alternative name used in some components
  severity?: string;        // Alternative to accidentSeverity used in some components
  description?: string;     // Used to describe accident details
  repaired?: boolean;       // Whether damage has been repaired
}
