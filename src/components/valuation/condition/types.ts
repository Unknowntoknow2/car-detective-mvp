
// Define the ConditionValues interface
export interface ConditionValues {
  exterior?: number;
  interior?: number;
  mechanical?: number;
  title?: number;
  undercarriage?: number;
  accidents?: number;
  mileage?: number;
  year?: number;
  titleStatus?: string;
}

// Define the ConditionCategory type
export type ConditionCategory = 'exterior' | 'interior' | 'mechanical' | 'title' | 'undercarriage';

// Define the ConditionCategoryInfo interface
export interface ConditionCategoryInfo {
  name: ConditionCategory;
  label: string;
  description: string;
  examples: {
    excellent: string;
    good: string;
    fair: string;
    poor: string;
  };
}
