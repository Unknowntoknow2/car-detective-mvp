
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const transmissionCalculator: Calculator = {
  name: 'Transmission Calculator',
  description: 'Calculates adjustments based on transmission type',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.transmission) {
      return null;
    }

    const transmission = data.transmission.toLowerCase();
    
    if (transmission.includes('manual') || transmission.includes('stick')) {
      // Manual transmissions can be either premium (sports cars) or penalty (general market)
      if (data.make && ['porsche', 'ferrari', 'lamborghini', 'mclaren'].includes(data.make.toLowerCase())) {
        return {
          factor: 'Manual Transmission (Premium)',
          impact: 2000,
          description: 'Manual transmission is preferred in sports cars (+$2,000)'
        };
      } else {
        return {
          factor: 'Manual Transmission',
          impact: -800,
          description: 'Manual transmission has limited market appeal (-$800)'
        };
      }
    }

    if (transmission.includes('cvt')) {
      return {
        factor: 'CVT Transmission',
        impact: -400,
        description: 'CVT transmission less preferred by buyers (-$400)'
      };
    }

    // Automatic is standard, no adjustment
    return null;
  }
};
