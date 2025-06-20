
export interface FollowUpAnswers {
  vin: string;
  zip_code: string;
  mileage: number;
  condition: string;
  accidents: boolean;
  maintenance_records: boolean;
  modifications: string | ModificationDetails;
  additional_notes: string;
  transmission?: string;
  title_status?: string;
  previous_use?: string;
  serviceHistory?: string | ServiceHistoryDetails;
  tire_condition?: TireConditionOption;
  exterior_condition?: ConditionOption;
  interior_condition?: ConditionOption;
  dashboard_lights?: string[];
  accident_history?: AccidentDetails;
  features?: string[];
  service_history?: string;
  completion_percentage?: number;
  is_complete?: boolean;
  [key: string]: any; // Allow additional fields
}

export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  location?: string;
  severity?: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
  types?: string[];
  repairShops?: string[];
}

export interface ServiceHistoryDetails {
  hasRecords: boolean;
  lastService?: string;
  frequency?: 'regular' | 'occasional' | 'rare' | 'unknown';
  dealerMaintained?: boolean;
  description?: string;
  services?: string[];
}

export interface ModificationDetails {
  hasModifications: boolean;
  modified?: boolean;
  types?: string[];
  additionalNotes?: string;
}

export type ConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
export type TireConditionOption = 'excellent' | 'good' | 'worn' | 'replacement';
