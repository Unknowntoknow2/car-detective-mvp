
export interface ConditionValues {
  accidents?: number;
  mileage?: number;
  year?: number;
  titleStatus?: number;
  // Add other condition factors here
  [key: string]: number | undefined; // Add index signature to make it assignable to Record<string, number>
}

export interface ConditionRating {
  id: string;
  name: string;
  category: string;
  value: number;
}
