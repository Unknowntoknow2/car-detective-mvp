
export interface ValuationData {
  baseValue: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
}

export function calculateFinalValuation(data: ValuationData): number {
  const { baseValue, adjustments } = data;
  
  let finalValue = baseValue;
  
  for (const adjustment of adjustments) {
    const adjustmentAmount = (baseValue * adjustment.impact) / 100;
    finalValue += adjustmentAmount;
  }
  
  return Math.round(finalValue);
}

export function generateValuationExplanation(data: ValuationData): string {
  const { baseValue, adjustments } = data;
  const finalValue = calculateFinalValuation(data);
  
  let explanation = `Starting with a base value of $${baseValue.toLocaleString()}, `;
  
  if (adjustments.length > 0) {
    explanation += "we applied the following adjustments:\n\n";
    
    adjustments.forEach(adjustment => {
      const adjustmentAmount = (baseValue * adjustment.impact) / 100;
      explanation += `• ${adjustment.factor}: ${adjustment.impact > 0 ? '+' : ''}${adjustment.impact}% (${adjustmentAmount > 0 ? '+' : ''}$${Math.abs(adjustmentAmount).toLocaleString()}) - ${adjustment.description}\n`;
    });
    
    explanation += `\nFinal estimated value: $${finalValue.toLocaleString()}`;
  } else {
    explanation += `resulting in a final estimated value of $${finalValue.toLocaleString()}.`;
  }
  
  return explanation;
}
