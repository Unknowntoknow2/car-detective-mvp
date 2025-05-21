
export interface ConditionValues {
  exteriorBody: string;
  exteriorPaint: string;
  interiorSeats: string;
  interiorDashboard: string;
  mechanicalEngine: string;
  mechanicalTransmission: string;
  tiresCondition: string;
  odometer: number;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
  [key: string]: string | number | undefined;
}

export interface ConditionOption {
  value: string;
  label: string;
  description: string;
  imageUrl?: string;
  tip?: string;
  score: number;
}

export interface ConditionCategory {
  id: string;
  name: string;
  description: string;
  options: ConditionOption[];
}

export interface ConditionTipsProps {
  category: string;
  rating: string;
  tip: string;
  selectedRatings: Record<string, ConditionOption>;
}
