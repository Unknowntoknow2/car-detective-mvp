
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { supabase } from '@/integrations/supabase/client';

export interface ValuationEngineInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  followUpData: FollowUpAnswers;
  decodedVehicleData?: any;
}

export interface ValuationEngineResult {
  estimatedValue: number;
  confidenceScore: number;
  basePrice: number;
  adjustments: ValuationAdjustment[];
  priceRange: [number, number];
  marketAnalysis: MarketAnalysis;
  riskFactors: RiskFactor[];
  recommendations: string[];
}

export interface ValuationAdjustment {
  factor: string;
  impact: number;
  percentage: number;
  description: string;
  category: 'positive' | 'negative' | 'neutral';
}

export interface MarketAnalysis {
  demandFactor: number;
  seasonalAdjustment: number;
  marketTrend: 'rising' | 'stable' | 'declining';
  comparableVehicles: number;
  avgMarketPrice: number;
  daysOnMarket: number;
}

export interface RiskFactor {
  type: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  impact: number;
}

export class ValuationEngine {
  private async getBasePrice(make: string, model: string, year: number): Promise<number> {
    try {
      // Try to get MSRP from model_trims table
      const { data: trimData } = await supabase
        .from('model_trims')
        .select('msrp')
        .eq('year', year)
        .ilike('trim_name', `%${model}%`)
        .maybeSingle();

      if (trimData?.msrp) {
        return this.calculateDepreciatedValue(trimData.msrp, year);
      }

      // Fallback to industry averages
      return this.getIndustryAveragePrice(make, model, year);
    } catch (error) {
      console.error('Error getting base price:', error);
      return this.getIndustryAveragePrice(make, model, year);
    }
  }

  private calculateDepreciatedValue(msrp: number, year: number): number {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    // Industry-standard depreciation rates
    const depreciationRates = [0.2, 0.15, 0.12, 0.1, 0.08, 0.07, 0.06, 0.05];
    let depreciatedValue = msrp;

    for (let i = 0; i < Math.min(age, depreciationRates.length); i++) {
      depreciatedValue *= (1 - depreciationRates[i]);
    }

    // Additional depreciation for very old vehicles
    if (age > depreciationRates.length) {
      const additionalYears = age - depreciationRates.length;
      depreciatedValue *= Math.pow(0.95, additionalYears);
    }

    return Math.round(depreciatedValue);
  }

  private getIndustryAveragePrice(make: string, model: string, year: number): number {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    
    // Base pricing by vehicle type and brand tier
    const basePricing: Record<string, number> = {
      'luxury': 60000,
      'premium': 40000,
      'mainstream': 25000,
      'economy': 18000
    };

    const brandTier = this.getBrandTier(make);
    const basePrice = basePricing[brandTier] || basePricing.mainstream;
    
    return this.calculateDepreciatedValue(basePrice, year);
  }

  private getBrandTier(make: string): string {
    const luxuryBrands = ['Mercedes-Benz', 'BMW', 'Audi', 'Lexus', 'Porsche', 'Jaguar'];
    const premiumBrands = ['Acura', 'Infiniti', 'Cadillac', 'Lincoln', 'Volvo'];
    const economyBrands = ['Kia', 'Hyundai', 'Mitsubishi', 'Nissan'];

    if (luxuryBrands.includes(make)) return 'luxury';
    if (premiumBrands.includes(make)) return 'premium';
    if (economyBrands.includes(make)) return 'economy';
    return 'mainstream';
  }

