
export interface FeatureOption {
  id: string;
  label: string;
  impact: number;
  category?: string;
}

// Accident Details interface
export interface AccidentDetails {
  hadAccident: boolean;
  count: number;
  location: string;
  severity: 'minor' | 'moderate' | 'major';
  repaired: boolean;
  frameDamage: boolean;
  description: string;
}

// Service History Details interface
export interface ServiceHistoryDetails {
  hasRecords: boolean;
  lastService?: string;
  frequency?: string;
  dealerMaintained?: boolean;
  description?: string;
}

// Modification Details interface
export interface ModificationDetails {
  hasModifications: boolean;
  modified: boolean;
  types: string[];
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
  brake_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  exterior_condition: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition: 'excellent' | 'good' | 'fair' | 'poor';
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
  features: string[]; // Array of feature IDs
  additional_notes?: string;
  is_complete: boolean;
  completion_percentage: number;
}

// Constants for options
export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', color: 'bg-green-100 border-green-500 text-green-800' },
  { value: 'good', label: 'Good', color: 'bg-blue-100 border-blue-500 text-blue-800' },
  { value: 'fair', label: 'Fair', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
  { value: 'poor', label: 'Poor', color: 'bg-red-100 border-red-500 text-red-800' }
] as const;

export const TIRE_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Like New', color: 'bg-green-100 border-green-500 text-green-800' },
  { value: 'good', label: 'Good Tread', color: 'bg-blue-100 border-blue-500 text-blue-800' },
  { value: 'fair', label: 'Some Wear', color: 'bg-yellow-100 border-yellow-500 text-yellow-800' },
  { value: 'poor', label: 'Need Replacement', color: 'bg-red-100 border-red-500 text-red-800' }
] as const;

export const DASHBOARD_LIGHTS = [
  'Check Engine',
  'ABS',
  'Airbag',
  'TPMS (Tire Pressure)',
  'Oil Pressure',
  'Battery',
  'Brake',
  'Temperature',
  'Transmission',
  'Service Engine Soon',
  'Emission Control',
  'Maintenance Required'
] as const;

export const FEATURE_OPTIONS: FeatureOption[] = [
  // Safety & Driver Assistance
  { id: 'blind_spot_monitor', label: 'Blind Spot Monitor', impact: 400, category: 'Safety' },
  { id: 'adaptive_cruise_control', label: 'Adaptive Cruise Control', impact: 600, category: 'Safety' },
  { id: 'lane_keep_assist', label: 'Lane Keep Assist', impact: 350, category: 'Safety' },
  { id: 'rear_cross_traffic', label: 'Rear Cross Traffic Alert', impact: 300, category: 'Safety' },
  { id: 'auto_emergency_braking', label: 'Auto Emergency Braking', impact: 500, category: 'Safety' },
  { id: 'backup_camera', label: 'Backup Camera', impact: 250, category: 'Safety' },
  { id: 'parking_sensors', label: 'Parking Sensors', impact: 200, category: 'Safety' },
  { id: 'collision_warning', label: 'Collision Warning', impact: 400, category: 'Safety' },
  { id: 'stability_control', label: 'Electronic Stability Control', impact: 300, category: 'Safety' },
  { id: 'auto_high_beams', label: 'Auto High Beams', impact: 150, category: 'Safety' },

  // Tech & Connectivity
  { id: 'apple_carplay', label: 'Apple CarPlay', impact: 400, category: 'Tech' },
  { id: 'android_auto', label: 'Android Auto', impact: 400, category: 'Tech' },
  { id: 'navigation_system', label: 'Navigation System', impact: 500, category: 'Tech' },
  { id: 'touchscreen', label: 'Touchscreen Display', impact: 350, category: 'Tech' },
  { id: 'bluetooth', label: 'Bluetooth', impact: 200, category: 'Tech' },
  { id: 'usb_ports', label: 'USB Ports', impact: 150, category: 'Tech' },
  { id: 'wifi_hotspot', label: 'Wi-Fi Hotspot', impact: 300, category: 'Tech' },
  { id: 'wireless_charging', label: 'Wireless Charging', impact: 250, category: 'Tech' },
  { id: 'voice_control', label: 'Voice Control', impact: 200, category: 'Tech' },

  // Luxury & Comfort
  { id: 'leather_seats', label: 'Leather Seats', impact: 800, category: 'Luxury' },
  { id: 'heated_front_seats', label: 'Heated Front Seats', impact: 400, category: 'Luxury' },
  { id: 'heated_rear_seats', label: 'Heated Rear Seats', impact: 300, category: 'Luxury' },
  { id: 'ventilated_seats', label: 'Ventilated Seats', impact: 500, category: 'Luxury' },
  { id: 'dual_zone_climate', label: 'Dual Zone Climate Control', impact: 350, category: 'Luxury' },
  { id: 'power_liftgate', label: 'Power Liftgate', impact: 400, category: 'Luxury' },
  { id: 'remote_start', label: 'Remote Start', impact: 300, category: 'Luxury' },
  { id: 'keyless_entry', label: 'Keyless Entry', impact: 200, category: 'Luxury' },
  { id: 'push_button_start', label: 'Push Button Start', impact: 250, category: 'Luxury' },
  { id: 'power_adjustable_seats', label: 'Power Adjustable Seats', impact: 350, category: 'Luxury' },
  { id: 'ambient_lighting', label: 'Ambient Lighting', impact: 200, category: 'Luxury' },

  // Wheels & Exterior
  { id: 'alloy_wheels', label: 'Alloy Wheels', impact: 400, category: 'Exterior' },
  { id: 'premium_wheels', label: 'Premium Wheels', impact: 600, category: 'Exterior' },
  { id: 'sunroof', label: 'Sunroof', impact: 500, category: 'Exterior' },
  { id: 'moonroof', label: 'Moonroof', impact: 600, category: 'Exterior' },
  { id: 'fog_lights', label: 'Fog Lights', impact: 150, category: 'Exterior' },
  { id: 'roof_rack', label: 'Roof Rack', impact: 200, category: 'Exterior' },
  { id: 'running_boards', label: 'Running Boards', impact: 300, category: 'Exterior' },
  { id: 'led_headlights', label: 'LED Headlights', impact: 400, category: 'Exterior' },
  { id: 'tinted_windows', label: 'Tinted Windows', impact: 250, category: 'Exterior' },

  // Utility & Towing
  { id: 'tow_package', label: 'Tow Package', impact: 500, category: 'Utility' },
  { id: 'trailer_hitch', label: 'Trailer Hitch', impact: 300, category: 'Utility' },
  { id: 'bed_liner', label: 'Bed Liner', impact: 200, category: 'Utility' },
  { id: 'awd_4wd', label: '4WD / AWD', impact: 1000, category: 'Utility' },
  { id: 'off_road_package', label: 'Off-Road Package', impact: 800, category: 'Utility' },
  { id: 'skid_plates', label: 'Skid Plates', impact: 150, category: 'Utility' }
];
