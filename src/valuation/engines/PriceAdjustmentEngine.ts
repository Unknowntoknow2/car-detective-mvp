/**
 * Price Adjustment Engine - Calculates and applies valuation adjustments
 */

import { PriceAdjustment, AdditionalFactor } from '../types/core';

export interface AdjustmentEngineInput {
  baseValue: number;
  conditionAdjustment: any;
  mileageAdjustment: any;
  marketAdjustment: any;
  additionalFactors?: AdditionalFactor[];
}

export class PriceAdjustmentEngine {
  
  calculateAdjustments(input: AdjustmentEngineInput): PriceAdjustment[] {
    const adjustments: PriceAdjustment[] = [];

    // Condition adjustments
    if (input.conditionAdjustment) {
      const conditionImpact = input.baseValue * (input.conditionAdjustment.adjustmentFactor - 1);
      adjustments.push({
        factor: 'Vehicle Condition',
        impact: conditionImpact,
        percentage: (input.conditionAdjustment.adjustmentFactor - 1) * 100,
        description: `Condition-based adjustment (${input.conditionAdjustment.score}/100 score)`,
        confidence: input.conditionAdjustment.confidence,
        category: 'condition'
      });
    }

    // Mileage adjustments
    if (input.mileageAdjustment) {
      const mileageImpact = input.baseValue * (input.mileageAdjustment.adjustmentFactor - 1);
      adjustments.push({
        factor: 'Mileage',
        impact: mileageImpact,
        percentage: (input.mileageAdjustment.adjustmentFactor - 1) * 100,
        description: `Mileage adjustment (${input.mileageAdjustment.category} mileage)`,
        confidence: input.mileageAdjustment.confidence,
        category: 'mileage'
      });
    }

    // Market adjustments
    if (input.marketAdjustment) {
      const marketImpact = input.baseValue * (input.marketAdjustment.adjustmentFactor - 1);
      adjustments.push({
        factor: 'Market Conditions',
        impact: marketImpact,
        percentage: (input.marketAdjustment.adjustmentFactor - 1) * 100,
        description: `Market-based adjustment (${input.marketAdjustment.competitivePosition})`,
        confidence: input.marketAdjustment.confidence,
        category: 'market'
      });
    }

    // Additional factors
    if (input.additionalFactors) {
      for (const factor of input.additionalFactors) {
        const additionalAdjustment = this.processAdditionalFactor(factor, input.baseValue);
        if (additionalAdjustment) {
          adjustments.push(additionalAdjustment);
        }
      }
    }

    return adjustments;
  }

  applyAdjustments(baseValue: number, adjustments: PriceAdjustment[]): number {
    const totalImpact = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const finalValue = baseValue + totalImpact;
    
    // Apply minimum value floor
    return Math.max(1000, finalValue);
  }

  private processAdditionalFactor(factor: AdditionalFactor, baseValue: number): PriceAdjustment | null {
    const factorProcessors: Record<string, (value: any, baseValue: number) => PriceAdjustment | null> = {
      'navigation_system': (value, base) => this.processNavigation(value, base),
      'premium_audio': (value, base) => this.processPremiumAudio(value, base),
      'sunroof': (value, base) => this.processSunroof(value, base),
      'leather_seats': (value, base) => this.processLeatherSeats(value, base),
      'third_row_seating': (value, base) => this.processThirdRow(value, base),
      'all_wheel_drive': (value, base) => this.processAWD(value, base),
      'turbo_engine': (value, base) => this.processTurbo(value, base),
      'hybrid_powertrain': (value, base) => this.processHybrid(value, base),
      'electric_powertrain': (value, base) => this.processElectric(value, base),
      'manual_transmission': (value, base) => this.processManualTransmission(value, base),
      'aftermarket_modifications': (value, base) => this.processModifications(value, base),
      'extended_warranty': (value, base) => this.processWarranty(value, base),
      'one_owner': (value, base) => this.processOneOwner(value, base),
      'non_smoker': (value, base) => this.processNonSmoker(value, base),
      'garage_kept': (value, base) => this.processGarageKept(value, base)
    };

    const processor = factorProcessors[factor.factor];
    return processor ? processor(factor.value, baseValue) : null;
  }