  private async calculateConditionAdjustments(followUpData: FollowUpAnswers): Promise<ValuationAdjustment[]> {
    const adjustments: ValuationAdjustment[] = [];

    // Overall condition adjustment
    if (followUpData.condition) {
      const conditionMultipliers = {
        'excellent': 0.15,
        'very-good': 0.08,
        'good': 0,
        'fair': -0.12,
        'poor': -0.25
      };
      
      const multiplier = conditionMultipliers[followUpData.condition as keyof typeof conditionMultipliers] || 0;
      adjustments.push({
        factor: 'Overall Condition',
        impact: multiplier,
        percentage: multiplier * 100,
        description: `Vehicle is in ${followUpData.condition} condition`,
        category: multiplier >= 0 ? 'positive' : 'negative'
      });
    }

    // Mileage adjustment
    if (followUpData.mileage) {
      const expectedMileage = this.getExpectedMileage(followUpData.year || new Date().getFullYear());
      const mileageDifference = followUpData.mileage - expectedMileage;
      const mileageAdjustment = this.calculateMileageAdjustment(mileageDifference);
      
      adjustments.push({
        factor: 'Mileage',
        impact: mileageAdjustment,
        percentage: mileageAdjustment * 100,
        description: `${followUpData.mileage.toLocaleString()} miles vs ${expectedMileage.toLocaleString()} expected`,
        category: mileageAdjustment >= 0 ? 'positive' : 'negative'
      });
    }

    // Accident history adjustment
    if (followUpData.accidents?.hadAccident) {
      const accidentAdjustment = this.calculateAccidentAdjustment(followUpData.accidents);
      adjustments.push({
        factor: 'Accident History',
        impact: accidentAdjustment,
        percentage: accidentAdjustment * 100,
        description: this.getAccidentDescription(followUpData.accidents),
        category: 'negative'
      });
    }

    // Service history adjustment
    if (followUpData.serviceHistory) {
      const serviceAdjustment = this.calculateServiceAdjustment(followUpData.serviceHistory);
      adjustments.push({
        factor: 'Service History',
        impact: serviceAdjustment,
        percentage: serviceAdjustment * 100,
        description: this.getServiceDescription(followUpData.serviceHistory),
        category: serviceAdjustment >= 0 ? 'positive' : 'negative'
      });
    }

    // Tire condition adjustment
    if (followUpData.tire_condition) {
      const tireAdjustment = this.calculateTireAdjustment(followUpData.tire_condition);
      adjustments.push({
        factor: 'Tire Condition',
        impact: tireAdjustment,
        percentage: tireAdjustment * 100,
        description: `Tires are in ${followUpData.tire_condition} condition`,
        category: tireAdjustment >= 0 ? 'positive' : 'negative'
      });
    }

    // Modifications adjustment
    if (followUpData.modifications?.hasModifications) {
      const modAdjustment = this.calculateModificationAdjustment(followUpData.modifications);
      adjustments.push({
        factor: 'Modifications',
        impact: modAdjustment,
        percentage: modAdjustment * 100,
        description: this.getModificationDescription(followUpData.modifications),
        category: modAdjustment >= 0 ? 'positive' : 'negative'
      });
    }

    return adjustments;
  }

  private getExpectedMileage(year: number): number {
    const currentYear = new Date().getFullYear();
    const age = currentYear - year;
    return age * 12000; // 12,000 miles per year average
  }

  private calculateMileageAdjustment(mileageDifference: number): number {
    // Adjust by 0.5% for every 1,000 miles difference
    return Math.max(-0.3, Math.min(0.15, -mileageDifference * 0.0005));
  }

  private calculateAccidentAdjustment(accidents: any): number {
    let adjustment = 0;
    
    if (accidents.count) {
      adjustment -= accidents.count * 0.08; // 8% per accident
    }
    
    if (accidents.severity === 'major') {
      adjustment -= 0.15; // Additional 15% for major accidents
    } else if (accidents.severity === 'moderate') {
      adjustment -= 0.08; // Additional 8% for moderate accidents
    }
    
    if (accidents.frameDamage) {
      adjustment -= 0.20; // 20% penalty for frame damage
    }
    
    if (accidents.repaired) {
      adjustment += 0.05; // 5% back if properly repaired
    }
    
    return Math.max(-0.4, adjustment); // Cap at -40%
  }

  private calculateServiceAdjustment(serviceHistory: any): number {
    if (!serviceHistory.hasRecords) {
      return -0.05; // 5% penalty for no service records
    }
    
    let adjustment = 0.03; // 3% bonus for having records
    
    if (serviceHistory.dealerMaintained) {
      adjustment += 0.02; // Additional 2% for dealer maintenance
    }
    
    if (serviceHistory.frequency === 'regular') {
      adjustment += 0.03; // Additional 3% for regular maintenance
    } else if (serviceHistory.frequency === 'rare') {
      adjustment -= 0.02; // 2% penalty for rare maintenance
    }
    
    return Math.min(0.08, adjustment); // Cap at 8%
  }

  private calculateTireAdjustment(condition: string): number {
    const tireMultipliers = {
      'excellent': 0.02,
      'very-good': 0.01,
      'good': 0,
      'fair': -0.01,
      'poor': -0.03,
      'worn': -0.02,
      'replacement': -0.04
    };
    
    return tireMultipliers[condition as keyof typeof tireMultipliers] || 0;
  }

