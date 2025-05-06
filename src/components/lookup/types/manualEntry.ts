
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
  accidentDetails?: string;
  selectedFeatures?: string[];
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
}
