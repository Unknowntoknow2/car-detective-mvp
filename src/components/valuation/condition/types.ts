
export interface ConditionValues {
  exteriorBody: string | number;
  exteriorPaint: string | number;
  interiorSeats: string | number;
  interiorDashboard: string | number;
  mechanicalEngine: string | number;
  mechanicalTransmission: string | number;
  tiresCondition?: string | number;
  odometer?: number;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  zipCode?: string;
  [key: string]: string | number | undefined;
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
}

export interface ConditionTipsProps {
  category: string;
  rating: number | string;
  tip?: string;
  selectedRatings?: Record<string, { value: number; description: string }>;
}

export interface ConditionOption {
  value: number;
  label: string;
  description: string;
}
