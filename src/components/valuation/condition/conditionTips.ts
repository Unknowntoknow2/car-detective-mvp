
import { ConditionRatingOption } from "./types";

// Condition improvement tips based on selected rating categories
export const getConditionTips = (
  selectedRatings: Record<string, ConditionRatingOption>,
) => {
  // Extract tips from selected ratings
  const tips = Object.values(selectedRatings)
    .filter((rating) => rating.tip)
    .map((rating) => ({
      category: rating.category || "",
      tip: rating.tip || "",
    }));

  return tips;
};

// Condition descriptions for each level
export const conditionDescriptions = {
  poor:
    "Vehicle has mechanical faults, accident history, or significant interior/exterior damage.",
  fair:
    "Vehicle shows noticeable wear and tear, might need some minor repairs and maintenance.",
  good:
    "Vehicle is well-maintained with only minor cosmetic defects and regular service history.",
  excellent:
    "Vehicle is in near-perfect condition with no mechanical issues and pristine appearance.",
};

// Specific improvement tips based on condition level
export const conditionImprovementTips = {
  poor:
    "Focus on critical mechanical repairs first. Address safety issues, then consider cosmetic improvements.",
  fair:
    "Regular maintenance and minor repairs can significantly increase value. Consider detailing service.",
  good:
    "Maintain current condition with regular service. Address any minor issues promptly to retain value.",
  excellent:
    "Continue meticulous maintenance. Preserve documentation of service history for best resale value.",
};
