
export interface FormData {
  identifierType: 'vin' | 'plate' | 'manual' | 'photo';
  identifier: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number | null; // Allow null for mileage
  zipCode: string;
  condition: string;
  conditionLabel?: string;
  conditionScore?: number;
  hasAccident: 'yes' | 'no' | boolean;
  accidentDescription?: string;
  fuelType: string;
  transmission: string;
  bodyType: string;
  bodyStyle?: string | undefined; // Make bodyStyle optional
  saleDate?: Date | undefined; // Make saleDate optional
  features: string[];
  photos: string[] | File[]; // Allow both string[] and File[]
  drivingProfile: string;
  isPremium: boolean;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  colorMultiplier?: number;
  exteriorColor?: string;
  interiorColor?: string;
  explanation?: string;
  photoAnalysisResult?: any; // Add photoAnalysisResult for photo uploads
}

// Add FeatureOption interface for features components
export interface FeatureOption {
  id: string;
  name: string;
  category: string;
  description: string;
  value: number;
  selected?: boolean;
}
