
export type AccidentDetails = {
  hadAccident: boolean
  count?: number
  location?: string
  severity?: 'minor' | 'moderate' | 'severe'
  repaired?: boolean
  frameDamage?: boolean
  description?: string
}

export type ModificationDetails = {
  hasModifications: boolean
  modified?: boolean
  types?: string[]
  description?: string
}

export type ServiceHistoryDetails = {
  hasRecords: boolean
  lastService?: string
  frequency?: string
  dealerMaintained?: boolean
  description?: string
}

export type FollowUpAnswers = {
  vin: string
  user_id?: string
  valuation_id?: string

  mileage?: number
  zip_code: string
  condition?: 'excellent' | 'good' | 'fair' | 'poor'
  transmission?: 'automatic' | 'manual' | 'unknown'

  previous_owners?: number
  previous_use?: 'personal' | 'commercial' | 'rental' | 'emergency'
  title_status?: 'clean' | 'salvage' | 'rebuilt' | 'lien' | 'unknown'
  dashboard_lights?: string[]
  tire_condition?: 'new' | 'good' | 'worn' | 'bald'
  brake_condition?: 'new' | 'good' | 'fair' | 'poor'
  
  accident_history?: AccidentDetails
  accidents?: AccidentDetails
  modifications?: ModificationDetails
  serviceHistory?: ServiceHistoryDetails
  service_history?: ServiceHistoryDetails
  
  exterior_condition?: 'excellent' | 'good' | 'fair' | 'poor'
  interior_condition?: 'excellent' | 'good' | 'fair' | 'poor'
  
  smoking?: boolean
  petDamage?: boolean
  rust?: boolean
  hailDamage?: boolean
  frame_damage?: boolean

  loan_balance?: number
  has_active_loan?: boolean
  payoffAmount?: number

  features?: string[]

  additional_notes?: string

  is_complete?: boolean
  completion_percentage?: number
  created_at?: string
  updated_at?: string
}

// Export constants for form options
export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new condition', impact: 1000 },
  { value: 'good', label: 'Good', description: 'Minor wear and tear', impact: 0 },
  { value: 'fair', label: 'Fair', description: 'Some visible wear', impact: -500 },
  { value: 'poor', label: 'Poor', description: 'Significant wear or damage', impact: -1500 }
] as const;

export const MODIFICATION_TYPES = [
  'Performance',
  'Appearance',
  'Audio',
  'Suspension',
  'Wheels',
  'Interior',
  'Other'
] as const;

export const TIRE_CONDITION_OPTIONS = [
  { value: 'new', label: 'New', description: 'New or like-new tires', impact: 300 },
  { value: 'good', label: 'Good', description: 'Good tread remaining', impact: 0 },
  { value: 'worn', label: 'Worn', description: 'Some wear but safe', impact: -200 },
  { value: 'bald', label: 'Bald', description: 'Need replacement soon', impact: -500 }
] as const;

export const DASHBOARD_LIGHTS = [
  'Check Engine',
  'ABS',
  'Airbag',
  'Oil Pressure',
  'Battery',
  'Temperature',
  'Brake',
  'Tire Pressure'
] as const;

export const TITLE_STATUS_OPTIONS = [
  { value: 'clean', label: 'Clean', description: 'No title issues' },
  { value: 'salvage', label: 'Salvage', description: 'Previously totaled' },
  { value: 'rebuilt', label: 'Rebuilt', description: 'Rebuilt from salvage' },
  { value: 'lien', label: 'Lien', description: 'Has outstanding loan' },
  { value: 'unknown', label: 'Unknown', description: 'Title status unclear' }
] as const;

export const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal', description: 'Personal use vehicle' },
  { value: 'commercial', label: 'Commercial', description: 'Commercial use vehicle' },
  { value: 'rental', label: 'Rental', description: 'Former rental vehicle' },
  { value: 'emergency', label: 'Emergency', description: 'Emergency services vehicle' }
] as const;

