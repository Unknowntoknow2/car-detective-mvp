
export type ConditionLevel = 'excellent' | 'good' | 'fair' | 'poor';

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  accident?: boolean;
  accidentDetails?: {
    count?: string;
    severity?: string;
    area?: string;
  };
  selectedFeatures?: string[];
  bodyType?: string;
  transmissionType?: string;
  confidenceScore?: number;
  trim?: string;
  valuation?: number;
}
