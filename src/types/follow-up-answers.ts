
export interface ServiceHistoryDetails {
  hasRecords: boolean;
  lastService?: string;
  regularMaintenance?: boolean;
  majorRepairs?: string[];
  frequency?: 'regular' | 'occasional' | 'rare' | 'unknown';
  dealerMaintained?: boolean;
  description?: string;
  services?: Array<{
    type: string;
    date: string;
    mileage?: string;
    description?: string;
  }>;
}

export interface ModificationDetails {
  hasModifications: boolean;
  modified: boolean;
  types: string[];
  reversible?: boolean;
  description?: string;
  additionalNotes?: string;
}

export interface AccidentDetails {
  hadAccident: boolean;
  count: number;
  location?: string;
  severity: 'minor' | 'moderate' | 'major';
  repaired: boolean;
  frameDamage: boolean;
  description?: string;
  types?: string[];
  repairShops?: string[];
  airbagDeployment?: boolean;
}

export type TireConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor' | 'worn' | 'replacement';
export type ConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor';
export type BrakeConditionOption = 'excellent' | 'very-good' | 'good' | 'fair' | 'poor' | 'worn' | 'replacement';

export interface FollowUpAnswers {
  id?: string;
  vin: string;
  user_id?: string;
  valuation_id?: string;
  
  // Basic info
  zip_code: string;
  mileage: number;
  condition: string;
  
  // History
  accidents: AccidentDetails;
  transmission: string;
  title_status: string;
  previous_use: string;
  serviceHistory: ServiceHistoryDetails;
  previous_owners?: number;
  
  // Condition details
  tire_condition: string;
  exterior_condition?: string;
  interior_condition?: string;
  dashboard_lights: string[];
  brake_condition?: string;
  
  // Financial
  loan_balance?: number;
  payoffAmount?: number;
  
  // Vehicle details
  modifications: ModificationDetails;
  features: string[];
  
  // Additional
  additional_notes: string;
  
  // Meta
  completion_percentage: number;
  is_complete: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Legacy field for backward compatibility
  service_history?: string;
  
  // UI state
  vehicleConfirmed?: boolean;
}
