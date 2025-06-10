
export interface FeatureOption {
  id: string;
  name: string;
  value: number;
  category?: string;
}

export interface FormData {
  // Basic vehicle info
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  
  // Vehicle details
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  color?: string;
  vin?: string;
  trim?: string;
  
  // License plate info
  plate?: string;
  stateCode?: string;
  
  // Features and condition
  selectedFeatures?: string[];
  features?: string[];
  conditionLabel?: string;
  conditionRatings?: {
    exterior?: number;
    interior?: number;
    mechanical?: number;
    tires?: number;
  };
  
  // Accident and history
  hasAccident?: boolean | string;
  accidentHistory?: boolean;
  accidentDescription?: string;
  accidentDetails?: {
    hadAccident: boolean;
    count?: number;
    location?: string;
    severity?: 'minor' | 'moderate' | 'severe';
    repaired?: boolean;
    frameDamage?: boolean;
    description?: string;
    types?: string[];
    repairShops?: string[];
  };
  
  // Title and ownership
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  
  // Maintenance
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean | null;
  maintenanceNotes?: string;
  
  // Condition details
  tireCondition?: 'excellent' | 'good' | 'worn' | 'replacement';
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
  
  // Driving behavior
  drivingBehavior?: string;
  drivingProfile?: string;
  annualMileage?: number;
  
  // Photos and media
  photos?: File[];
  
  // Package and premium features
  packageLevel?: string;
  
  // Valuation results
  valuation?: number;
  estimatedValue?: number;
  confidenceScore?: number;
  
  // Additional colors
  exteriorColor?: string;
  interiorColor?: string;
  
  // Allow additional properties
  [key: string]: any;
}

export type FormDataKey = keyof FormData;
