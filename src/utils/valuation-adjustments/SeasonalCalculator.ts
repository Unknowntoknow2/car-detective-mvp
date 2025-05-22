
import { RulesEngineInput } from '../rules/types';

export class SeasonalCalculator {
  calculate(input: RulesEngineInput) {
    // Default values
    const basePrice = input.basePrice || 0;
    const vehicleType = input.bodyType || input.bodyStyle || '';
    const month = new Date().getMonth(); // 0-11 (Jan-Dec)
    
    // Initialize values
    let seasonalFactor = 0;
    let description = '';
    
    // Get the current season
    const season = this.getCurrentSeason(month);
    
    // Apply seasonal adjustments based on vehicle type and season
    switch (vehicleType.toLowerCase()) {
      case 'convertible':
        seasonalFactor = this.getConvertibleFactor(season);
        description = this.getSeasonalDescription('convertible', season);
        break;
      
      case 'suv':
      case 'crossover':
      case 'truck':
        seasonalFactor = this.getSuvTruckFactor(season);
        description = this.getSeasonalDescription('SUV/truck', season);
        break;
      
      case 'sports':
      case 'coupe':
        seasonalFactor = this.getSportsFactor(season);
        description = this.getSeasonalDescription('sports car', season);
        break;
      
      default:
        // Sedans and other vehicles have less seasonal variation
        seasonalFactor = this.getSedanFactor(season);
        description = this.getSeasonalDescription('sedan', season);
        break;
    }
    
    // Calculate the impact
    const impact = basePrice * seasonalFactor;
    
    return {
      factor: 'Seasonal Adjustment',
      impact: Math.round(impact),
      description,
      name: 'Seasonal Adjustment',
      value: Math.round(impact),
      percentAdjustment: seasonalFactor * 100
    };
  }
  
  private getCurrentSeason(month: number): 'winter' | 'spring' | 'summer' | 'fall' {
    if (month >= 0 && month <= 1) return 'winter'; // Jan-Feb
    if (month >= 2 && month <= 4) return 'spring'; // Mar-May
    if (month >= 5 && month <= 7) return 'summer'; // Jun-Aug
    if (month >= 8 && month <= 10) return 'fall';  // Sep-Nov
    return 'winter'; // Dec
  }
  
  private getConvertibleFactor(season: string): number {
    switch (season) {
      case 'spring': return 0.05;  // 5% increase
      case 'summer': return 0.08;  // 8% increase
      case 'fall': return -0.02;   // 2% decrease
      case 'winter': return -0.05; // 5% decrease
      default: return 0;
    }
  }
  
  private getSuvTruckFactor(season: string): number {
    switch (season) {
      case 'spring': return 0.01;  // 1% increase
      case 'summer': return 0.00;  // No change
      case 'fall': return 0.02;    // 2% increase
      case 'winter': return 0.04;  // 4% increase
      default: return 0;
    }
  }
  
  private getSportsFactor(season: string): number {
    switch (season) {
      case 'spring': return 0.04;  // 4% increase
      case 'summer': return 0.06;  // 6% increase
      case 'fall': return -0.01;   // 1% decrease
      case 'winter': return -0.03; // 3% decrease
      default: return 0;
    }
  }
  
  private getSedanFactor(season: string): number {
    // Sedans have minimal seasonal variation
    switch (season) {
      case 'spring': return 0.01;  // 1% increase
      case 'summer': return 0.01;  // 1% increase
      case 'fall': return 0.00;    // No change
      case 'winter': return 0.00;  // No change
      default: return 0;
    }
  }
  
  private getSeasonalDescription(vehicleType: string, season: string): string {
    switch (vehicleType) {
      case 'convertible':
        return season === 'summer' || season === 'spring'
          ? `Higher demand for convertibles in ${season}`
          : `Lower demand for convertibles in ${season}`;
      
      case 'SUV/truck':
        return season === 'winter' || season === 'fall'
          ? `Higher demand for ${vehicleType}s in ${season}`
          : `Typical demand for ${vehicleType}s in ${season}`;
      
      case 'sports car':
        return season === 'summer' || season === 'spring'
          ? `Higher demand for sports cars in ${season}`
          : `Lower demand for sports cars in ${season}`;
      
      default:
        return `Minimal seasonal impact on ${vehicleType} values`;
    }
  }
}
