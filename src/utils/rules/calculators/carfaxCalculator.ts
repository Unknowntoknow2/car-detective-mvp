import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import { CarfaxData } from '../../carfax/mockCarfaxService';

export class CarfaxCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    // If no carfax data provided, return no adjustment
    if (!input.carfaxData) return null;
    
    const carfax = input.carfaxData;
    let totalAdjustment = 0;
    let description = '';
    let detailedAdjustments: {factor: string, impact: number, description: string}[] = [];
    
    // Accident history adjustment
    if (carfax.accidentsReported > 0) {
      const baseAccidentDeduction = -800;
      const severityMultiplier = 
        carfax.damageSeverity === 'severe' ? 1.875 : 
        carfax.damageSeverity === 'moderate' ? 1.25 : 1;
      
      const accidentAdjustment = baseAccidentDeduction * severityMultiplier * carfax.accidentsReported;
      totalAdjustment += accidentAdjustment;
      
      description += `${carfax.accidentsReported} reported accident${carfax.accidentsReported > 1 ? 's' : ''}`;
      if (carfax.damageSeverity) {
        description += ` with ${carfax.damageSeverity} damage`;
      }
      
      detailedAdjustments.push({
        factor: "Accident History",
        impact: accidentAdjustment,
        description: `${carfax.accidentsReported} accident${carfax.accidentsReported > 1 ? 's' : ''} with ${carfax.damageSeverity || 'minor'} damage`
      });
    }
    
    // Salvage title adjustment
    if (carfax.salvageTitle) {
      const salvageAdjustment = -4000;
      totalAdjustment += salvageAdjustment;
      description += description ? ', salvage title' : 'Salvage title';
      
      detailedAdjustments.push({
        factor: "Salvage Title",
        impact: salvageAdjustment,
        description: "Vehicle has a salvage/rebuilt title"
      });
    }
    
    // Service history adjustment
    if (carfax.serviceRecords > 6) {
      const serviceBonus = 200;
      totalAdjustment += serviceBonus;
      description += description ? ', complete service history' : 'Complete service history';
      
      detailedAdjustments.push({
        factor: "Service History",
        impact: serviceBonus,
        description: "Well-maintained with complete service records"
      });
    }
    
    // One owner bonus
    if (carfax.owners === 1) {
      const oneOwnerBonus = 100;
      totalAdjustment += oneOwnerBonus;
      description += description ? ', one-owner vehicle' : 'One-owner vehicle';
      
      detailedAdjustments.push({
        factor: "Ownership History",
        impact: oneOwnerBonus,
        description: "Single-owner vehicle"
      });
    }
    
    // If no adjustments, return null
    if (totalAdjustment === 0) return null;
    
    return {
      name: 'Vehicle History',
      value: totalAdjustment,
      description,
      percentAdjustment: totalAdjustment / input.basePrice
    };
  }
}
