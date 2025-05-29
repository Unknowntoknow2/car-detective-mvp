export interface AccidentDetails {
  hadAccident?: boolean;
  count?: number;
  location?: 'front' | 'rear' | 'side' | 'multiple';
  severity?: 'minor' | 'moderate' | 'major';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
}

export interface ModificationDetails {
  modified?: boolean;
  types?: string[];
  reversible?: boolean;
}

export interface FollowUpAnswers {
  id?: string;
  vin: string;
  valuation_id?: string;
  user_id?: string;
  
  // Basic vehicle info
  mileage?: number;
  zip_code?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  
  // NEW: Separate exterior and interior conditions
  exterior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Accident history
  accidents?: AccidentDetails;
  
  // Service and maintenance
  service_history?: string;
  service_notes?: string;
  maintenance_status?: string;
  last_service_date?: string;
  
  // Title and ownership
  title_status?: string;
  previous_owners?: number;
  previous_use?: string;
  
  // Physical condition
  tire_condition?: string;
  dashboard_lights?: string[];
  frame_damage?: boolean;
  
  // Modifications
  modifications?: ModificationDetails;
  
  // Features - NEW FIELD
  features?: string[];
  
  // Metadata
  completion_percentage?: number;
  is_complete?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const CONDITION_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'No cosmetic/mechanical issues. Fully serviced.',
    impact: '+15% to +20% value'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Minor wear, no major damage.',
    impact: 'Market value baseline'
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Visible damage or mechanical issues.',
    impact: '-10% to -20% value'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Needs repair or has structural concerns.',
    impact: '-25% to -40% value'
  }
] as const;

export const SERVICE_HISTORY_OPTIONS = [
  { value: 'dealer', label: 'Dealer-maintained', impact: '+5% to +10% value' },
  { value: 'independent', label: 'Independent mechanic', impact: '+2% to +5% value' },
  { value: 'owner', label: 'Owner-maintained', impact: 'Neutral impact' },
  { value: 'unknown', label: 'No known history', impact: '-5% to -10% value' }
] as const;

export const MAINTENANCE_STATUS_OPTIONS = [
  'Up to date',
  'Overdue',
  'Unknown',
] as const;

export type MaintenanceStatusOption = (typeof MAINTENANCE_STATUS_OPTIONS)[number];

export const TITLE_STATUS_OPTIONS = [
  { value: 'clean', label: 'Clean', impact: 'Full market value' },
  { value: 'salvage', label: 'Salvage', impact: '-40% to -60% value' },
  { value: 'rebuilt', label: 'Rebuilt', impact: '-20% to -40% value' },
  { value: 'branded', label: 'Branded', impact: '-15% to -30% value' },
  { value: 'lemon', label: 'Lemon Law', impact: '-30% to -50% value' }
] as const;

export const TIRE_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent (8/32"+ tread)', impact: '+2% to +3% value' },
  { value: 'good', label: 'Good (6–7/32")', impact: 'Neutral impact' },
  { value: 'worn', label: 'Worn (3–5/32")', impact: '-1% to -2% value' },
  { value: 'replacement', label: 'Needs Replacement (<3/32")', impact: '-3% to -5% value' }
] as const;

export const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal', impact: 'Full market value' },
  { value: 'commercial', label: 'Commercial / Fleet', impact: '-5% to -15% value' },
  { value: 'rental', label: 'Rental / Ride-share', impact: '-10% to -20% value' },
  { value: 'emergency', label: 'Police or Emergency', impact: '-15% to -25% value' }
] as const;

export const DASHBOARD_LIGHTS = [
  { value: 'check_engine', label: 'Check Engine', icon: '⚠️', impact: '-5% to -15% value' },
  { value: 'abs', label: 'ABS', icon: '🛑', impact: '-3% to -8% value' },
  { value: 'tire_pressure', label: 'Tire Pressure', icon: '🛞', impact: '-1% to -3% value' },
  { value: 'oil', label: 'Oil', icon: '🛢️', impact: '-2% to -5% value' },
  { value: 'none', label: 'None', icon: '✅', impact: 'No impact' }
] as const;

export const MODIFICATION_TYPES = [
  'Lift Kit',
  'Performance Tune',
  'Wrap/Paint',
  'Exhaust System',
  'Wheels/Tires',
  'Suspension',
  'Audio System',
  'Interior Modifications',
  'Other'
] as const;