  private calculateModificationAdjustment(modifications: any): number {
    if (!modifications.hasModifications) return 0;
    
    // Most modifications decrease value for general market
    let adjustment = -0.03; // Base 3% penalty
    
    if (modifications.reversible) {
      adjustment += 0.02; // 2% back if reversible
    }
    
    // Performance modifications might add value for specific buyers
    const performanceMods = ['engine', 'exhaust', 'suspension', 'turbo'];
    const hasPerformanceMods = modifications.types?.some((type: string) => 
      performanceMods.some(perf => type.toLowerCase().includes(perf))
    );
    
    if (hasPerformanceMods) {
      adjustment += 0.01; // Small premium for performance mods
    }
    
    return Math.max(-0.08, adjustment); // Cap at -8%
  }

  private async getMarketAnalysis(
    make: string, 
    model: string, 
    year: number, 
    zipCode: string
  ): Promise<MarketAnalysis> {
    try {
      // Get market multiplier for location
      const { data: marketData } = await supabase
        .from('market_adjustments')
        .select('market_multiplier')
        .eq('zip_code', zipCode)
        .maybeSingle();

      const demandFactor = marketData?.market_multiplier 
        ? 1 + (marketData.market_multiplier / 100)
        : 1.0;

      // Get seasonal adjustment
      const seasonalAdjustment = await this.getSeasonalAdjustment(make, model);

      return {
        demandFactor,
        seasonalAdjustment,
        marketTrend: 'stable', // This would come from market trend analysis
        comparableVehicles: 25, // Mock data - would come from listings analysis
        avgMarketPrice: 0, // Will be calculated
        daysOnMarket: 45 // Mock data - would come from market analysis
      };
    } catch (error) {
      console.error('Error getting market analysis:', error);
      return {
        demandFactor: 1.0,
        seasonalAdjustment: 1.0,
        marketTrend: 'stable',
        comparableVehicles: 0,
        avgMarketPrice: 0,
        daysOnMarket: 0
      };
    }
  }

  private async getSeasonalAdjustment(make: string, model: string): Promise<number> {
    const currentMonth = new Date().getMonth() + 1;
    
    try {
      const { data: seasonalData } = await supabase
        .from('seasonal_index')
        .select('*')
        .eq('month', currentMonth)
        .single();

      if (seasonalData) {
        // Determine vehicle type and return appropriate multiplier
        const vehicleType = this.getVehicleType(make, model);
        return seasonalData[vehicleType] || seasonalData.generic;
      }
    } catch (error) {
      console.error('Error getting seasonal adjustment:', error);
    }
    
    return 1.0; // No adjustment if data not available
  }

  private getVehicleType(make: string, model: string): string {
    const model_lower = model.toLowerCase();
    
    if (model_lower.includes('truck') || model_lower.includes('f-150') || model_lower.includes('silverado')) {
      return 'truck';
    }
    if (model_lower.includes('suv') || model_lower.includes('explorer') || model_lower.includes('tahoe')) {
      return 'suv';
    }
    if (model_lower.includes('convertible') || model_lower.includes('roadster')) {
      return 'convertible';
    }
    if (model_lower.includes('sport') || model_lower.includes('gt') || model_lower.includes('corvette')) {
      return 'sport';
    }
    
    return 'generic';
  }

  private calculateRiskFactors(followUpData: FollowUpAnswers): RiskFactor[] {
    const risks: RiskFactor[] = [];

    // High mileage risk
    if (followUpData.mileage && followUpData.mileage > 100000) {
      risks.push({
        type: 'High Mileage',
        severity: followUpData.mileage > 150000 ? 'high' : 'medium',
        description: `Vehicle has ${followUpData.mileage.toLocaleString()} miles`,
        impact: -0.05
      });
    }

    // Accident history risk
    if (followUpData.accidents?.hadAccident) {
      risks.push({
        type: 'Accident History',
        severity: followUpData.accidents.frameDamage ? 'high' : 'medium',
        description: `Vehicle has been in ${followUpData.accidents.count || 1} accident(s)`,
        impact: -0.1
      });
    }

    // Poor maintenance risk
    if (!followUpData.serviceHistory?.hasRecords) {
      risks.push({
        type: 'Unknown Service History',
        severity: 'medium',
        description: 'No service records available',
        impact: -0.03
      });
    }

    // Dashboard warning lights
    if (followUpData.dashboard_lights && followUpData.dashboard_lights.length > 0) {
      risks.push({
        type: 'Warning Lights',
        severity: followUpData.dashboard_lights.length > 2 ? 'high' : 'medium',
        description: `${followUpData.dashboard_lights.length} active warning light(s)`,
        impact: -0.02 * followUpData.dashboard_lights.length
      });
    }

    return risks;
  }

