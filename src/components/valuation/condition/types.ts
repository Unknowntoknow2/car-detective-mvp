
export interface ConditionTipsProps {
  category: string;
  rating: ConditionRatingOption;
  tip?: string;
  selectedRatings?: Record<string, any>;
}

export enum ConditionRatingOption {
  Excellent = 'excellent',
  Good = 'good',
  Fair = 'fair',
  Poor = 'poor'
}

export interface ConditionOption {
  value: string;
  label: string;
  description?: string;
  category?: string;
  tip?: string;
}

export interface ConditionValues {
  exteriorBody: string;
  exteriorPaint: string;
  interiorSeats: string;
  interiorDashboard: string;
  mechanicalEngine: string;
  mechanicalTransmission: string;
  tiresCondition: string;
  odometer: string | number;
  [key: string]: string | number;
  
  // Additional fields for compatibility with existing code
  accidents?: number;
  mileage?: number;
  year?: number;
  titleStatus?: string;
  zipCode?: string;
  exterior?: number;
  interior?: number;
  mechanical?: number;
  title?: number;
  undercarriage?: number;
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
}
