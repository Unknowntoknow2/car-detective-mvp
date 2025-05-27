
export interface FormData {
  // Vehicle identification
  vin?: string;
  make: string;
  model: string;
  year: number;
  
  // Vehicle details
  mileage: number;
  fuelType: string;
  transmission: string;
  trim?: string;
  exteriorColor?: string;
  colorMultiplier?: number;
  zipCode: string;
  
  // Condition and history
  condition?: string;
  conditionLabel?: string;
  hasAccident?: boolean | string;
  accidentDescription?: string;
  
  // Valuation results
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
}
