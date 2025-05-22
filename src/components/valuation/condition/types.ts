
export interface ConditionValues {
  exteriorBody: string;
  exteriorPaint: string;
  interiorSeats: string;
  interiorDashboard: string;
  mechanicalEngine: string;
  mechanicalTransmission: string;
  tiresCondition: string;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  odometer: number;
  zipCode?: string; // Add zipCode as optional
  exteriorGrade?: number; // Add exteriorGrade as optional for ValuationResult.tsx
}

export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  tip?: string;
  value: number;
  description: string;
}

export interface ConditionTipsProps {
  category?: string;
  rating?: string | number;
  tip?: string;
  selectedRatings?: Record<string, any>;
}

export interface ConditionRating {
  value: string | number;
  description: string;
}
