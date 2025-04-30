
export interface ConditionValues {
  accidents?: number;
  mileage?: number;
  year?: number;
  titleStatus?: string;
  // Add other condition factors here
  [key: string]: number | string | undefined; // Update index signature to support string values
}

export interface ConditionRating {
  id: string;
  name: string;
  category: string;
  value: number;
}
