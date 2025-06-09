
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const mileageCalculator: Calculator = {
  name: 'Mileage Calculator',
  description: 'Calculates adjustments based on vehicle mileage relative to age',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.mileage || !data.year) {
      return null;
    }

    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - data.year;
    const expectedMileage = vehicleAge * 12000; // Average 12k miles per year
    const mileageDifference = data.mileage - expectedMileage;

    // No significant adjustment for mileage within normal range
    if (Math.abs(mileageDifference) < 5000) {
      return null;
    }

    let impact = 0;
    let description = '';

    if (mileageDifference > 0) {
      // High mileage penalty
      const excessMiles = mileageDifference;
      impact = Math.floor(excessMiles / 1000) * -50; // -$50 per 1000 excess miles
      description = `High mileage (${data.mileage.toLocaleString()} miles vs expected ${expectedMileage.toLocaleString()}) (${impact})`;
    } else {
      // Low mileage bonus
      const underMiles = Math.abs(mileageDifference);
      impact = Math.floor(underMiles / 1000) * 30; // +$30 per 1000 under miles
      description = `Low mileage (${data.mileage.toLocaleString()} miles vs expected ${expectedMileage.toLocaleString()}) (+$${impact})`;
    }

    return {
      factor: 'Mileage Adjustment',
      impact,
      description
    };
  }
};
