import { ValidatedAdjustment, AdjustmentCalculationContext, AdjustmentCalculationResult } from '@/types/adjustments';

/**
 * Centralized Adjustment Engine
 * Only calculates and returns REAL adjustments with verifiable sources
 * Never returns synthetic/fake adjustments unless explicitly flagged
 */
export class AdjustmentEngine {
  
  /**
   * Calculate all validated adjustments for a vehicle valuation
   */
  static calculateAdjustments(context: AdjustmentCalculationContext): AdjustmentCalculationResult {
    const adjustments: ValidatedAdjustment[] = [];
    const calculationNotes: string[] = [];
    let confidencePenalty = 0;
    let fallbackExplanation: string | undefined;

      vehicleMileage: context.vehicleMileage,
      marketListingsCount: context.marketListings.length,
      condition: context.condition,
      baseValue: context.baseValue
    });

    // 1. MILEAGE ADJUSTMENT - Only if we have real market data
    const mileageAdjustment = this.calculateMileageAdjustment(context);
    if (mileageAdjustment) {
      adjustments.push(mileageAdjustment);
      calculationNotes.push(`Mileage adjustment calculated from ${context.marketListings.length} market comparisons`);
    } else if (context.vehicleMileage) {
      calculationNotes.push('Mileage adjustment skipped - insufficient market data for comparison');
      confidencePenalty += 5;
    }

    // 2. CONDITION ADJUSTMENT - Only if explicitly assessed
    const conditionAdjustment = this.calculateConditionAdjustment(context);
    if (conditionAdjustment) {
      adjustments.push(conditionAdjustment);
      calculationNotes.push('Condition adjustment based on reported vehicle condition');
    }

    // 3. TITLE STATUS ADJUSTMENT - Only for non-clean titles
    const titleAdjustment = this.calculateTitleAdjustment(context);
    if (titleAdjustment) {
      adjustments.push(titleAdjustment);
      calculationNotes.push('Title status adjustment applied for non-clean title');
    }

    // 4. REGIONAL MARKET ADJUSTMENT - Only if we have regional data
    const regionalAdjustment = this.calculateRegionalAdjustment(context);
    if (regionalAdjustment) {
      adjustments.push(regionalAdjustment);
      calculationNotes.push('Regional market adjustment based on local demand data');
    }

    // Apply confidence penalty if no adjustments were calculated
    if (adjustments.length === 0) {
      confidencePenalty += 5;
      fallbackExplanation = 'No real adjustment logic available - displayed value from base calculation only';
      calculationNotes.push('⚠️ No market-based adjustments could be calculated');
    }

    const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.amount, 0);

      adjustmentsCount: adjustments.length,
      totalAdjustment,
      confidencePenalty,
      calculationNotes
    });

    return {
      adjustments,
      totalAdjustment,
      confidencePenalty,
      fallbackExplanation,
      calculationNotes
    };
  }

  /**
   * Calculate mileage adjustment based on market comparisons
   * Only returns adjustment if we have sufficient market data
   */
  private static calculateMileageAdjustment(context: AdjustmentCalculationContext): ValidatedAdjustment | null {
    const { vehicleMileage, marketListings } = context;
    
    if (!vehicleMileage || marketListings.length < 3) {
      return null; // Insufficient data for reliable calculation
    }

    // Calculate average mileage from market listings
    const validMileages = marketListings
      .map(l => l.mileage)
      .filter(m => m && m > 0);

    if (validMileages.length < 3) {
      return null; // Need at least 3 valid mileage data points
    }

    const avgMileage = validMileages.reduce((sum, m) => sum + m, 0) / validMileages.length;
    const mileageDiff = (vehicleMileage - avgMileage) / 1000; // Difference in thousands
    const adjustmentAmount = mileageDiff * -150; // $150 per 1k miles difference

    // Only apply if adjustment is significant (> $100)
    if (Math.abs(adjustmentAmount) < 100) {
      return null;
    }

    return {
      factor: 'Mileage Adjustment',
      amount: Math.round(adjustmentAmount),
      description: `${vehicleMileage.toLocaleString()} mi vs market avg ${Math.round(avgMileage).toLocaleString()} mi`,
      source: 'mileage_deviation_calculator',
      synthetic: false,
      confidence: 85, // High confidence since based on real market data
      calculatedAt: new Date().toISOString(),
      metadata: {
        vehicleMileage,
        marketAverageMileage: avgMileage,
        sampleSize: validMileages.length,
        adjustmentPerMile: -150
      }
    };
  }

  /**
   * Calculate condition-based adjustment
   * Only returns if condition significantly impacts value
   */
  private static calculateConditionAdjustment(context: AdjustmentCalculationContext): ValidatedAdjustment | null {
    const { condition, baseValue } = context;
    
    if (!condition || condition === 'good') {
      return null; // No adjustment for good/average condition
    }

    const conditionMultipliers: Record<string, number> = {
      'excellent': 0.05,   // +5%
      'very-good': 0.02,   // +2%
      'good': 0,           // No adjustment
      'fair': -0.08,       // -8%
      'poor': -0.15        // -15%
    };

    const multiplier = conditionMultipliers[condition.toLowerCase()];
    if (multiplier === undefined || multiplier === 0) {
      return null;
    }

    const adjustmentAmount = Math.round(baseValue * multiplier);

    return {
      factor: 'Condition Adjustment',
      amount: adjustmentAmount,
      description: `${condition} condition vs. average market condition`,
      source: 'condition_assessment',
      synthetic: false,
      confidence: 75, // Moderate confidence as condition is subjective
      calculatedAt: new Date().toISOString(),
      metadata: {
        condition,
        multiplier,
        baseValue
      }
    };
  }

  /**
   * Calculate title status adjustment
   * Only for non-clean titles
   */
  private static calculateTitleAdjustment(context: AdjustmentCalculationContext): ValidatedAdjustment | null {
    const { titleStatus, baseValue } = context;
    
    if (!titleStatus || titleStatus.toLowerCase() === 'clean') {
      return null; // No adjustment for clean titles
    }

    const titlePenalties: Record<string, number> = {
      'salvage': -0.30,    // -30%
      'flood': -0.25,      // -25%
      'lemon': -0.20,      // -20%
      'rebuilt': -0.15,    // -15%
      'hail': -0.10        // -10%
    };

    const penalty = titlePenalties[titleStatus.toLowerCase()];
    if (!penalty) {
      return null; // Unknown title status
    }

    const adjustmentAmount = Math.round(baseValue * penalty);

    return {
      factor: 'Title Status Adjustment',
      amount: adjustmentAmount,
      description: `${titleStatus} title impact on market value`,
      source: 'title_status_lookup',
      synthetic: false,
      confidence: 90, // High confidence in title status impact
      calculatedAt: new Date().toISOString(),
      metadata: {
        titleStatus,
        penalty,
        baseValue
      }
    };
  }

  /**
   * Calculate regional market adjustment
   * Only if we have sufficient regional data
   */
  private static calculateRegionalAdjustment(context: AdjustmentCalculationContext): ValidatedAdjustment | null {
    const { marketListings, zipCode } = context;
    
    // For now, skip regional adjustments unless we have strong regional data
    // This could be enhanced with regional demand indicators from the database
    if (!zipCode || marketListings.length < 5) {
      return null;
    }

    // Calculate regional demand based on days on market
    const avgDaysOnMarket = marketListings
      .map(l => l.days_on_market || 0)
      .filter(d => d > 0)
      .reduce((sum, d, _, arr) => sum + d / arr.length, 0);

    if (!avgDaysOnMarket) {
      return null; // No market timing data available
    }

    // High demand (< 20 days) = +2%, Low demand (> 60 days) = -2%
    let adjustmentPercent = 0;
    let description = '';

    if (avgDaysOnMarket < 20) {
      adjustmentPercent = 0.02;
      description = `High demand market (avg ${Math.round(avgDaysOnMarket)} days on market)`;
    } else if (avgDaysOnMarket > 60) {
      adjustmentPercent = -0.02;
      description = `Slow market (avg ${Math.round(avgDaysOnMarket)} days on market)`;
    } else {
      return null; // Normal market conditions
    }

    const adjustmentAmount = Math.round(context.baseValue * adjustmentPercent);

    return {
      factor: 'Regional Market Adjustment',
      amount: adjustmentAmount,
      description,
      source: 'regional_market_data',
      synthetic: false,
      confidence: 70, // Moderate confidence in regional data
      calculatedAt: new Date().toISOString(),
      metadata: {
        zipCode,
        avgDaysOnMarket,
        adjustmentPercent,
        sampleSize: marketListings.length
      }
    };
  }
}