
export interface AccidentDetails {
  hadAccident: boolean;
  count?: number;
  severity?: 'minor' | 'moderate' | 'major';
  repaired?: boolean;
  frameDamage?: boolean;
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
  modifications?: string[];
  dashboardLights?: string[];
}
