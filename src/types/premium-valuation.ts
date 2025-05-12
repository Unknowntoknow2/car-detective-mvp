
export interface FormData {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  identifier: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  zipCode: string;
  condition: string;
  conditionLabel?: string;
  conditionScore?: number;
  hasAccident: 'yes' | 'no';
  accidentDescription: string;
  fuelType: string;
  transmission: string;
  bodyType?: string;
  bodyStyle?: string; // Adding this to support both bodyType and bodyStyle
  features?: string[];
  photos?: File[];
  drivingProfile: 'light' | 'average' | 'heavy' | string; // Allow any string but prefer these values
  valuationId?: string;
  estimatedValue?: number;
  valuation?: number; // Alias for estimatedValue
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: any[];
  photoAnalysisResult?: any;
  isPremium?: boolean;
  exteriorColor?: string;
  interiorColor?: string;
  colorMultiplier?: number;
  saleDate?: Date;
}

// Add the FeatureOption interface
export interface FeatureOption {
  id: string;
  name: string;
  icon?: string;
  value: number;
}
