export function calculateTitleAdjustment(titleStatus: string, baseValue: number): number {
  const titleMultipliers = {
    'clean': 0.00,
    'salvage': -0.30,
    'rebuilt': -0.20,
    'flood': -0.25,
    'lemon': -0.35,
    'accident': -0.10
  };
  
  const multiplier = titleMultipliers[titleStatus.toLowerCase() as keyof typeof titleMultipliers] || 0;
  return baseValue * multiplier;
}