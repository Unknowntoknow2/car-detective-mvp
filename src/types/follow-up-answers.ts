
// Vehicle condition types
export type VehicleCondition = 'excellent' | 'good' | 'fair' | 'poor';
export type TireCondition = 'new' | 'good' | 'worn' | 'bald';
export type TransmissionType = 'automatic' | 'manual' | 'unknown';
export type TitleStatus = 'clean' | 'salvage' | 'rebuilt' | 'lien' | 'unknown';
export type PreviousUse = 'personal' | 'fleet' | 'rental' | 'taxi' | 'government' | 'unknown';
export type AccidentSeverity = 'minor' | 'moderate' | 'major';

// Dashboard lights options
export const DASHBOARD_LIGHTS = [
  'Check Engine',
  'ABS',
  'Airbag',
  'Oil Pressure',
  'Battery',
  'Brake',
  'TPMS',
  'Engine Temperature',
  'Transmission',
  'Power Steering'
] as const;

// Feature options with impact values
export interface FeatureOption {
  id: string;
  label: string;
  impact: number;
  category: string;
}

export const FEATURE_OPTIONS: FeatureOption[] = [
  // Safety & Driver Assistance
  { id: 'blind_spot_monitor', label: 'Blind Spot Monitor', impact: 400, category: 'safety' },
  { id: 'adaptive_cruise_control', label: 'Adaptive Cruise Control', impact: 600, category: 'safety' },
  { id: 'lane_keep_assist', label: 'Lane Keep Assist', impact: 350, category: 'safety' },
  { id: 'rear_cross_traffic', label: 'Rear Cross Traffic Alert', impact: 300, category: 'safety' },
  { id: 'auto_emergency_braking', label: 'Auto Emergency Braking', impact: 500, category: 'safety' },
  { id: 'backup_camera', label: 'Backup Camera', impact: 250, category: 'safety' },
  { id: 'parking_sensors', label: 'Parking Sensors', impact: 200, category: 'safety' },
  { id: 'collision_warning', label: 'Collision Warning', impact: 400, category: 'safety' },
  { id: 'stability_control', label: 'Electronic Stability Control', impact: 300, category: 'safety' },
  { id: 'auto_high_beams', label: 'Auto High Beams', impact: 150, category: 'safety' },

  // Tech & Connectivity
  { id: 'apple_carplay', label: 'Apple CarPlay', impact: 400, category: 'tech' },
  { id: 'android_auto', label: 'Android Auto', impact: 400, category: 'tech' },
  { id: 'navigation_system', label: 'Navigation System', impact: 500, category: 'tech' },
  { id: 'touchscreen', label: 'Touchscreen Display', impact: 350, category: 'tech' },
  { id: 'bluetooth', label: 'Bluetooth', impact: 200, category: 'tech' },
  { id: 'usb_ports', label: 'USB Ports', impact: 150, category: 'tech' },
  { id: 'wifi_hotspot', label: 'Wi-Fi Hotspot', impact: 300, category: 'tech' },
  { id: 'wireless_charging', label: 'Wireless Charging', impact: 250, category: 'tech' },
  { id: 'voice_control', label: 'Voice Control', impact: 200, category: 'tech' },

  // Luxury & Comfort
  { id: 'leather_seats', label: 'Leather Seats', impact: 800, category: 'luxury' },
  { id: 'heated_front_seats', label: 'Heated Front Seats', impact: 400, category: 'luxury' },
  { id: 'heated_rear_seats', label: 'Heated Rear Seats', impact: 300, category: 'luxury' },
  { id: 'ventilated_seats', label: 'Ventilated Seats', impact: 500, category: 'luxury' },
  { id: 'dual_zone_climate', label: 'Dual Zone Climate Control', impact: 350, category: 'luxury' },
  { id: 'power_liftgate', label: 'Power Liftgate', impact: 400, category: 'luxury' },
  { id: 'remote_start', label: 'Remote Start', impact: 300, category: 'luxury' },
  { id: 'keyless_entry', label: 'Keyless Entry', impact: 250, category: 'luxury' },
  { id: 'push_button_start', label: 'Push Button Start', impact: 200, category: 'luxury' },
  { id: 'power_adjustable_seats', label: 'Power Adjustable Seats', impact: 400, category: 'luxury' },
  { id: 'ambient_lighting', label: 'Ambient Lighting', impact: 200, category: 'luxury' },

  // Wheels & Exterior
  { id: 'alloy_wheels', label: 'Alloy Wheels', impact: 300, category: 'exterior' },
  { id: 'premium_wheels', label: 'Premium Wheels', impact: 600, category: 'exterior' },
  { id: 'sunroof', label: 'Sunroof', impact: 800, category: 'exterior' },
  { id: 'moonroof', label: 'Moonroof', impact: 900, category: 'exterior' },
  { id: 'fog_lights', label: 'Fog Lights', impact: 200, category: 'exterior' },
  { id: 'roof_rack', label: 'Roof Rack', impact: 250, category: 'exterior' },
  { id: 'running_boards', label: 'Running Boards', impact: 300, category: 'exterior' },
  { id: 'led_headlights', label: 'LED Headlights', impact: 400, category: 'exterior' },
  { id: 'tinted_windows', label: 'Tinted Windows', impact: 200, category: 'exterior' },

  // Utility & Towing
  { id: 'tow_package', label: 'Tow Package', impact: 800, category: 'utility' },
  { id: 'trailer_hitch', label: 'Trailer Hitch', impact: 400, category: 'utility' },
  { id: 'bed_liner', label: 'Bed Liner', impact: 300, category: 'utility' },
  { id: 'awd_4wd', label: '4WD / AWD', impact: 1200, category: 'utility' },
  { id: 'off_road_package', label: 'Off-Road Package', impact: 1000, category: 'utility' },
  { id: 'skid_plates', label: 'Skid Plates', impact: 200, category: 'utility' }
];

