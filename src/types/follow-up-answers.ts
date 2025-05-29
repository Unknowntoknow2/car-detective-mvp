export interface FollowUpAnswers {
  vin: string;
  mileage?: number;
  zip_code?: string;
  condition?: 'excellent' | 'good' | 'fair' | 'poor';
  exterior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  interior_condition?: 'excellent' | 'good' | 'fair' | 'poor';
  previous_owners?: number;
  dashboard_lights?: string[]; // Add this new field
  
  // Accident History
  has_accidents?: boolean;
  accident_count?: number;
  accident_severity?: 'minor' | 'moderate' | 'severe';
  accident_types?: string[];
  repairs_completed?: boolean;
  insurance_claims?: number;
  
  // Features
  selected_features?: string[];
  
  // Service & Maintenance
  last_service_date?: string;
  service_records_available?: boolean;
  maintenance_frequency?: 'excellent' | 'good' | 'fair' | 'poor';
  
  // Title & Ownership
  title_status?: 'clean' | 'salvage' | 'flood' | 'lemon';
  ownership_history?: string;
  
  // Physical Features
  fuel_type?: string;
  transmission?: string;
  drivetrain?: string;
  
  // Modifications
  modifications?: {
    modified: boolean;
    types: string[];
  };
}

export const CONDITION_OPTIONS = [
  {
    value: 'excellent',
    label: 'Excellent',
    description: 'Like new condition. Vehicle is in top condition with no mechanical or cosmetic issues.'
  },
  {
    value: 'good',
    label: 'Good',
    description: 'Clean condition. Vehicle has minor wear and tear, but is well-maintained and in good working order.'
  },
  {
    value: 'fair',
    label: 'Fair',
    description: 'Average condition. Vehicle has some mechanical or cosmetic issues that may require attention.'
  },
  {
    value: 'poor',
    label: 'Poor',
    description: 'Rough condition. Vehicle has significant mechanical or cosmetic issues that require major repairs.'
  }
];
