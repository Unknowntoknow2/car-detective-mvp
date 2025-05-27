
export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  severity?: 'minor' | 'moderate' | 'major';
  repaired?: boolean;
  frameDamage?: boolean;
}

export interface ModificationDetails {
  modified: boolean;
  types?: string[];
  reversible?: boolean;
}

export interface FollowUpAnswers {
  mileage?: number;
  condition?: string;
  zipCode?: string;
  accidents?: AccidentDetails;
  maintenanceStatus?: string;
  tireCondition?: string;
  serviceHistory?: string;
  titleStatus?: string;
  previousUse?: string;
  modifications?: ModificationDetails;
  dashboardLights?: string[];
  frameDamage?: boolean;
  previousOwners?: number;
  completionPercentage?: number;
}

export const CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'Like new condition, no visible wear', impact: 'Highest value' },
  { value: 'good', label: 'Good', description: 'Normal wear for age, well maintained', impact: 'Good value' },
  { value: 'fair', label: 'Fair', description: 'Shows consistent use, minor issues', impact: 'Reduced value' },
  { value: 'poor', label: 'Poor', description: 'Significant issues, needs repairs', impact: 'Lowest value' }
] as const;

export const DASHBOARD_LIGHTS = [
  { value: 'none', label: 'None', icon: '✅', impact: 'No impact on value' },
  { value: 'check-engine', label: 'Check Engine', icon: '🔧', impact: 'May reduce value significantly' },
  { value: 'abs', label: 'ABS Warning', icon: '🛑', impact: 'Safety concern, affects value' },
  { value: 'airbag', label: 'Airbag Warning', icon: '🚨', impact: 'Major safety issue' },
  { value: 'oil-pressure', label: 'Oil Pressure', icon: '🛢️', impact: 'Engine concern' },
  { value: 'battery', label: 'Battery', icon: '🔋', impact: 'Electrical system issue' },
  { value: 'tire-pressure', label: 'Tire Pressure', icon: '🚗', impact: 'Minor impact' }
] as const;

export const SERVICE_HISTORY_OPTIONS = [
  { value: 'complete', label: 'Complete Service History', description: 'All maintenance records available', impact: 'Positive impact on value' },
  { value: 'partial', label: 'Partial Service History', description: 'Some maintenance records available', impact: 'Neutral impact' },
  { value: 'unknown', label: 'Unknown Service History', description: 'No service records available', impact: 'May reduce value' }
] as const;

export const TITLE_STATUS_OPTIONS = [
  { value: 'clean', label: 'Clean Title', description: 'No issues with ownership', impact: 'No impact on value' },
  { value: 'salvage', label: 'Salvage Title', description: 'Previously declared total loss', impact: 'Significantly reduces value' },
  { value: 'flood', label: 'Flood Damage', description: 'Water damage reported', impact: 'Major reduction in value' },
  { value: 'lemon', label: 'Lemon Title', description: 'Manufacturer buyback', impact: 'Reduces value' }
] as const;

export const TIRE_CONDITION_OPTIONS = [
  { value: 'excellent', label: 'Excellent', description: 'New or nearly new tires', impact: 'Positive impact on value' },
  { value: 'good', label: 'Good', description: 'Tires in good condition with plenty of tread', impact: 'No impact on value' },
  { value: 'fair', label: 'Fair', description: 'Tires show wear but still safe', impact: 'Minor reduction' },
  { value: 'poor', label: 'Poor', description: 'Tires need replacement soon', impact: 'Reduces value' }
] as const;

export const PREVIOUS_USE_OPTIONS = [
  { value: 'personal', label: 'Personal Use', description: 'Used for personal transportation', impact: 'Best for value' },
  { value: 'commercial', label: 'Commercial Use', description: 'Used for business purposes', impact: 'May reduce value' },
  { value: 'rental', label: 'Rental Vehicle', description: 'Previously used as a rental car', impact: 'Reduces value' },
  { value: 'lease', label: 'Lease Return', description: 'Previously leased vehicle', impact: 'Minor impact' }
] as const;

export const MODIFICATION_TYPES = [
  'Performance',
  'Suspension',
  'Exhaust',
  'Intake',
  'Wheels',
  'Interior',
  'Exterior',
  'Audio',
  'Lighting',
  'Other'
] as const;