// Condition options with proper typing
export interface ConditionOption {
  value: VehicleCondition;
  label: string;
  color: string;
  description?: string;
  impact?: number;
}

export const CONDITION_OPTIONS: ConditionOption[] = [
  { 
    value: 'excellent', 
    label: 'Excellent', 
    color: 'bg-green-100 border-green-500 text-green-800',
    description: 'Like new condition, minimal wear',
    impact: 500
  },
  { 
    value: 'good', 
    label: 'Good', 
    color: 'bg-blue-100 border-blue-500 text-blue-800',
    description: 'Well maintained, minor wear',
    impact: 0
  },
  { 
    value: 'fair', 
    label: 'Fair', 
    color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    description: 'Some wear, needs attention',
    impact: -800
  },
  { 
    value: 'poor', 
    label: 'Poor', 
    color: 'bg-red-100 border-red-500 text-red-800',
    description: 'Significant wear, repairs needed',
    impact: -2000
  }
];

// Tire condition options  
export interface TireConditionOption {
  value: TireCondition;
  label: string;
  color: string;
  description?: string;
  impact?: number;
}

export const TIRE_CONDITION_OPTIONS: TireConditionOption[] = [
  { 
    value: 'new', 
    label: 'Like New', 
    color: 'bg-green-100 border-green-500 text-green-800',
    description: 'Excellent tread depth',
    impact: 400
  },
  { 
    value: 'good', 
    label: 'Good Tread', 
    color: 'bg-blue-100 border-blue-500 text-blue-800',
    description: 'Good condition, even wear',
    impact: 0
  },
  { 
    value: 'worn', 
    label: 'Worn', 
    color: 'bg-yellow-100 border-yellow-500 text-yellow-800',
    description: 'Low tread, replacement soon',
    impact: -300
  },
  { 
    value: 'bald', 
    label: 'Bald/Unsafe', 
    color: 'bg-red-100 border-red-500 text-red-800',
    description: 'Immediate replacement needed',
    impact: -800
  }
];

// Accident details
export interface AccidentDetails {
  hadAccident: boolean;
  count: number;
  location: string;
  severity: AccidentSeverity;
  repaired: boolean;
  frameDamage: boolean;
  description: string;
}

// Service history details
export interface ServiceHistoryDetails {
  hasRecords: boolean;
  lastService?: string;
  frequency?: string;
  dealerMaintained?: boolean;
  description?: string;
}

// Modifications details
export interface ModificationDetails {
  hasModifications: boolean;
  modified: boolean;
  types: string[];
}

// Main FollowUpAnswers interface
export interface FollowUpAnswers {
  vin: string;
  zip_code?: string;
  mileage?: number;
  condition?: VehicleCondition;
  transmission?: TransmissionType;
  previous_owners?: number;
  previous_use?: PreviousUse;
  title_status?: TitleStatus;
  dashboard_lights?: string[];
  tire_condition?: TireCondition;
  exterior_condition?: VehicleCondition;
  interior_condition?: VehicleCondition;
  smoking?: boolean;
  petDamage?: boolean;
  rust?: boolean;
  hailDamage?: boolean;
  frame_damage?: boolean;
  accident_history?: AccidentDetails;
  accidents?: any;
  modifications?: ModificationDetails;
  serviceHistory?: ServiceHistoryDetails;
  service_history?: any;
  loan_balance?: number;
  has_active_loan?: boolean;
  payoffAmount?: number;
  features?: string[];
  additional_notes?: string;
  is_complete?: boolean;
  completion_percentage?: number;
}
