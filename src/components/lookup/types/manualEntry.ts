
export type ConditionLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface AccidentDetails {
  count?: string;
  severity?: string;
  area?: string;
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  accident?: boolean;
  accidentDetails?: AccidentDetails;
  selectedFeatures?: string[];
  bodyType?: string;
  transmissionType?: string;
  confidenceScore?: number;
  trim?: string;
  valuation?: number;
}

export interface ManualEntryFormProps {
  onSubmit: (data: ManualEntryFormData) => void;
}
