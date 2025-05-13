
export interface ConditionValues {
  accidents?: number;
  mileage?: number;
  year?: number;
  titleStatus?: string;
  [key: string]: any;
}

export interface ConditionOption {
  id?: string;
  label: string;
  value: number;
  tip?: string;
  multiplier?: number;
}

export interface ConditionSliderProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  description?: string;
  id?: string;
  name?: string;
}

export interface ConditionCategoryProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  ratings?: ConditionRatingOption[];
  selectedRating?: ConditionRatingOption | null;
  onSelect?: (rating: ConditionRatingOption) => void;
}

export interface ConditionTipsProps {
  category: string;
  tip: string;
  selectedRatings?: Record<string, ConditionRatingOption>;
}

export interface ConditionEvaluationFormProps {
  initialValues?: ConditionValues;
  onSubmit: (values: ConditionValues) => void;
  isLoading?: boolean;
  onCancel?: () => void;
}

export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  value: number;
  description: string;
  tip?: string;
}
