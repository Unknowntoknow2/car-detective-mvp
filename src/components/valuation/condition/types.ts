
export type ConditionRatingValue = 'poor' | 'fair' | 'good' | 'excellent';

// Enhanced ConditionRating type to include various properties needed by components
export interface ConditionRatingOption {
  id: string;
  name: string;
  value: number;
  description?: string;
  tip?: string;
  category?: string;
}

// Original ConditionRating type as a string union for backward compatibility
export type ConditionRating = ConditionRatingValue;

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
  exteriorGrade?: number | string;
  interiorGrade?: number | string;
  mechanicalGrade?: number | string;
  tireCondition?: number | string;
  overall?: number;
}

export interface ConditionEvaluationFormProps {
  initialValues?: Partial<ConditionValues>;
  onSubmit?: (values: ConditionValues, overallScore?: number) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export interface ConditionCategoryProps {
  title: string;
  description: string;
  ratings: ConditionRatingOption[];
  selectedRating: string;
  onSelect: (rating: ConditionRatingOption) => void;
}

export interface ConditionTipsProps {
  selectedRatings: Record<string, ConditionRatingOption>;
}
