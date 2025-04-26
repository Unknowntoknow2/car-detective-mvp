
export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  condition: string;
  zipCode?: string;
  accident?: 'yes' | 'no';
  accidentDetails?: {
    count: string;
    severity: string;
    area: string;
  };
  selectedFeatures?: string[];
}

export interface VehicleFeature {
  id: string;
  name: string;
  category: string;
  valueImpact: number;
}

export type ConditionLevel = 'poor' | 'fair' | 'good' | 'excellent';

export interface ConditionOption {
  value: ConditionLevel;
  label: string;
  description: string;
  conditionValue: number;
}
