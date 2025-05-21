
import { ConditionRating } from './types';

// Define utility functions for condition tips
export const getConditionTipForCategory = (
  category: string,
  rating: string | number | undefined,
  ratings: ConditionRating[]
): string => {
  if (!rating) return "Select a rating to see condition tips.";
  
  const selectedRating = ratings.find(r => r.value === rating);
  return selectedRating?.description || "No tip available for the selected rating.";
};

export const formatCategoryTitle = (category: string): string => {
  return category
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
};
