
export interface AccidentDetails {
  hadAccident: boolean;
  count: number;
  location: string;
  severity: 'minor' | 'moderate' | 'severe';
  repaired: boolean;
  frameDamage: boolean;
  description: string;
  types: string[];
  repairShops: string[];
}

export interface ManualEntryFormData {
  make: string;
  model: string;
  year: number;
  mileage: number;
  zipCode: string;
  condition: string;
  vin?: string;
  accidentDetails?: AccidentDetails;
  titleStatus?: string;
  previousOwners?: number;
  previousUse?: string;
  serviceHistory?: string;
  hasRegularMaintenance?: boolean;
  maintenanceNotes?: string;
  tireCondition?: string;
  dashboardLights?: string[];
  hasModifications?: boolean;
  modificationTypes?: string[];
}