// Enhanced features list - organized by categories
export const VEHICLE_FEATURE_CATEGORIES = {
  'safety': {
    label: 'Safety & Driver Assistance',
    icon: '🔒',
    color: 'red',
    features: [
      { id: 'blind_spot_monitor', label: 'Blind Spot Monitor', impact: 400 },
      { id: 'adaptive_cruise_control', label: 'Adaptive Cruise Control', impact: 600 },
      { id: 'lane_keep_assist', label: 'Lane Keep Assist', impact: 500 },
      { id: 'rear_cross_traffic_alert', label: 'Rear Cross Traffic Alert', impact: 350 },
      { id: 'automatic_emergency_braking', label: 'Automatic Emergency Braking', impact: 700 },
      { id: 'backup_camera', label: 'Backup Camera', impact: 300 },
      { id: 'parking_sensors', label: 'Parking Sensors', impact: 250 },
      { id: 'collision_warning', label: 'Collision Warning', impact: 400 },
      { id: 'electronic_stability_control', label: 'Electronic Stability Control', impact: 300 },
      { id: 'auto_high_beams', label: 'Auto High Beams', impact: 200 }
    ]
  },
  'tech': {
    label: 'Tech & Connectivity',
    icon: '📱',
    color: 'blue',
    features: [
      { id: 'apple_carplay', label: 'Apple CarPlay', impact: 400 },
      { id: 'android_auto', label: 'Android Auto', impact: 400 },
      { id: 'navigation_system', label: 'Navigation System', impact: 500 },
      { id: 'touchscreen_display', label: 'Touchscreen Display', impact: 350 },
      { id: 'bluetooth', label: 'Bluetooth', impact: 200 },
      { id: 'usb_ports', label: 'USB Ports', impact: 150 },
      { id: 'wifi_hotspot', label: 'Wi-Fi Hotspot', impact: 300 },
      { id: 'wireless_charging', label: 'Wireless Charging', impact: 250 },
      { id: 'voice_control', label: 'Voice Control', impact: 200 }
    ]
  },
  'luxury': {
    label: 'Luxury & Comfort',
    icon: '🛋',
    color: 'purple',
    features: [
      { id: 'leather_seats', label: 'Leather Seats', impact: 800 },
      { id: 'heated_front_seats', label: 'Heated Front Seats', impact: 400 },
      { id: 'heated_rear_seats', label: 'Heated Rear Seats', impact: 350 },
      { id: 'ventilated_seats', label: 'Ventilated Seats', impact: 500 },
      { id: 'dual_zone_climate', label: 'Dual Zone Climate Control', impact: 300 },
      { id: 'power_liftgate', label: 'Power Liftgate', impact: 400 },
      { id: 'remote_start', label: 'Remote Start', impact: 350 },
      { id: 'keyless_entry', label: 'Keyless Entry', impact: 250 },
      { id: 'push_button_start', label: 'Push Button Start', impact: 200 },
      { id: 'power_adjustable_seats', label: 'Power Adjustable Seats', impact: 300 },
      { id: 'ambient_lighting', label: 'Ambient Lighting', impact: 200 }
    ]
  },
  'exterior': {
    label: 'Wheels & Exterior',
    icon: '🚘',
    color: 'green',
    features: [
      { id: 'alloy_wheels', label: 'Alloy Wheels', impact: 400 },
      { id: 'premium_wheels', label: 'Premium Wheels', impact: 600 },
      { id: 'sunroof', label: 'Sunroof', impact: 600 },
      { id: 'moonroof', label: 'Moonroof', impact: 700 },
      { id: 'fog_lights', label: 'Fog Lights', impact: 200 },
      { id: 'roof_rack', label: 'Roof Rack', impact: 300 },
      { id: 'running_boards', label: 'Running Boards', impact: 350 },
      { id: 'led_headlights', label: 'LED Headlights', impact: 400 },
      { id: 'tinted_windows', label: 'Tinted Windows', impact: 250 }
    ]
  },
  'utility': {
    label: 'Utility & Towing',
    icon: '🚚',
    color: 'orange',
    features: [
      { id: 'tow_package', label: 'Tow Package', impact: 800 },
      { id: 'trailer_hitch', label: 'Trailer Hitch', impact: 400 },
      { id: 'bed_liner', label: 'Bed Liner', impact: 300 },
      { id: 'four_wheel_drive', label: '4WD / AWD', impact: 1200 },
      { id: 'off_road_package', label: 'Off-Road Package', impact: 1000 },
      { id: 'skid_plates', label: 'Skid Plates', impact: 250 }
    ]
  }
} as const;

// Flatten all features for easy access
export const ALL_VEHICLE_FEATURES = Object.values(VEHICLE_FEATURE_CATEGORIES)
  .flatMap(category => category.features.map(feature => ({
    ...feature,
    category: category.label
  })));
