
export interface FollowUpAnswers {
  vin: string;
  zip_code: string;
  mileage?: number;
  condition?: string;
  transmission?: string;
  title_status?: string;
  previous_use: string;
  previous_owners?: number;
  serviceHistory?: string;
  tire_condition?: string;
  brake_condition?: string;
  exterior_condition?: string;
  interior_condition?: string;
  dashboard_lights: string[];
  accident_history?: string;
  modifications?: string;
  features: string[];
  additional_notes: string;
  service_history: string;
  loan_balance?: number;
  has_active_loan?: boolean;
  payoffAmount?: number;
  accidents?: number;
  frame_damage?: boolean;
  smoking?: boolean;
  petDamage?: boolean;
  rust?: boolean;
  hailDamage?: boolean;
  completion_percentage: number;
  is_complete: boolean;
}
