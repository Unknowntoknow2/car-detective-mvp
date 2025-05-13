
import { ConditionValues } from "@/components/valuation/condition/types";

export function getConditionTips(category: string, value: number): string {
  const conditionTips = {
    exterior: {
      1: "Vehicle exterior shows significant damage, rust, dents, and paint issues requiring major repairs.",
      2: "Exterior has visible wear, minor dents, and paint chips that need attention.",
      3: "Good overall condition with minor imperfections that can be easily fixed.",
      4: "Very well-maintained exterior with minimal wear and no significant damage.",
      5: "Like-new condition with pristine paint and no visible defects."
    },
    interior: {
      1: "Interior shows excessive wear, stains, tears, or damage requiring significant restoration.",
      2: "Noticeable wear on seats, dashboard, and controls, but functionally sound.",
      3: "Clean interior with normal wear for the vehicle's age.",
      4: "Well-maintained interior with minimal wear and no significant issues.",
      5: "Pristine interior condition comparable to a new vehicle."
    },
    mechanical: {
      1: "Significant mechanical issues requiring major repairs or component replacement.",
      2: "Some mechanical concerns that need attention but vehicle is operational.",
      3: "Mechanically sound with normal maintenance needs for the vehicle's age.",
      4: "Very well-maintained mechanically with recent service history.",
      5: "Perfect mechanical condition with comprehensive maintenance records."
    }
  };

  return conditionTips[category as keyof typeof conditionTips]?.[value as keyof typeof conditionTips.exterior] || 
    "No specific tip available for this condition";
}

export function getOverallConditionFromValues(values: ConditionValues): string {
  const total = Object.values(values).reduce((sum, val) => 
    typeof val === 'number' ? sum + val : sum, 0);
  const count = Object.values(values).filter(val => typeof val === 'number').length;
  
  if (count === 0) return "Good";
  
  const average = total / count;
  
  if (average >= 4.5) return "Excellent";
  if (average >= 3.5) return "Very Good";
  if (average >= 2.5) return "Good";
  if (average >= 1.5) return "Fair";
  return "Poor";
}
