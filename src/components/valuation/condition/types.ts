
export type ConditionRating = 'poor' | 'fair' | 'good' | 'excellent';

export interface ConditionOption {
  value: number;
  label: string;
  description?: string;
  tip?: string;
  multiplier?: number;
}

export interface FactorSliderProps {
  id: string;
  label: string;
  options: ConditionOption[];
  value: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export interface ConditionSliderProps {
  id: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export interface ConditionValues {
  accidents: number;
  mileage: number;
  year: number;
  titleStatus: string;
  exteriorGrade?: number;
  interiorGrade?: number;
  mechanicalGrade?: number;
  tireCondition?: number;
}

export interface ConditionEvaluationFormProps {
  initialValues?: Partial<ConditionValues>;
  onSubmit?: (values: ConditionValues) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}
