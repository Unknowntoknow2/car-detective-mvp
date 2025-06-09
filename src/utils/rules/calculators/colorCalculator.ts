
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const colorCalculator: Calculator = {
  name: 'Color Calculator',
  description: 'Calculates adjustments based on vehicle color popularity',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.color) {
      return null;
    }

    const color = data.color.toLowerCase();
    
    // Popular colors that may add value
    const popularColors = ['white', 'black', 'silver', 'gray', 'grey'];
    const premiumColors = ['red', 'blue'];
    const rareColors = ['yellow', 'orange', 'purple', 'green'];

    if (popularColors.includes(color)) {
      return {
        factor: 'Popular Color',
        impact: 200,
        description: `${data.color} is a popular color choice (+$200)`
      };
    }

    if (premiumColors.includes(color)) {
      return {
        factor: 'Premium Color',
        impact: 100,
        description: `${data.color} is a premium color choice (+$100)`
      };
    }

    if (rareColors.includes(color)) {
      return {
        factor: 'Rare Color',
        impact: -300,
        description: `${data.color} is a less popular color choice (-$300)`
      };
    }

    return null;
  }
};
