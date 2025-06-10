
export interface FormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  fuelType?: string;
  transmission?: string;
  bodyStyle?: string;
  color?: string;
  vin?: string;
  selectedFeatures?: string[];
  titleStatus?: 'clean' | 'salvage' | 'rebuilt' | 'branded' | 'lemon';
  previousOwners?: number;
  previousUse?: 'personal' | 'commercial' | 'rental' | 'emergency';
  serviceHistory?: 'dealer' | 'independent' | 'owner' | 'unknown';
  hasRegularMaintenance?: boolean | null;
  maintenanceNotes?: string;
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
  tireCondition?: 'excellent' | 'good' | 'worn' | 'replacement';
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
}

export type FormDataKey = keyof FormData;
