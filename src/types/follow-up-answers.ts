
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
    modified?: boolean;
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
  features?: Array<{
    value: string;
    label: string;
    icon?: string;
    impact?: number;
  }>;
  tire_condition?: string;
  frame_damage?: boolean;
  previous_use?: string;
  maintenance_status?: string;
  last_service_date?: string;
  service_notes?: string;
}

// Export constants for form options with enhanced properties
export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new condition', impact: 1000 },
  { value: 'good', label: 'Good', description: 'Minor wear and tear', impact: 0 },
  { value: 'fair', label: 'Fair', description: 'Some visible wear', impact: -500 },
  { value: 'poor', label: 'Poor', description: 'Significant wear or damage', impact: -1500 }
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
  { value: 'excellent', label: 'Excellent', description: 'New or like-new tires', impact: 300 },
  { value: 'good', label: 'Good', description: 'Good tread remaining', impact: 0 },
  { value: 'fair', label: 'Fair', description: 'Some wear but safe', impact: -200 },
  { value: 'poor', label: 'Poor', description: 'Need replacement soon', impact: -500 }
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
  { value: 'excellent', label: 'Excellent', description: 'Complete service records' },
  { value: 'good', label: 'Good', description: 'Most services documented' },
  { value: 'fair', label: 'Fair', description: 'Some service records' },
  { value: 'poor', label: 'Poor', description: 'Limited or no records' }
];

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Recently serviced' },
  { value: 'good', label: 'Good', description: 'Up to date maintenance' },
  { value: 'fair', label: 'Fair', description: 'Some maintenance needed' },
  { value: 'poor', label: 'Poor', description: 'Overdue maintenance' }
];

export const TITLE_STATUS_OPTIONS = [
  { value: 'clean', label: 'Clean', description: 'No title issues' },
  { value: 'salvage', label: 'Salvage', description: 'Previously totaled' },
  { value: 'rebuilt', label: 'Rebuilt', description: 'Rebuilt from salvage' },
  { value: 'flood', label: 'Flood', description: 'Flood damage history' },
  { value: 'lemon', label: 'Lemon', description: 'Manufacturer buyback' }
];

export const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal', description: 'Personal use only' },
  { value: 'commercial', label: 'Commercial', description: 'Commercial use' },
  { value: 'rental', label: 'Rental', description: 'Former rental vehicle' },
  { value: 'fleet', label: 'Fleet', description: 'Fleet vehicle' }
];

// Enhanced features list with properties
export const VEHICLE_FEATURES = [
  { value: 'leather_seats', label: 'Leather Seats', icon: '🪑', impact: 800 },
  { value: 'sunroof', label: 'Sunroof', icon: '☀️', impact: 600 },
  { value: 'navigation', label: 'Navigation System', icon: '🗺️', impact: 500 },
  { value: 'backup_camera', label: 'Backup Camera', icon: '📹', impact: 400 },
  { value: 'heated_seats', label: 'Heated Seats', icon: '🔥', impact: 300 },
  { value: 'bluetooth', label: 'Bluetooth', icon: '📶', impact: 200 },
  { value: 'premium_audio', label: 'Premium Audio', icon: '🔊', impact: 700 },
  { value: 'alloy_wheels', label: 'Alloy Wheels', icon: '⚙️', impact: 400 }
];
