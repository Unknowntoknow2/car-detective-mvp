
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const recallCalculator: Calculator = {
  name: 'Recall Calculator',
  description: 'Calculates adjustments based on outstanding recalls',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.recalls || data.recalls.length === 0) {
      return null;
    }

    const outstandingRecalls = data.recalls.filter(recall => !recall.completed);
    
    if (outstandingRecalls.length === 0) {
      return null;
    }

    // Categorize recalls by severity
    const safetyRecalls = outstandingRecalls.filter(r => r.severity === 'high');
    const minorRecalls = outstandingRecalls.filter(r => r.severity === 'low');

    let impact = 0;
    const factors: string[] = [];

    // Major safety recalls have significant impact
    if (safetyRecalls.length > 0) {
      const safetyPenalty = safetyRecalls.length * -800;
      impact += safetyPenalty;
      factors.push(`${safetyRecalls.length} safety recall(s) (${safetyPenalty})`);
    }

    // Minor recalls have smaller impact
    if (minorRecalls.length > 0) {
      const minorPenalty = minorRecalls.length * -200;
      impact += minorPenalty;
      factors.push(`${minorRecalls.length} minor recall(s) (${minorPenalty})`);
    }

    return {
      factor: 'Outstanding Recalls',
      impact,
      description: `Outstanding recalls: ${factors.join(', ')}`
    };
  }
};