  // Feature processors
  private processNavigation(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Navigation System',
      impact: Math.min(1500, baseValue * 0.02),
      percentage: 2,
      description: 'Factory navigation system adds value',
      confidence: 0.8,
      category: 'features'
    };
  }

  private processPremiumAudio(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Premium Audio',
      impact: Math.min(1200, baseValue * 0.015),
      percentage: 1.5,
      description: 'Premium audio system enhancement',
      confidence: 0.75,
      category: 'features'
    };
  }

  private processSunroof(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Sunroof',
      impact: Math.min(1000, baseValue * 0.015),
      percentage: 1.5,
      description: 'Sunroof/moonroof feature',
      confidence: 0.8,
      category: 'features'
    };
  }

  private processLeatherSeats(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Leather Seats',
      impact: Math.min(2000, baseValue * 0.025),
      percentage: 2.5,
      description: 'Leather seat upgrade',
      confidence: 0.85,
      category: 'features'
    };
  }

  private processThirdRow(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Third Row Seating',
      impact: Math.min(1800, baseValue * 0.03),
      percentage: 3,
      description: 'Third row seating capacity',
      confidence: 0.9,
      category: 'features'
    };
  }

  private processAWD(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'All-Wheel Drive',
      impact: Math.min(3000, baseValue * 0.05),
      percentage: 5,
      description: 'All-wheel drive system',
      confidence: 0.9,
      category: 'features'
    };
  }

  private processTurbo(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Turbocharged Engine',
      impact: Math.min(2500, baseValue * 0.04),
      percentage: 4,
      description: 'Turbocharged engine performance',
      confidence: 0.85,
      category: 'features'
    };
  }

  private processHybrid(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    return {
      factor: 'Hybrid Powertrain',
      impact: Math.min(4000, baseValue * 0.06),
      percentage: 6,
      description: 'Hybrid fuel efficiency technology',
      confidence: 0.9,
      category: 'features'
    };
  }

  private processElectric(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    // Electric vehicles have complex valuation - battery age matters
    return {
      factor: 'Electric Powertrain',
      impact: Math.min(5000, baseValue * 0.08),
      percentage: 8,
      description: 'Electric vehicle technology (battery condition dependent)',
      confidence: 0.7, // Lower confidence due to battery degradation factors
      category: 'features'
    };
  }

  private processManualTransmission(hasFeature: boolean, baseValue: number): PriceAdjustment | null {
    if (!hasFeature) return null;
    // Manual transmission impact varies by vehicle type and market
    const impact = baseValue * 0.02; // Could be positive or negative
    return {
      factor: 'Manual Transmission',
      impact: impact,
      percentage: 2,
      description: 'Manual transmission (market dependent value impact)',
      confidence: 0.6,
      category: 'features'
    };
  }

  private processModifications(modifications: any[], baseValue: number): PriceAdjustment | null {
    if (!modifications || modifications.length === 0) return null;
    
    let totalImpact = 0;
    let positiveImpact = 0;
    let negativeImpact = 0;

    for (const mod of modifications) {
      if (mod.impactOnValue === 'positive') {
        positiveImpact += Math.min(mod.cost * 0.3, baseValue * 0.02); // 30% of cost, max 2% of value
      } else if (mod.impactOnValue === 'negative') {
        negativeImpact -= Math.min(mod.cost * 0.5, baseValue * 0.05); // 50% penalty, max 5% of value
      }
      // Neutral modifications don't affect value
    }

    totalImpact = positiveImpact + negativeImpact;

    return {
      factor: 'Aftermarket Modifications',
      impact: totalImpact,
      percentage: (totalImpact / baseValue) * 100,
      description: `${modifications.length} aftermarket modifications`,
      confidence: 0.6, // Lower confidence due to modification subjectivity
      category: 'features'
    };
  }

  private processWarranty(warrantyInfo: any, baseValue: number): PriceAdjustment | null {
    if (!warrantyInfo || !warrantyInfo.remaining) return null;
    
    const yearsRemaining = warrantyInfo.yearsRemaining || 0;
    const impact = Math.min(yearsRemaining * 500, baseValue * 0.03);

    return {
      factor: 'Extended Warranty',
      impact: impact,
      percentage: (impact / baseValue) * 100,
      description: `${yearsRemaining} years remaining on extended warranty`,
      confidence: 0.8,
      category: 'features'
    };
  }

  private processOneOwner(isOneOwner: boolean, baseValue: number): PriceAdjustment | null {
    if (!isOneOwner) return null;
    return {
      factor: 'One Owner',
      impact: baseValue * 0.02,
      percentage: 2,
      description: 'Single owner vehicle history',
      confidence: 0.85,
      category: 'history'
    };
  }

  private processNonSmoker(isNonSmoker: boolean, baseValue: number): PriceAdjustment | null {
    if (!isNonSmoker) return null;
    return {
      factor: 'Non-Smoker',
      impact: baseValue * 0.01,
      percentage: 1,
      description: 'Non-smoker interior condition',
      confidence: 0.75,
      category: 'condition'
    };
  }

  private processGarageKept(isGarageKept: boolean, baseValue: number): PriceAdjustment | null {
    if (!isGarageKept) return null;
    return {
      factor: 'Garage Kept',
      impact: baseValue * 0.015,
      percentage: 1.5,
      description: 'Garage-kept vehicle protection',
      confidence: 0.8,
      category: 'condition'
    };
  }

  /**
   * Get total adjustment summary
   */
  getAdjustmentSummary(adjustments: PriceAdjustment[]): {
    totalImpact: number;
    positiveAdjustments: PriceAdjustment[];
    negativeAdjustments: PriceAdjustment[];
    categoryBreakdown: Record<string, number>;
  } {
    const totalImpact = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const positiveAdjustments = adjustments.filter(adj => adj.impact > 0);
    const negativeAdjustments = adjustments.filter(adj => adj.impact < 0);
    
    const categoryBreakdown: Record<string, number> = {};
    for (const adj of adjustments) {
      categoryBreakdown[adj.category] = (categoryBreakdown[adj.category] || 0) + adj.impact;
    }

    return {
      totalImpact,
      positiveAdjustments,
      negativeAdjustments,
      categoryBreakdown
    };
  }
}