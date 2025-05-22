
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
  zipCode?: string;
  [key: string]: string | number | undefined; // Add index signature for dynamic access
}

export interface ConditionTipsProps {
  category?: string;
  rating?: string | number;
  tip?: string;
  selectedRatings?: Record<string, { value: string | number, description: string }>;
}

export interface ConditionRating {
  id: string;
  name: string;
  value: number | string;
  description: string;
}

export type ConditionOption = {
  value: number | string;
  label: string;
  description: string;
};
