
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

export interface FollowUpAnswers {
  vin: string;
  zip_code: string;
  mileage?: number;
  condition?: string;
  transmission?: string;
  title_status?: string;
  previous_use: string;
  previous_owners?: number;
  serviceHistory?: ServiceHistoryDetails | string;
  tire_condition?: TireConditionOption;
  brake_condition?: string;
  exterior_condition?: ConditionOption;
  interior_condition?: ConditionOption;
  dashboard_lights: string[];
  accident_history?: AccidentDetails | string;
  modifications?: ModificationDetails | string;
  features: string[];
  additional_notes: string;
  service_history: string;
  loan_balance?: number;
  has_active_loan?: boolean;
  payoffAmount?: number;
  accidents?: number;
  frame_damage?: boolean;
  smoking?: boolean;
  petDamage?: boolean;
  rust?: boolean;
  hailDamage?: boolean;
  completion_percentage: number;
  is_complete: boolean;
}
