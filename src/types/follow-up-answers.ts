export interface FollowUpAnswers {
  vin: string;
  zip_code?: string;
  mileage?: number;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  transmission?: 'automatic' | 'manual' | 'unknown';
  title_status?: 'clean' | 'salvage' | 'rebuilt' | 'lien' | 'unknown';
  previous_use: 'personal' | 'fleet' | 'rental' | 'taxi' | 'government' | 'unknown';
  previous_owners?: number;
  serviceHistory?: ServiceHistoryDetails;
  tire_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  brake_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  exterior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  dashboard_lights?: string[];
  accident_history?: AccidentDetails;
  modifications?: ModificationDetails;
  features?: string[];
  additional_notes?: string;
  service_history?: string;
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

export interface FeatureOption {
  id: string;
  label: string;
  impact: number;
  category: string;
}

export interface ConditionOption {
  value: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;
  description: string;
  impact: number;
}

export interface TireConditionOption {
  value: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;
  description: string;
  impact: number;
}

export interface ExteriorConditionOption {
  value: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;
  description: string;
  impact: number;
}

export interface InteriorConditionOption {
  value: 'excellent' | 'good' | 'fair' | 'poor';
  label: string;
  color: string;
  description: string;
  impact: number;
}

export interface ServiceHistoryDetails {
  hasRecords: boolean;
  lastService?: string;
  frequency?: 'regular' | 'occasional' | 'rare' | 'unknown';
  dealerMaintained?: boolean;
  description?: string;
}

export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  location?: string;
  severity: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
}

export interface ModificationDetails {
  hasModifications: boolean;
  modified?: boolean;
  types: string[];
}

export const DASHBOARD_LIGHTS = [
  'Check Engine',
  'ABS',
  'Airbag',
  'Battery',
  'Brake',
  'Oil Pressure',
  'Temperature',
  'Tire Pressure',
  'Traction Control'
];
