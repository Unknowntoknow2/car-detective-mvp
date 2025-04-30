
export interface ConditionRating {
  id: string;
  name: string;
  value: number;
  category: string;
}

export interface ConditionValues {
  [key: string]: number;
}
