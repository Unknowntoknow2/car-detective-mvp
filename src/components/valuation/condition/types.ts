
export interface ConditionValues {
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  overall?: number;
  exteriorGrade?: string;
  interiorGrade?: string;
  mechanicalGrade?: string;
  tireCondition?: string;
}

export interface ConditionProps {
  conditionValues: ConditionValues;
  onConditionChange: (conditionValues: ConditionValues) => void;
  onValidityChange?: (isValid: boolean) => void;
  isLoading?: boolean;
}
