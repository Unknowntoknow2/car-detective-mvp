
export interface ConditionTipsProps {
  category: string;
  rating: ConditionRatingOption;
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
}
