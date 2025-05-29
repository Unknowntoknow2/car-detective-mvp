
export const TITLE_STATUS_OPTIONS = [
  { value: 'clean', label: 'Clean Title', description: 'No reported accidents, damage, or issues' },
  { value: 'salvage', label: 'Salvage Title', description: 'Vehicle has been declared a total loss by an insurance company' },
  { value: 'flood', label: 'Flood Title', description: 'Vehicle has sustained flood damage' },
  { value: 'lemon', label: 'Lemon Title', description: 'Vehicle has been repurchased by the manufacturer due to recurring issues' },
];

export const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal Use', description: 'Used for personal transportation' },
  { value: 'rental', label: 'Rental Use', description: 'Used as a rental vehicle' },
  { value: 'fleet', label: 'Fleet Use', description: 'Part of a company fleet' },
  { value: 'commercial', label: 'Commercial Use', description: 'Used for commercial purposes' },
  { value: 'taxi', label: 'Taxi Use', description: 'Used as a taxi' },
];

export const SERVICE_HISTORY_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Full service history, all maintenance up to date' },
  { value: 'good', label: 'Good', description: 'Regular service history, most maintenance up to date' },
  { value: 'fair', label: 'Fair', description: 'Some service history, some maintenance up to date' },
  { value: 'poor', label: 'Poor', description: 'Little to no service history, maintenance lacking' },
];

export const MAINTENANCE_STATUS_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'No maintenance needed' },
  { value: 'good', label: 'Good', description: 'Minor maintenance may be needed soon' },
  { value: 'fair', label: 'Fair', description: 'Some maintenance needed' },
  { value: 'poor', label: 'Poor', description: 'Major maintenance needed' },
];

export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new condition' },
  { value: 'good', label: 'Good', description: 'Well maintained with minor wear' },
  { value: 'fair', label: 'Fair', description: 'Shows wear but functional' },
  { value: 'poor', label: 'Poor', description: 'Needs significant work' },
];

export const TIRE_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', impact: 'New or like new tires' },
  { value: 'good', label: 'Good', impact: 'Tires have plenty of tread remaining' },
  { value: 'fair', label: 'Fair', impact: 'Tires are starting to show wear' },
  { value: 'poor', label: 'Poor', impact: 'Tires need replacement soon' },
];

export const DASHBOARD_LIGHTS = [
  { value: 'engine', label: 'Check Engine Light', icon: '⚙️', impact: 'Indicates a problem with the engine or related systems' },
  { value: 'abs', label: 'ABS Warning Light', icon: '⛔', impact: 'Indicates a problem with the anti-lock braking system' },
  { value: 'airbag', label: 'Airbag Warning Light', icon: '💺', impact: 'Indicates a problem with the airbag system' },
  { value: 'battery', label: 'Battery Warning Light', icon: '🔋', impact: 'Indicates a problem with the charging system' },
  { value: 'oil', label: 'Oil Pressure Warning Light', icon: '🛢️', impact: 'Indicates low oil pressure' },
  { value: 'temperature', label: 'Temperature Warning Light', icon: '🌡️', impact: 'Indicates the engine is overheating' },
  { value: 'none', label: 'No Lights', icon: '✅', impact: 'No warning lights are illuminated' },
];

export const MODIFICATION_TYPES = [
  'Performance Upgrades',
  'Cosmetic Changes',
  'Audio/Video',
  'Suspension',
  'Wheels/Tires',
  'Other'
];

export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  location?: string;
  severity?: 'minor' | 'moderate' | 'severe';
  repaired?: boolean;
  frameDamage?: boolean;
  description?: string;
}

export interface ModificationDetails {
  modified: boolean;
  types: string[];
  reversible?: boolean;
}

export interface FollowUpAnswers {
  // Identifiers
  vin: string;
  user_id?: string;
  valuation_id?: string;
  
  // Basic Vehicle Info
  mileage?: number;
  zip_code: string;
  condition: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Title & Ownership
  title_status: 'clean' | 'salvage' | 'flood' | 'lemon';
  previous_owners?: number;
  previous_use: 'personal' | 'rental' | 'fleet' | 'commercial' | 'taxi';
  
  // Service & Maintenance
  service_history: 'excellent' | 'good' | 'fair' | 'poor';
  maintenance_status: 'excellent' | 'good' | 'fair' | 'poor';
  last_service_date?: string;
  service_notes?: string;
  
  // Physical Features
  tire_condition: 'excellent' | 'good' | 'fair' | 'poor';
  exterior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  frame_damage: boolean;
  dashboard_lights: string[];
  
  // Accident History
  accidents: AccidentDetails;
  
  // Modifications
  modifications: ModificationDetails;
  
  // Features
  features?: string[];
  
  // Progress Tracking
  completion_percentage: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}
