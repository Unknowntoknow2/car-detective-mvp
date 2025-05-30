
export interface FollowUpAnswers {
  vin: string;
  valuation_id?: string;
  user_id?: string;
  zip_code: string;
  mileage?: number;
  condition?: string;
  transmission?: string;
  exterior_condition?: string;
  interior_condition?: string;
  previous_owners?: number;
  dashboard_lights?: string[];
  engine_issues?: boolean;
  transmission_issues?: boolean;
  accident_history?: {
    hadAccident: boolean;
    count?: number;
    location?: string;
    severity?: 'minor' | 'moderate' | 'severe';
    repaired?: boolean;
    frameDamage?: boolean;
    description?: string;
  };
  service_history?: {
    hasRecords: boolean;
    lastService?: string;
    frequency?: string;
    dealerMaintained?: boolean;
    description?: string;
  };
  title_status?: string;
  modifications?: {
    hasModifications: boolean;
    types?: string[];
    description?: string;
  };
  additional_notes?: string;
  completion_percentage?: number;
  is_complete?: boolean;
  created_at?: string;
  updated_at?: string;
  
  // Additional fields for compatibility with existing components
  accidents?: {
    hadAccident: boolean;
    count?: number;
    location?: string;
    severity?: 'minor' | 'moderate' | 'severe';
    repaired?: boolean;
    frameDamage?: boolean;
    description?: string;
  };
  features?: string[];
  tire_condition?: string;
  frame_damage?: boolean;
  previous_use?: string;
  maintenance_status?: string;
  last_service_date?: string;
  service_notes?: string;
}

// Export constants for form options
export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

export const MODIFICATION_TYPES = [
  'Performance',
  'Appearance',
  'Audio',
  'Suspension',
  'Wheels',
  'Interior',
  'Other'
];

export const TIRE_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

export const DASHBOARD_LIGHTS = [
  'Check Engine',
  'ABS',
  'Airbag',
  'Oil Pressure',
  'Battery',
  'Temperature',
  'Brake',
  'Tire Pressure'
];

export const SERVICE_HISTORY_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'excellent', label: 'Excellent' },
  { value: 'good', label: 'Good' },
  { value: 'fair', label: 'Fair' },
  { value: 'poor', label: 'Poor' }
];

export const TITLE_STATUS_OPTIONS = [
  { value: 'clean', label: 'Clean' },
  { value: 'salvage', label: 'Salvage' },
  { value: 'rebuilt', label: 'Rebuilt' },
  { value: 'flood', label: 'Flood' },
  { value: 'lemon', label: 'Lemon' }
];

export const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'rental', label: 'Rental' },
  { value: 'fleet', label: 'Fleet' }
];
