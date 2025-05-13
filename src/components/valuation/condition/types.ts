
export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  tip?: string; // Make tip optional to fix the assignment errors
  value: number;
  description?: string;
}

export interface ConditionOption {
  value: number;
  label: string;
  description?: string;
  tip?: string;
  multiplier?: number;
}

export interface ConditionCategoryProps {
  title: string;
  description: string;
  ratings: ConditionRatingOption[];
  selectedRating: string | undefined;
  onSelect: (rating: ConditionRatingOption) => void;
}

export interface ConditionSliderProps {
  id: string;
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export interface ConditionTipsProps {
  selectedRatings: Record<string, ConditionRatingOption>;
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
  zipCode?: string;
  condition?: string;
  conditionOverride?: string;
}

export interface ConditionEvaluationFormProps {
  onSubmit?: (values: ConditionValues, overallScore: number) => void;
  onCancel?: () => void;
  initialValues?: Partial<ConditionValues>;
}
