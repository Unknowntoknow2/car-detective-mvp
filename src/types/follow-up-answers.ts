export interface FeatureOption {
  id: string;
  label: string;
  impact: number;
}

export interface FollowUpAnswers {
  vin: string;
  zip_code?: string;
  mileage?: number;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  transmission: 'automatic' | 'manual' | 'unknown';
  previous_owners?: number;
  previous_use: 'personal' | 'fleet' | 'rental' | 'taxi' | 'government' | 'unknown';
  title_status: 'clean' | 'rebuilt' | 'salvage' | 'flood' | 'lemon' | 'unknown';
  dashboard_lights?: string[];
  tire_condition: 'excellent' | 'good' | 'fair' | 'poor';
  exterior_condition: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition: 'excellent' | 'good' | 'fair' | 'poor';
  smoking?: boolean;
  petDamage?: boolean;
  rust?: boolean;
  hailDamage?: boolean;
  frame_damage?: boolean;
  accident_history?: {
    hadAccident: boolean;
    count: number;
    location: string;
    severity: 'minor' | 'moderate' | 'major';
    repaired: boolean;
    frameDamage: boolean;
    description: string;
  };
  accidents?: any;
  modifications?: {
    hasModifications: boolean;
    modified: boolean;
    types: string[];
  };
  serviceHistory?: {
    hasRecords: boolean;
    lastService?: string;
    frequency?: string;
    dealerMaintained?: boolean;
    description?: string;
  };
  service_history?: any;
  loan_balance?: number;
  has_active_loan?: boolean;
  payoffAmount?: number;
  features: string[]; // Array of feature IDs
  additional_notes?: string;
  is_complete: boolean;
  completion_percentage: number;
}
