
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const warrantyCalculator: Calculator = {
  name: 'Warranty Calculator',
  description: 'Calculates adjustments based on remaining warranty coverage',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.warranty) {
      return null;
    }

    const warranty = data.warranty;
    let impact = 0;
    const benefits: string[] = [];

    // Factory warranty still active
    if (warranty.factory && warranty.factory.active) {
      const monthsRemaining = warranty.factory.monthsRemaining || 0;
      if (monthsRemaining > 12) {
        impact += 1500;
        benefits.push(`${monthsRemaining} months factory warranty (+$1,500)`);
      } else if (monthsRemaining > 6) {
        impact += 800;
        benefits.push(`${monthsRemaining} months factory warranty (+$800)`);
      }
    }

    // Powertrain warranty
    if (warranty.powertrain && warranty.powertrain.active) {
      const monthsRemaining = warranty.powertrain.monthsRemaining || 0;
      if (monthsRemaining > 24) {
        impact += 1200;
        benefits.push(`${monthsRemaining} months powertrain warranty (+$1,200)`);
      } else if (monthsRemaining > 12) {
        impact += 600;
        benefits.push(`${monthsRemaining} months powertrain warranty (+$600)`);
      }
    }

    // Extended warranty
    if (warranty.extended && warranty.extended.active) {
      impact += 800;
      benefits.push('extended warranty coverage (+$800)');
    }

    if (impact === 0) {
      return null;
    }

    return {
      factor: 'Warranty Coverage',
      impact,
      description: `Active warranty benefits: ${benefits.join(', ')}`
    };
  }
};
