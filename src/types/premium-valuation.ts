
export interface FormData {
  // Vehicle identification
  vin?: string;
  licensePlate?: string;
  state?: string;
  
  // Vehicle details
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  fuelType?: string;
  zipCode?: string;
  condition?: number;
  conditionLabel?: string;
  
  // Vehicle features
  features?: string[];
  exteriorColor?: string;
  colorMultiplier?: number;
  transmissionType?: string;
  
  // Vehicle condition
  hasAccident?: boolean;
  accidentDescription?: string;
  photoScore?: number;
  titleStatus?: string;
  
  // Add-ons
  hasOpenRecall?: boolean;
  warrantyStatus?: string;
  
  // Market factors
  saleDate?: Date;
  bodyStyle?: string;
  
  // Calculation results
  valuation?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  valuationId?: string;
}
