
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: string;
  mileage: string;
  zipCode?: string;
  condition?: string;
  fuelType?: string;
  transmission?: string;
  accident?: string;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
}

export type ConditionLevel = 'poor' | 'fair' | 'good' | 'excellent';

export interface AccidentDetails {
  count: string;
  severity: string;
  area: string;
}
