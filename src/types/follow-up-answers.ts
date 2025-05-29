export interface FollowUpAnswers {
  vin: string;
  valuation_id?: string;
  user_id?: string;
  mileage?: number;
  zip_code?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  exterior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  previous_owners?: number;
  dashboard_lights?: string[];
  
  // Accident History - Fix the type from boolean to object
  has_accidents?: boolean;
  accidents?: {
    hadAccident: boolean;
    count?: number;
    location?: string;
    severity?: 'minor' | 'moderate' | 'severe';
    repaired?: boolean;
    frameDamage?: boolean;
    description?: string;
  };
  accident_count?: number;
  accident_severity?: 'minor' | 'moderate' | 'severe';
  accident_types?: string[];
  repairs_completed?: boolean;
  insurance_claims?: number;
  
  // Features
  selected_features?: string[];
  features?: string[];
  
  // Service & Maintenance
  last_service_date?: string;
  service_records_available?: boolean;
  service_history?: 'excellent' | 'good' | 'fair' | 'poor';
  maintenance_frequency?: 'excellent' | 'good' | 'fair' | 'poor';
  maintenance_status?: 'excellent' | 'good' | 'fair' | 'poor';
  service_notes?: string;
  
  // Title & Ownership
  title_status?: 'clean' | 'salvage' | 'flood' | 'lemon';
  ownership_history?: string;
  previous_use?: 'personal' | 'rental' | 'fleet' | 'commercial' | 'taxi';
  
  // Physical Features
  fuel_type?: string;
  transmission?: string;
  drivetrain?: string;
  tire_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  frame_damage?: boolean;
  
  // Modifications
  modifications?: {
    modified: boolean;
    types: string[];
  };
  
  // System fields
  completion_percentage?: number;
  is_complete?: boolean;
}

export const CONDITION_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'Like new condition. Vehicle is in top condition with no mechanical or cosmetic issues.',
    impact: '+15% to +20% value'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Clean condition. Vehicle has minor wear and tear, but is well-maintained and in good working order.',
    impact: 'Market value baseline'
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Average condition. Vehicle has some mechanical or cosmetic issues that may require attention.',
    impact: '-10% to -20% value'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Rough condition. Vehicle has significant mechanical or cosmetic issues that require major repairs.',
    impact: '-25% to -40% value'
  }
];

export const TIRE_CONDITION_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    impact: 'Like new tread depth (8-10/32")'
  },
  {
    value: 'good',
    label: 'Good',
    impact: 'Good tread depth (5-7/32")'
  },
  {
    value: 'fair',
    label: 'Fair',
    impact: 'Moderate wear (3-4/32")'
  },
  {
    value: 'poor',
    label: 'Poor',
    impact: 'Needs replacement (≤2/32")'
  }
];

export const DASHBOARD_LIGHTS = [
  {
    value: 'none',
    label: 'No Warning Lights',
    icon: '✅',
    impact: 'All systems operating normally'
  },
  {
    value: 'check_engine',
    label: 'Check Engine Light',
    icon: '🔧',
    impact: 'Engine diagnostics warning'
  },
  {
    value: 'abs',
    label: 'ABS Warning Light',
    icon: '🛡️',
    impact: 'Anti-lock brake system issue'
  },
  {
    value: 'tpms',
    label: 'TPMS (Tire Pressure)',
    icon: '🛞',
    impact: 'Tire pressure monitoring system'
  },
  {
    value: 'oil',
    label: 'Oil Change Light',
    icon: '🛢️',
    impact: 'Oil change required'
  },
  {
    value: 'battery',
    label: 'Battery Warning',
    icon: '🔋',
    impact: 'Charging system issue'
  },
  {
    value: 'coolant',
    label: 'Coolant Temperature',
    icon: '🌡️',
    impact: 'Engine temperature warning'
  },
  {
    value: 'airbag',
    label: 'Airbag Warning',
    icon: '🎈',
    impact: 'Airbag system malfunction'
  },
  {
    value: 'brake',
    label: 'Brake System',
    icon: '⚠️',
    impact: 'Brake system warning'
  }
];

export const SERVICE_HISTORY_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'Complete service records, maintained at dealer/certified shop',
    impact: 'Full documentation available'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Most service records available, regular maintenance',
    impact: 'Good maintenance history'
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Some service records, basic maintenance performed',
    impact: 'Limited documentation'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Limited or no service records available',
    impact: 'No service history'
  }
];

export const MAINTENANCE_STATUS_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'All maintenance up to date, no deferred items',
    impact: 'Up to date maintenance'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Recent maintenance, minor items may be due',
    impact: 'Recent maintenance'
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Some maintenance overdue, needs attention',
    impact: 'Some items overdue'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Significant maintenance overdue or neglected',
    impact: 'Maintenance neglected'
  }
];

export const TITLE_STATUS_OPTIONS = [
  {
    value: 'clean',
    label: 'Clean Title',
    description: 'No major damage or issues reported',
    impact: 'No title issues'
  },
  {
    value: 'salvage',
    label: 'Salvage Title',
    description: 'Vehicle was declared total loss by insurance',
    impact: 'Significant value reduction'
  },
  {
    value: 'flood',
    label: 'Flood Damage',
    description: 'Vehicle has flood damage history',
    impact: 'Major value impact'
  },
  {
    value: 'lemon',
    label: 'Lemon Law',
    description: 'Vehicle was returned under lemon law',
    impact: 'Substantial value reduction'
  }
];

export const PREVIOUS_USE_OPTIONS = [
  {
    value: 'personal',
    label: 'Personal Use',
    description: 'Privately owned and operated',
    impact: 'Best condition typically'
  },
  {
    value: 'rental',
    label: 'Rental Vehicle',
    description: 'Previously used as rental car',
    impact: 'Higher wear expected'
  },
  {
    value: 'fleet',
    label: 'Fleet Vehicle',
    description: 'Corporate or government fleet use',
    impact: 'Moderate wear'
  },
  {
    value: 'commercial',
    label: 'Commercial Use',
    description: 'Used for business purposes',
    impact: 'Heavy use expected'
  },
  {
    value: 'taxi',
    label: 'Taxi/Rideshare',
    description: 'Used for taxi or rideshare service',
    impact: 'Very high mileage/wear'
  }
];

export const MODIFICATION_TYPES = [
  'Performance Exhaust',
  'Cold Air Intake',
  'Suspension Lowering',
  'Wheels/Rims',
  'Tinting',
  'Audio System',
  'Engine Tuning',
  'Body Kit',
  'Lift Kit',
  'Custom Paint',
  'Racing Seats',
  'Roll Cage',
  'Turbo/Supercharger',
  'Other'
];
