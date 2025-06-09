
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const trimCalculator: Calculator = {
  name: 'Trim Calculator',
  description: 'Calculates adjustments based on vehicle trim level',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.trim) {
      return null;
    }

    const trim = data.trim.toLowerCase();
    
    // Premium trim indicators
    const premiumIndicators = ['premium', 'luxury', 'platinum', 'limited', 'ultimate', 'signature'];
    const sportIndicators = ['sport', 'performance', 'turbo', 'gt', 'ss', 'rs', 'amg', 'm3', 'm5'];
    const baseIndicators = ['base', 'standard', 'lx', 'l', 'ls'];

    if (premiumIndicators.some(indicator => trim.includes(indicator))) {
      return {
        factor: 'Premium Trim',
        impact: 2500,
        description: `${data.trim} is a premium trim level with additional features (+$2,500)`
      };
    }

    if (sportIndicators.some(indicator => trim.includes(indicator))) {
      return {
        factor: 'Sport/Performance Trim',
        impact: 3000,
        description: `${data.trim} is a performance-oriented trim with enhanced value (+$3,000)`
      };
    }

    if (baseIndicators.some(indicator => trim.includes(indicator))) {
      return {
        factor: 'Base Trim',
        impact: -1000,
        description: `${data.trim} is a base trim with fewer features (-$1,000)`
      };
    }

    // No clear trim classification
    return null;
  }
};
