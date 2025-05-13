
export interface ConditionRatingOption {
  id: string;
  name: string;
  category: string;
  tip?: string; // Make tip optional to align with component definition
  value: number; // Ensure this is a number to be consistent with the component definition
}
