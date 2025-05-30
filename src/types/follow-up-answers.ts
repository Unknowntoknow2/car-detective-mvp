
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
  dashboard_lights?: boolean;
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
    types?: string[];
    description?: string;
  };
  additional_notes?: string;
  completion_percentage?: number;
  is_complete?: boolean;
  created_at?: string;
  updated_at?: string;
}
