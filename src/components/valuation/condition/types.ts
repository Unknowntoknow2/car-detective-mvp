
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

export interface ConditionOption {
  value: number;
  label: string;
  description?: string;
}

export interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
}

export interface ConditionRating {
  id: string;
  name: string;
  category: string;
  value: number;
  description?: string;
  tip?: string;
}

export interface ConditionSliderProps {
  id: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export interface ConditionEvaluationFormProps {
  onSubmit: (values: ConditionValues, overallScore: number) => void;
  onCancel?: () => void;
}
