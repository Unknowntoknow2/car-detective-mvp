
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
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
}

export interface ConditionFactor {
  id: string;
  label: string;
  description?: string;
  options: ConditionOption[];
}

export interface ConditionOption {
  value: string;
  label: string;
  description?: string;
  impact: number;
}
