
import { RulesEngineInput } from '../rules/types';

export class MarketDemandCalculator {
  calculate(input: RulesEngineInput) {
    // Default values
    const basePrice = input.basePrice || 0;
    const make = input.make || '';
    const model = input.model || '';
    const year = input.year || new Date().getFullYear();
    
    // Lookup market demand for this vehicle
    // In a real implementation, we would query a database or API
    // For now, we'll use some hardcoded values
    
    let demandMultiplier = 1.0; // Default: no change
    let description = 'Average market demand';
    
    // Example: Adjust based on popularity of make/model
    if (make.toLowerCase() === 'toyota' && 
        ['camry', 'rav4', 'corolla'].includes(model.toLowerCase())) {
      demandMultiplier = 1.05; // 5% increase
      description = 'High market demand for this model';
    } else if (make.toLowerCase() === 'tesla') {
      demandMultiplier = 1.08; // 8% increase
      description = 'Very high market demand for electric vehicles';
    } else if (['cadillac', 'lincoln'].includes(make.toLowerCase()) && 
               year < new Date().getFullYear() - 5) {
      demandMultiplier = 0.95; // 5% decrease
      description = 'Lower demand for older luxury sedans';
    }
    
    // Calculate the impact
    const impact = basePrice * (demandMultiplier - 1.0);
    
    return {
      factor: 'Market Demand',
      impact: Math.round(impact),
      description,
      name: 'Market Demand',
      value: Math.round(impact),
      percentAdjustment: basePrice > 0 ? (impact / basePrice) * 100 : 0
    };
  }
}
