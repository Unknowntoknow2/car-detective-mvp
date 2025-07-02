import { supabase } from '@/integrations/supabase/client';
import { FollowUpAnswers } from '@/types/follow-up-answers';
import { runMarketDataDiagnostics, logMarketDataSummary } from '@/utils/diagnostics/marketDataDiagnostics';

export interface ValuationEngineInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  followUpData: FollowUpAnswers;
  decodedVehicleData?: {
    trim?: string;
    color?: string;
    bodyType?: string;
    fuelType?: string;
    transmission?: string;
  };
}

export interface ValuationEngineResult {
  estimatedValue: number;
  confidenceScore: number;
  basePrice: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    percentage: number;
    description: string;
  }>;
  priceRange: [number, number];
  marketAnalysis?: any;
  riskFactors?: any[];
  recommendations?: string[];
}

export class ValuationEngine {
  async calculateValuation(input: ValuationEngineInput): Promise<ValuationEngineResult> {
    const logInput = JSON.stringify(input, null, 2);
    console.log('🔥 [calculateValuation] Input:', logInput);

    try {
      const diagnostics = await runMarketDataDiagnostics(input.vin);
      logMarketDataSummary(diagnostics);

      const basePrice = await this.getBasePrice(input);
      const adjustments = await this.calculateAdjustments(input, basePrice);

      const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
      const estimatedValue = Math.max(1000, basePrice + totalAdjustment);
      const confidenceScore = this.calculateConfidenceScore(input, basePrice, diagnostics);

      const priceRange: [number, number] = [
        Math.floor(estimatedValue * 0.9),
        Math.ceil(estimatedValue * 1.1)
      ];

      return {
        estimatedValue: Math.round(estimatedValue),
        confidenceScore,
        basePrice,
        adjustments,
        priceRange,
        marketAnalysis: {
          msrpDataAvailable: diagnostics.msrpData.found,
          auctionDataAvailable: diagnostics.auctionData.hasResults,
          competitorDataAvailable: diagnostics.competitorPrices.hasResults,
          marketListingsAvailable: diagnostics.marketListings.hasResults
        },
        riskFactors: [],
        recommendations: []
      };
    } catch (error) {
      console.error('❌ ValuationEngine error:', error);
      throw error;
    }
  }

  private async getBasePrice(input: ValuationEngineInput): Promise<number> {
    try {
      const { data: trimData } = await supabase
        .from('model_trims')
        .select(`
          msrp,
          trim_name,
          models!inner(model_name, makes!inner(make_name))
        `)
        .eq('year', input.year)
        .eq('models.makes.make_name', input.make)
        .eq('models.model_name', input.model)
        .not('msrp', 'is', null)
        .order('msrp', { ascending: false })
        .limit(5);

      if (trimData && trimData.length > 0) {
        if (input.decodedVehicleData?.trim) {
          const match = trimData.find(t =>
            t.trim_name?.toLowerCase().includes(input.decodedVehicleData.trim!.toLowerCase())
          );
          if (match) return Number(match.msrp);
        }

        const avg = trimData.reduce((sum, t) => sum + Number(t.msrp), 0) / trimData.length;
        return Math.round(avg);
      }

      return this.getFallbackPrice(input.make);
    } catch (err) {
      console.error('⚠️ Error in getBasePrice:', err);
      return this.getFallbackPrice(input.make);
    }
  }

  private getFallbackPrice(make: string): number {
    const fallback: Record<string, number> = {
      'Toyota': 25000, 'Honda': 24000, 'Ford': 23000, 'Chevrolet': 22000, 'Nissan': 21000,
      'Hyundai': 20000, 'Kia': 19000, 'Subaru': 26000, 'Mazda': 23000, 'Volkswagen': 25000,
      'BMW': 35000, 'Mercedes-Benz': 40000, 'Audi': 37000, 'Lexus': 38000, 'Acura': 32000, 'Infiniti': 33000
    };
    return fallback[make] || 20000;
  }

  private async calculateAdjustments(input: ValuationEngineInput, basePrice: number) {
    const adjustments = [];

    if (input.followUpData.mileage) {
      const avgPerYear = 12000;
      const age = new Date().getFullYear() - input.year;
      const expected = avgPerYear * age;
      const diff = input.followUpData.mileage - expected;
      const impact = (diff / 1000) * -50;

      adjustments.push({
        factor: 'Mileage',
        impact,
        percentage: (impact / basePrice) * 100,
        description: `${input.followUpData.mileage.toLocaleString()} vs expected ${expected.toLocaleString()}`
      });
    }

    const conditionMap = { excellent: 0.1, good: 0, fair: -0.15, poor: -0.3 };
    const multiplier = conditionMap[input.followUpData.condition as keyof typeof conditionMap] || 0;
    const condImpact = basePrice * multiplier;

    adjustments.push({
      factor: 'Condition',
      impact: condImpact,
      percentage: multiplier * 100,
      description: `Condition: ${input.followUpData.condition}`
    });

    if (input.followUpData.accidents?.hadAccident) {
      adjustments.push({
        factor: 'Accident History',
        impact: basePrice * -0.1,
        percentage: -10,
        description: 'Vehicle has accident history'
      });
    }

    return adjustments;
  }

  private calculateConfidenceScore(input: ValuationEngineInput, basePrice: number, diagnostics?: any): number {
    let score = 70;

    if (input.followUpData.mileage) score += 5;
    if (input.followUpData.condition) score += 5;
    if (input.followUpData.accidents) score += 5;
    if (input.followUpData.serviceHistory?.hasRecords) score += 5;
    if (input.decodedVehicleData?.trim) score += 5;

    if (diagnostics?.msrpData.found) score += 10;
    if (diagnostics?.auctionData.hasResults) score += 5;
    if (diagnostics?.competitorPrices.hasResults) score += 5;
    if (diagnostics?.marketListings.hasResults) score += 5;

    if (basePrice <= 25000 && input.make === 'Toyota') score -= 10;

    return Math.max(40, Math.min(95, score));
  }
}
