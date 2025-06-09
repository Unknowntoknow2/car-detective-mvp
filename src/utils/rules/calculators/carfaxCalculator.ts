
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const carfaxCalculator: Calculator = {
  name: 'CARFAX Calculator',
  description: 'Calculates adjustments based on CARFAX report data',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.carfax) {
      return null;
    }

    let impact = 0;
    let description = 'CARFAX report adjustments: ';
    const factors: string[] = [];

    // Clean title adds value
    if (data.carfax.cleanTitle) {
      impact += 500;
      factors.push('clean title (+$500)');
    }

    // Accident history reduces value
    if (data.carfax.accidentCount > 0) {
      const accidentPenalty = data.carfax.accidentCount * -1000;
      impact += accidentPenalty;
      factors.push(`${data.carfax.accidentCount} accident(s) (${accidentPenalty})`);
    }

    // Service history adds value
    if (data.carfax.serviceRecords > 5) {
      impact += 300;
      factors.push('good service history (+$300)');
    }

    if (factors.length === 0) {
      return null;
    }

    return {
      factor: 'CARFAX Report',
      impact,
      description: description + factors.join(', ')
    };
  }
};
