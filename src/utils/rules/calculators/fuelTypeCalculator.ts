
import { Calculator } from '../interfaces/Calculator';
import { ValuationData, Adjustment } from '../types';

export const fuelTypeCalculator: Calculator = {
  name: 'Fuel Type Calculator',
  description: 'Calculates adjustments based on fuel type efficiency and market demand',
  
  calculate(data: ValuationData): Adjustment | null {
    if (!data.fuelType) {
      return null;
    }

    const fuelType = data.fuelType.toLowerCase();
    
    switch (fuelType) {
      case 'hybrid':
        return {
          factor: 'Hybrid Engine',
          impact: 1500,
          description: 'Hybrid vehicles have higher resale value due to fuel efficiency (+$1,500)'
        };
      
      case 'electric':
        return {
          factor: 'Electric Vehicle',
          impact: 2000,
          description: 'Electric vehicles command premium due to environmental benefits (+$2,000)'
        };
      
      case 'diesel':
        return {
          factor: 'Diesel Engine',
          impact: 800,
          description: 'Diesel engines offer superior fuel economy (+$800)'
        };
      
      case 'gasoline':
      case 'gas':
        return null; // No adjustment for standard gasoline
      
      default:
        return null;
    }
  }
};
