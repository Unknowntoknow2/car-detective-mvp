
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const featuresCalculator: Calculator = {
  name: 'Features Calculator',
  description: 'Calculates adjustments based on vehicle features',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.features || data.features.length === 0) {
      return null;
    }

    let totalImpact = 0;
    const premiumFeatures: string[] = [];

    // Define feature value mappings
    const featureValues: Record<string, number> = {
      'Navigation System': 800,
      'Leather Seats': 1200,
      'Sunroof': 1000,
      'Premium Audio': 600,
      'Heated Seats': 500,
      'Backup Camera': 400,
      'Bluetooth': 200,
      'Cruise Control': 300,
      'Alloy Wheels': 400,
      'Power Windows': 200
    };

    for (const feature of data.features) {
      const value = featureValues[feature] || 0;
      if (value > 0) {
        totalImpact += value;
        premiumFeatures.push(`${feature} (+$${value})`);
      }
    }

    if (totalImpact === 0) {
      return null;
    }

    return {
      factor: 'Premium Features',
      impact: totalImpact,
      description: `Premium features: ${premiumFeatures.join(', ')}`
    };
  }
};
