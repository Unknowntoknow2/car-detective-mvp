
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

  features?: Array<{value: string; label: string; icon?: string; impact?: number}>

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
] as const;
