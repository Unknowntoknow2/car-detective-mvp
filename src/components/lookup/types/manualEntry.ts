
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: string;
  mileage?: string;
  condition?: string;
  zipCode?: string;
  fuelType?: string;
  transmission?: string;
  vin?: string;
  // Added missing properties
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  accident?: 'yes' | 'no';
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
}

// Add the AccidentDetails interface that was missing
export interface AccidentDetails {
  count: string;
  severity: string;
  area: string;
}

// Add the ConditionLevel enum
export enum ConditionLevel {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor'
}
