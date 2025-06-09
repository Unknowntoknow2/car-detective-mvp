
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const photoScoreCalculator: Calculator = {
  name: 'Photo Score Calculator',
  description: 'Calculates adjustments based on photo quality and condition assessment',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.photoScore) {
      return null;
    }

    const score = data.photoScore;
    let impact = 0;
    let description = '';

    if (score >= 90) {
      impact = 500;
      description = 'Excellent photo quality shows pristine condition (+$500)';
    } else if (score >= 80) {
      impact = 200;
      description = 'Good photo quality shows well-maintained vehicle (+$200)';
    } else if (score >= 70) {
      impact = 0;
      description = 'Average photo quality, no adjustment';
    } else if (score >= 60) {
      impact = -200;
      description = 'Poor photo quality suggests maintenance issues (-$200)';
    } else {
      impact = -500;
      description = 'Very poor photo quality indicates significant issues (-$500)';
    }

    if (impact === 0) {
      return null;
    }

    return {
      factor: 'Photo Assessment',
      impact,
      description
    };
  }
};
