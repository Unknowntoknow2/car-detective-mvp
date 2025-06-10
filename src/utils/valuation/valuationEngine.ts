
export interface AccidentImpact {
  percentage: number;
  amount: number;
  severity: 'minor' | 'moderate' | 'severe';
}

export const calculateAccidentImpact = (
  baseValue: number,
  accidentHistory: any[]
): AccidentImpact => {
  if (!accidentHistory || accidentHistory.length === 0) {
    return {
      percentage: 0,
      amount: 0,
      severity: 'minor'
    };
  }

  // Simple calculation based on number of accidents
  const impactPercentage = Math.min(accidentHistory.length * 10, 30);
  const amount = baseValue * (impactPercentage / 100);
  
  let severity: 'minor' | 'moderate' | 'severe' = 'minor';
  if (impactPercentage > 20) severity = 'severe';
  else if (impactPercentage > 10) severity = 'moderate';

  return {
    percentage: impactPercentage,
    amount,
    severity
  };
};
