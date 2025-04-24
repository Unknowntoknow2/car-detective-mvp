
import { AdjustmentBreakdown, AdjustmentCalculator, RulesEngineInput } from '../types';
import { CarfaxData } from '../../carfax/mockCarfaxService';

export class CarfaxCalculator implements AdjustmentCalculator {
  calculate(input: RulesEngineInput): AdjustmentBreakdown | null {
    // If no carfax data provided, return no adjustment
    if (!input.carfaxData) return null;
    
    const carfax = input.carfaxData;
    let totalAdjustment = 0;
    let description = '';
    
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
    }
    
    // Salvage title adjustment
    if (carfax.salvageTitle) {
      totalAdjustment -= 4000;
      description += description ? ', salvage title' : 'Salvage title';
    }
    
    // Service history adjustment
    if (carfax.serviceRecords > 6) {
      totalAdjustment += 200;
      description += description ? ', complete service history' : 'Complete service history';
    }
    
    // One owner bonus
    if (carfax.owners === 1) {
      totalAdjustment += 100;
      description += description ? ', one-owner vehicle' : 'One-owner vehicle';
    }
    
    // If no adjustments, return null
    if (totalAdjustment === 0) return null;
    
    return {
      label: 'Vehicle History',
      value: totalAdjustment,
      description
    };
  }
}
