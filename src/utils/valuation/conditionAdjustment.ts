export function calculateConditionAdjustment(condition: string, baseValue: number): number {
  const conditionMultipliers = {
    'excellent': 0.10,
    'good': 0.05,
    'fair': -0.05,
    'poor': -0.15
  };
  
  const multiplier = conditionMultipliers[condition.toLowerCase() as keyof typeof conditionMultipliers] || 0;
  return baseValue * multiplier;
}