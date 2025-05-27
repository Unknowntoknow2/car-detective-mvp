
export interface FormData {
  // Vehicle identification
  vin?: string;
  make: string;
  model: string;
  year: number;
  identifierType?: 'vin' | 'plate' | 'manual' | 'photo';
  identifier?: string;
  
  // Vehicle details
  mileage: number;
  fuelType: string;
  transmission: string;
  trim?: string;
  exteriorColor?: string;
  interiorColor?: string;
  colorMultiplier?: number;
  zipCode: string;
  bodyStyle?: string;
  bodyType?: string;
  color?: string;
  
  // Condition and history
  condition?: string;
  conditionLabel?: string;
  conditionScore?: number;
  hasAccident?: boolean | string;
  accidentDescription?: string;
  
  // Premium features
  features?: string[];
  drivingProfile?: 'light' | 'average' | 'heavy';
  hasRegularMaintenance?: boolean | string;
  maintenanceNotes?: string;
  photos?: File[];
  photoUrls?: string[];
  saleDate?: string;
  
  // Valuation results
  valuationId?: string;
  valuation?: number;
  confidenceScore?: number;
}

export interface FeatureOption {
  id: string;
  name: string;
  category: string;
  valueImpact: number;
  description?: string;
  isSelected?: boolean;
  value?: number;
}
