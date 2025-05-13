
export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  tip?: string;
  value: number;
  description: string; // Add description property to fix the errors
}
