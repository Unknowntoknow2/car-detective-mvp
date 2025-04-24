
export interface ValuationFormProps {
  onSubmit?: (data: ManualValuationData) => Promise<void>;
  isLoading?: boolean;
  submitButtonText?: string;
  isPremium?: boolean;
}

export interface ManualValuationData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  fuelType: string;
  condition: string;
  zipCode?: string;
  accident?: string;
  accidentDetails?: {
    count: string;
    severity: string;
    area: string;
  };
  selectedFeatures?: string[];
}
