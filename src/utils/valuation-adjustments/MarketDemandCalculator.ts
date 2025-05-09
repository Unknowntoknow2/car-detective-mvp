
import { AdjustmentBreakdown, RulesEngineInput } from '../rules/types';
import { Calculator } from '../rules/interfaces/Calculator';

export class MarketDemandCalculator implements Calculator {
  private BASE_ADJUSTMENT = 0.03; // 3% base adjustment

  public async calculate(input: RulesEngineInput): Promise<AdjustmentBreakdown | null> {
    // Get the current month (1-12)
    const currentMonth = new Date().getMonth() + 1;
    
    // Calculate seasonal component (higher demand in spring/summer months)
    let seasonalAdjustment = 0;
    if (currentMonth >= 3 && currentMonth <= 8) {
      // Spring and summer months - higher demand
      seasonalAdjustment = 0.02; // 2% boost
    } else if (currentMonth >= 11 || currentMonth <= 1) {
      // Winter months - lower demand
      seasonalAdjustment = -0.01; // 1% reduction
    }
    
    // Check if vehicle type information is available
    let typeAdjustment = 0;
    const bodyType = input.bodyType?.toLowerCase() || '';
    
    if (bodyType.includes('suv') || bodyType.includes('crossover')) {
      typeAdjustment = 0.02; // 2% boost for SUVs/crossovers
    } else if (bodyType.includes('truck') || bodyType.includes('pickup')) {
      typeAdjustment = 0.015; // 1.5% boost for trucks
    } else if (bodyType.includes('sedan')) {
      typeAdjustment = -0.01; // 1% reduction for sedans
    }
    
    // Calculate combined adjustment
    const totalAdjustment = this.BASE_ADJUSTMENT + seasonalAdjustment + typeAdjustment;
    const impactValue = Math.round(input.basePrice * totalAdjustment);
    const factor = "Market Demand";
    const impact = impactValue;
    
    // Description based on components
    let description = "Based on current market conditions";
    if (seasonalAdjustment !== 0) {
      description += seasonalAdjustment > 0 
        ? ", seasonal demand is higher" 
        : ", seasonal demand is lower";
    }
    if (typeAdjustment !== 0 && bodyType) {
      description += typeAdjustment > 0 
        ? `, ${bodyType} vehicles have higher demand` 
        : `, ${bodyType} vehicles have lower demand`;
    }
    
    return {
      name: "Market Demand",
      value: impactValue,
      percentAdjustment: totalAdjustment * 100,
      description,
      factor,
      impact
    };
  }
}
