
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
  bodyStyle?: string; // Added bodyStyle property
  saleDate?: Date; // Added saleDate property
  features: string[];
  photos: string[];
  drivingProfile: string;
  isPremium: boolean;
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
  colorMultiplier?: number;
  exteriorColor?: string;
  explanation?: string;
  photoAnalysisResult?: any; // Add photoAnalysisResult for photo uploads
}
