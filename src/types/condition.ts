
export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  tip: string;
  value: number; // Changed from string to number to match the other definition
}
