
export interface ConditionValues {
  accidents?: number;
  mileage?: number;
  year?: number;
  titleStatus?: string;
  [key: string]: any;
}

export interface ConditionOption {
  id: string;
  label: string;
  value: string | number;
}

export interface ConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
}

export interface ConditionCategoryProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export interface ConditionTipsProps {
  category: string;
  tip: string;
}

export interface ConditionEvaluationFormProps {
  initialValues?: ConditionValues;
  onSubmit: (values: ConditionValues) => void;
  isLoading?: boolean;
}

export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  value: number;
  description: string;
  tip?: string;
}
