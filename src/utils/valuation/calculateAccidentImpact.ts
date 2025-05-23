
/**
 * Calculate the impact of accidents on a vehicle's value
 * @param baseValue The base value of the vehicle in dollars
 * @param accidentCount Number of accidents reported
 * @param severity The severity of the accidents (minor, moderate, severe)
 * @returns Object containing percentage and dollar impact
 */
export function calculateAccidentImpact(
  baseValue: number, 
  accidentCount: number = 0, 
  severity: string = 'minor'
): { percentImpact: number; dollarImpact: number } {
  // No accidents, no impact
  if (accidentCount === 0) {
    return { percentImpact: 0, dollarImpact: 0 };
  }
  
  // Base impact percentages by severity
  const severityImpacts = {
    'minor': 0.03, // 3% reduction
    'moderate': 0.08, // 8% reduction
    'severe': 0.15 // 15% reduction
  };
  
  // Get the appropriate impact percentage based on severity
  const baseSeverityImpact = severityImpacts[severity as keyof typeof severityImpacts] || severityImpacts.moderate;
  
  // Multiple accidents have a compounding effect, but with diminishing returns
  const multiplier = accidentCount === 1 ? 1 : 1 + (accidentCount - 1) * 0.5;
  
  // Calculate the total percentage impact
  const percentImpact = -(baseSeverityImpact * multiplier);
  
  // Calculate the dollar impact
  const dollarImpact = baseValue * percentImpact;
  
  return { percentImpact, dollarImpact };
}