  private generateRecommendations(
    adjustments: ValuationAdjustment[], 
    risks: RiskFactor[]
  ): string[] {
    const recommendations: string[] = [];

    // Maintenance recommendations
    if (risks.some(r => r.type === 'Unknown Service History')) {
      recommendations.push('Obtain service records to improve valuation accuracy');
    }

    // Condition improvements
    const poorConditions = adjustments.filter(a => a.category === 'negative' && a.percentage < -5);
    if (poorConditions.length > 0) {
      recommendations.push('Consider addressing condition issues before selling');
    }

    // Market timing
    recommendations.push('Current market conditions are favorable for selling');

    // Documentation
    if (risks.some(r => r.type === 'Accident History')) {
      recommendations.push('Gather all repair documentation to justify asking price');
    }

    return recommendations;
  }

  // Helper methods for generating descriptions
  private getAccidentDescription(accidents: any): string {
    let desc = `${accidents.count || 1} reported accident(s)`;
    if (accidents.severity) desc += ` (${accidents.severity})`;
    if (accidents.frameDamage) desc += ' with frame damage';
    if (accidents.repaired) desc += ', professionally repaired';
    return desc;
  }

  private getServiceDescription(serviceHistory: any): string {
    if (!serviceHistory.hasRecords) return 'No service records available';
    
    let desc = 'Service records available';
    if (serviceHistory.dealerMaintained) desc += ', dealer maintained';
    if (serviceHistory.frequency) desc += `, ${serviceHistory.frequency} maintenance`;
    return desc;
  }

  private getModificationDescription(modifications: any): string {
    const modCount = modifications.types?.length || 0;
    let desc = `${modCount} modification(s)`;
    if (modifications.reversible) desc += ' (reversible)';
    return desc;
  }

  public async calculateValuation(input: ValuationEngineInput): Promise<ValuationEngineResult> {
    try {
      console.log('🔧 Starting comprehensive valuation calculation:', input);

      // Get base price
      const basePrice = await this.getBasePrice(input.make, input.model, input.year);
      console.log('💰 Base price calculated:', basePrice);

      // Calculate all adjustments
      const adjustments = await this.calculateConditionAdjustments(input.followUpData);
      console.log('📊 Adjustments calculated:', adjustments);

      // Get market analysis
      const marketAnalysis = await this.getMarketAnalysis(
        input.make, 
        input.model, 
        input.year, 
        input.followUpData.zip_code || '90210'
      );
      console.log('📈 Market analysis:', marketAnalysis);

      // Calculate total adjustment
      const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
      
      // Apply adjustments and market factors
      let estimatedValue = basePrice * (1 + totalAdjustment);
      estimatedValue *= marketAnalysis.demandFactor;
      estimatedValue *= marketAnalysis.seasonalAdjustment;
      estimatedValue = Math.round(estimatedValue);

      // Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(input.followUpData, adjustments);

      // Calculate price range
      const priceRange: [number, number] = [
        Math.round(estimatedValue * 0.92),
        Math.round(estimatedValue * 1.08)
      ];

      // Calculate risk factors
      const riskFactors = this.calculateRiskFactors(input.followUpData);

      // Generate recommendations
      const recommendations = this.generateRecommendations(adjustments, riskFactors);

      const result: ValuationEngineResult = {
        estimatedValue,
        confidenceScore,
        basePrice,
        adjustments,
        priceRange,
        marketAnalysis: {
          ...marketAnalysis,
          avgMarketPrice: estimatedValue
        },
        riskFactors,
        recommendations
      };

      console.log('✅ Valuation calculation complete:', result);
      return result;

    } catch (error) {
      console.error('❌ Error in valuation calculation:', error);
      throw new Error('Failed to calculate valuation');
    }
  }

  private calculateConfidenceScore(followUpData: FollowUpAnswers, adjustments: ValuationAdjustment[]): number {
    let score = 75; // Base confidence

    // Increase confidence based on data completeness
    if (followUpData.mileage) score += 5;
    if (followUpData.condition) score += 5;
    if (followUpData.serviceHistory?.hasRecords) score += 8;
    if (followUpData.accidents !== undefined) score += 5;
    if (followUpData.tire_condition) score += 3;
    if (followUpData.completion_percentage > 80) score += 5;

    // Decrease confidence for high adjustments (indicates unusual conditions)
    const totalAdjustmentMagnitude = adjustments.reduce((sum, adj) => sum + Math.abs(adj.impact), 0);
    if (totalAdjustmentMagnitude > 0.2) score -= 10;
    if (totalAdjustmentMagnitude > 0.3) score -= 5;

    return Math.min(95, Math.max(60, score));
  }
}
