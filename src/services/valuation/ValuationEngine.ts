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
    try {
      // Run market data diagnostics for the first time to understand our data availability
      console.log('🔍 Running market data diagnostics...');
      const diagnostics = await runMarketDataDiagnostics(input.vin);
      logMarketDataSummary(diagnostics);

      // Get base price using enhanced MSRP lookup
      const basePrice = await this.getBasePrice(input);
      console.log('🛠️ Looking up MSRP for year=' + input.year + ', make=' + input.make + ', model=' + input.model);
      
      if (!basePrice || basePrice <= 0) {
        console.log('❌ No MSRP match found in model_trims — triggering fallback');
        const fallbackPrice = this.getFallbackPrice(input.make);
        console.log('💡 Using fallback base price for brand:', input.make, '→ $' + fallbackPrice.toLocaleString());
      } else {
        console.log('✅ Found MSRP base price: $' + basePrice.toLocaleString());
      }

      // Calculate adjustments based on follow-up data
      const adjustments = await this.calculateAdjustments(input, basePrice);

      // Calculate final estimated value
      const totalAdjustment = adjustments.reduce((sum, adj) => sum + adj.impact, 0);
      const estimatedValue = Math.max(1000, basePrice + totalAdjustment);

      // Calculate confidence score
      const confidenceScore = this.calculateConfidenceScore(input, basePrice, diagnostics);

      // Calculate price range
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
      console.error('Error in ValuationEngine:', error);
      throw error;
    }
  }

  private async getBasePrice(input: ValuationEngineInput): Promise<number> {
    try {
      // Enhanced MSRP lookup with better matching
      console.log('🔍 Enhanced MSRP lookup for:', input.year, input.make, input.model);
      
      const { data: trimData } = await supabase
        .from('model_trims')
        .select(`
          msrp,
          trim_name,
          models!inner(
            model_name,
            makes!inner(make_name)
          )
        `)
        .eq('year', input.year)
        .eq('models.makes.make_name', input.make)
        .eq('models.model_name', input.model)
        .not('msrp', 'is', null)
        .order('msrp', { ascending: false })
        .limit(5);

      if (trimData && trimData.length > 0) {
        // Use average MSRP if multiple trims found, or specific trim if available
        let selectedMsrp = Number(trimData[0].msrp);
        
        // If we have decoded trim data, try to match it
        if (input.decodedVehicleData?.trim) {
          const matchingTrim = trimData.find(item => 
            item.trim_name?.toLowerCase().includes(input.decodedVehicleData?.trim?.toLowerCase() || '')
          );
          if (matchingTrim) {
            selectedMsrp = Number(matchingTrim.msrp);
            console.log('🎯 Found exact trim match:', matchingTrim.trim_name, '→ $' + selectedMsrp.toLocaleString());
          }
        }
        
        if (trimData.length > 1) {
          // Calculate average if multiple trims
          const avgMsrp = trimData.reduce((sum, item) => sum + Number(item.msrp || 0), 0) / trimData.length;
          console.log('📊 Multiple trims found. Using average MSRP: $' + Math.round(avgMsrp).toLocaleString());
          console.log('📋 Available trims:', trimData.map(t => `${t.trim_name}: $${Number(t.msrp || 0).toLocaleString()}`));
          return Math.round(avgMsrp);
        }
        
        console.log('📈 Found MSRP for', input.year, input.make, input.model, '→ $' + selectedMsrp.toLocaleString());
        return selectedMsrp;
      }

      // Count available trims for debugging
      const { count } = await supabase
        .from('model_trims')
        .select('*', { count: 'exact', head: true })
        .eq('year', input.year)
        .eq('models.makes.make_name', input.make)
        .eq('models.model_name', input.model);

      console.log('📊 Count of', input.year, input.make, input.model, 'trims:', count || 0);

      // If no MSRP found, use fallback
      return this.getFallbackPrice(input.make);
    } catch (error) {
      console.error('Error getting base price:', error);
      return this.getFallbackPrice(input.make);
    }
  }

  private getFallbackPrice(make: string): number {
    // Industry average prices by make
    const fallbackPrices: Record<string, number> = {
      'Toyota': 25000,
      'Honda': 24000,
      'Ford': 23000,
      'Chevrolet': 22000,
      'Nissan': 21000,
      'Hyundai': 20000,
      'Kia': 19000,
      'Subaru': 26000,
      'Mazda': 23000,
      'Volkswagen': 25000,
      'BMW': 35000,
      'Mercedes-Benz': 40000,
      'Audi': 37000,
      'Lexus': 38000,
      'Acura': 32000,
      'Infiniti': 33000
    };

    const fallbackPrice = fallbackPrices[make] || 20000;
    console.log('📉 Using fallback price: getIndustryAveragePrice(\'' + make + '\') → $' + fallbackPrice.toLocaleString());
    
    // For Prius Prime specifically, we know it should be much higher
    if (make === 'Toyota' && fallbackPrice === 25000) {
      console.log('📈 Expected MSRP for 2024 Prius Prime = $35,000+ (not found in table)');
    }
    
    return fallbackPrice;
  }

  private async calculateAdjustments(input: ValuationEngineInput, basePrice: number): Promise<Array<{
    factor: string;
    impact: number;
    percentage: number;
    description: string;
  }>> {
    const adjustments = [];

    // Mileage adjustment
    if (input.followUpData.mileage) {
      const avgMileagePerYear = 12000;
      const vehicleAge = new Date().getFullYear() - input.year;
      const expectedMileage = avgMileagePerYear * vehicleAge;
      const mileageDiff = input.followUpData.mileage - expectedMileage;
      const mileageAdjustment = (mileageDiff / 1000) * -50; // $50 per 1000 miles

      adjustments.push({
        factor: 'Mileage',
        impact: mileageAdjustment,
        percentage: (mileageAdjustment / basePrice) * 100,
        description: `${input.followUpData.mileage.toLocaleString()} miles vs expected ${expectedMileage.toLocaleString()}`
      });
    }

    // Condition adjustment
    const conditionMultipliers = {
      'excellent': 0.1,
      'good': 0,
      'fair': -0.15,
      'poor': -0.3
    };

    const conditionMultiplier = conditionMultipliers[input.followUpData.condition as keyof typeof conditionMultipliers] || 0;
    const conditionAdjustment = basePrice * conditionMultiplier;

    adjustments.push({
      factor: 'Condition',
      impact: conditionAdjustment,
      percentage: conditionMultiplier * 100,
      description: `Vehicle condition: ${input.followUpData.condition}`
    });

    // Accident adjustment
    if (input.followUpData.accidents?.hadAccident) {
      const accidentAdjustment = basePrice * -0.1; // 10% reduction for accidents
      adjustments.push({
        factor: 'Accident History',
        impact: accidentAdjustment,
        percentage: -10,
        description: 'Vehicle has accident history'
      });
    }

    return adjustments;
  }

  private calculateConfidenceScore(input: ValuationEngineInput, basePrice: number, diagnostics?: any): number {
    let confidence = 70; // Base confidence

    // Increase confidence with more data
    if (input.followUpData.mileage) confidence += 5;
    if (input.followUpData.condition) confidence += 5;
    if (input.followUpData.accidents) confidence += 5;
    if (input.followUpData.serviceHistory?.hasRecords) confidence += 5;
    if (input.decodedVehicleData?.trim) confidence += 5;

    // Increase confidence based on available market data
    if (diagnostics) {
      if (diagnostics.msrpData.found) confidence += 10;
      if (diagnostics.auctionData.hasResults) confidence += 5;
      if (diagnostics.competitorPrices.hasResults) confidence += 5;
      if (diagnostics.marketListings.hasResults) confidence += 5;
    }

    // Decrease confidence for fallback pricing
    if (basePrice <= 25000 && input.make === 'Toyota') {
      confidence -= 10;
      console.log('📉 Confidence reduced due to fallback pricing: ' + confidence + '%');
    }

    const finalConfidence = Math.min(95, Math.max(40, confidence));
    console.log('🎯 Final confidence score: ' + finalConfidence + '%');
    
    return finalConfidence;
  }
}
