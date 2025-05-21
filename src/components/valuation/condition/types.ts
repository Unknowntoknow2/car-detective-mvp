
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
  value: string | number;
  label: string;
  description?: string;
  category?: string;
  tip?: string;
  multiplier?: number;
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
  
  // Additional fields with explicit types
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
  
  // Index signature that accommodates both string and number values
  [key: string]: string | number | undefined;
}
