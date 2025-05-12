
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
  features?: string[];
  photos?: File[];
  drivingProfile: 'light' | 'average' | 'heavy';
  valuationId?: string;
  estimatedValue?: number;
  confidenceScore?: number;
  priceRange?: [number, number];
  adjustments?: any[];
  photoAnalysisResult?: any;
  isPremium?: boolean;
}
