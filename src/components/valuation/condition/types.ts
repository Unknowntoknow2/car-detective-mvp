
export interface ConditionValues {
  exteriorBody: number | string;
  exteriorPaint: number | string;
  interiorSeats: number | string;
  interiorDashboard: number | string;
  mechanicalEngine: number | string;
  mechanicalTransmission: number | string;
  tiresCondition: number | string;
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
  odometer?: number;
}

export type ConditionRating = "excellent" | "good" | "fair" | "poor";

export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  tip?: string;
  value: number;
  description: string;
}

export interface ConditionCategory {
  id: string;
  name: string;
  description: string;
  options: ConditionRatingOption[];
}
