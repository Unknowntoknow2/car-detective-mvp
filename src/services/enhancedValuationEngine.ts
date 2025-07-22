import { supabase } from '@/integrations/supabase/client';

interface MarketListing {
  id: string;
  price: number;
  mileage?: number;
  days_on_market?: number;
  condition?: string;
  source: string;
  confidence_score?: number;
  year?: number;
  make?: string;
  model?: string;
}

interface EnhancedValuationInput {
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage: number;
  condition: string;
  zip_code: string;
}

interface ValuationResult {
  estimatedValue: number;
  confidenceScore: number;
  priceRange: {
    low: number;
    high: number;
  };
  marketIntelligence: {
    medianPrice: number;
    averagePrice: number;
    sampleSize: number;
    inventoryLevel: string;
    demandIndicator: number;
  };
  adjustments: Array<{
    factor: string;
    amount: number;
    description: string;
  }>;
  methodology: string;
  dataQuality: {
    exactMatches: number;
    similarVehicles: number;
    priceReliability: number;
    recencyScore: number;
  };
}

export class EnhancedValuationEngine {
  
  async getMarketListings(input: EnhancedValuationInput): Promise<MarketListing[]> {
    const { data, error } = await supabase
      .from('enhanced_market_listings')
      .select('*')
      .eq('make', input.make)
      .eq('model', input.model)
      .eq('year', input.year)
      .eq('listing_status', 'active')
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
      .order('price', { ascending: true });

    if (error) {
      console.error('Error fetching market listings:', error);
      return [];
    }

    return data || [];
  }

  async calculateMarketIntelligence(input: EnhancedValuationInput): Promise<any> {
    try {
      const { data, error } = await supabase.rpc('calculate_market_intelligence', {
        p_make: input.make,
        p_model: input.model,
        p_year: input.year,
        p_zip_code: input.zip_code,
        p_radius_miles: 100
      });

      if (error) {
        console.error('Error calculating market intelligence:', error);
        return null;
      }

      return data[0] || null;
    } catch (error) {
      console.error('Error in market intelligence calculation:', error);
      return null;
    }
  }

  filterRelevantListings(listings: MarketListing[], input: EnhancedValuationInput): MarketListing[] {
    return listings.filter(listing => {
      // Filter by mileage similarity (within 30% range)
      const mileageDiff = Math.abs((listing.mileage || 0) - input.mileage);
      const mileageThreshold = input.mileage * 0.3;
      
      // Filter by price reasonableness (remove extreme outliers)
      const medianPrice = this.calculateMedianPrice(listings);
      const priceDeviation = Math.abs(listing.price - medianPrice) / medianPrice;
      
      return mileageDiff <= mileageThreshold && priceDeviation <= 0.5;
    });
  }

  calculateMedianPrice(listings: MarketListing[]): number {
    if (listings.length === 0) return 0;
    
    const prices = listings.map(l => l.price).sort((a, b) => a - b);
    const mid = Math.floor(prices.length / 2);
    
    return prices.length % 2 === 0 
      ? (prices[mid - 1] + prices[mid]) / 2 
      : prices[mid];
  }

  calculateMileageAdjustment(targetMileage: number, marketMileage: number, basePrice: number): number {
    const mileageDiff = targetMileage - marketMileage;
    const pricePerMile = 0.15; // Industry standard depreciation per mile
    return -Math.round(mileageDiff * pricePerMile);
  }

  calculateConditionAdjustment(condition: string, basePrice: number): number {
    const conditionMultipliers = {
      'excellent': 1.05,
      'very-good': 1.02,
      'good': 1.00,
      'fair': 0.92,
      'poor': 0.80
    };
    
    const multiplier = conditionMultipliers[condition as keyof typeof conditionMultipliers] || 1.00;
    return Math.round(basePrice * (multiplier - 1));
  }

  calculateAgeAdjustment(days_on_market: number, basePrice: number): number {
    // Vehicles on market longer may be priced higher initially but have less demand
    if (days_on_market > 90) return -Math.round(basePrice * 0.03);
    if (days_on_market > 60) return -Math.round(basePrice * 0.02);
    if (days_on_market > 30) return -Math.round(basePrice * 0.01);
    return 0;
  }

  async performValuation(input: EnhancedValuationInput): Promise<ValuationResult> {
    try {
      // Get market listings and intelligence
      const marketListings = await this.getMarketListings(input);
      const marketIntelligence = await this.calculateMarketIntelligence(input);
      
      // Filter for most relevant listings
      const relevantListings = this.filterRelevantListings(marketListings, input);
      
      console.log('🚗 Enhanced Valuation Engine:', {
        totalListings: marketListings.length,
        relevantListings: relevantListings.length,
        marketIntelligence: marketIntelligence
      });

      let estimatedValue: number;
      let confidenceScore: number;
      let methodology: string;
      let adjustments: Array<{factor: string; amount: number; description: string}> = [];

      if (relevantListings.length >= 3) {
        // HIGH CONFIDENCE: Use real market data
        const medianPrice = this.calculateMedianPrice(relevantListings);
        const avgMileage = relevantListings.reduce((sum, l) => sum + (l.mileage || 0), 0) / relevantListings.length;
        
        // Calculate adjustments based on real market differences
        const mileageAdj = this.calculateMileageAdjustment(input.mileage, avgMileage, medianPrice);
        const conditionAdj = this.calculateConditionAdjustment(input.condition, medianPrice);
        const marketDemandAdj = marketIntelligence?.demand_indicator 
          ? Math.round(medianPrice * (marketIntelligence.demand_indicator - 0.5) * 0.05)
          : 0;

        adjustments = [
          {
            factor: "Market Base Price",
            amount: Math.round(medianPrice),
            description: `Median of ${relevantListings.length} comparable listings`
          },
          {
            factor: "Mileage Adjustment",
            amount: mileageAdj,
            description: `${input.mileage.toLocaleString()} mi vs. market avg ${Math.round(avgMileage).toLocaleString()} mi`
          },
          {
            factor: "Condition Adjustment", 
            amount: conditionAdj,
            description: `${input.condition} condition vs. market average`
          },
          {
            factor: "Market Demand",
            amount: marketDemandAdj,
            description: `Regional demand factor for ${input.zip_code}`
          }
        ];

        estimatedValue = medianPrice + mileageAdj + conditionAdj + marketDemandAdj;
        confidenceScore = Math.min(95, 75 + (relevantListings.length * 3)); // Cap at 95%
        methodology = `Market-driven valuation using ${relevantListings.length} comparable active listings with statistical price analysis and mileage/condition adjustments.`;

      } else if (marketListings.length >= 1) {
        // MEDIUM CONFIDENCE: Limited market data with broader analysis
        const avgPrice = marketListings.reduce((sum, l) => sum + l.price, 0) / marketListings.length;
        const mileageAdj = this.calculateMileageAdjustment(input.mileage, 50000, avgPrice); // Use avg mileage
        const conditionAdj = this.calculateConditionAdjustment(input.condition, avgPrice);

        adjustments = [
          {
            factor: "Market Reference Price",
            amount: Math.round(avgPrice),
            description: `Average of ${marketListings.length} broader market listings`
          },
          {
            factor: "Mileage Adjustment",
            amount: mileageAdj,
            description: `${input.mileage.toLocaleString()} mi vs. estimated average`
          },
          {
            factor: "Condition Adjustment",
            amount: conditionAdj,
            description: `${input.condition} condition assessment`
          }
        ];

        estimatedValue = avgPrice + mileageAdj + conditionAdj;
        confidenceScore = Math.min(75, 50 + (marketListings.length * 5));
        methodology = `Hybrid valuation using ${marketListings.length} market reference points with industry-standard depreciation models.`;

      } else {
        // LOW CONFIDENCE: Fallback to synthetic model
        const msrpEstimate = await this.estimateFromMSRP(input);
        const depreciationAdj = this.calculateDepreciationAdjustment(input.year, msrpEstimate);
        const mileageAdj = this.calculateMileageAdjustment(input.mileage, 15000 * (2024 - input.year), msrpEstimate);
        const conditionAdj = this.calculateConditionAdjustment(input.condition, msrpEstimate);

        adjustments = [
          {
            factor: "MSRP Base (Estimated)",
            amount: msrpEstimate,
            description: `Estimated original MSRP for ${input.year} ${input.make} ${input.model}`
          },
          {
            factor: "Age Depreciation",
            amount: depreciationAdj,
            description: `${2024 - input.year} years of standard depreciation`
          },
          {
            factor: "Mileage Adjustment",
            amount: mileageAdj,
            description: `${input.mileage.toLocaleString()} mi vs. average for age`
          },
          {
            factor: "Condition Adjustment",
            amount: conditionAdj,
            description: `${input.condition} condition factor`
          }
        ];

        estimatedValue = msrpEstimate + depreciationAdj + mileageAdj + conditionAdj;
        confidenceScore = 45; // Low confidence for synthetic model
        methodology = `Synthetic valuation using MSRP baseline and industry depreciation curves. Limited market data available.`;
      }

      // Ensure reasonable bounds
      estimatedValue = Math.max(1000, Math.round(estimatedValue));

      return {
        estimatedValue,
        confidenceScore,
        priceRange: {
          low: Math.round(estimatedValue * 0.9),
          high: Math.round(estimatedValue * 1.1)
        },
        marketIntelligence: marketIntelligence || {
          medianPrice: estimatedValue,
          averagePrice: estimatedValue,
          sampleSize: relevantListings.length,
          inventoryLevel: 'unknown',
          demandIndicator: 0.5
        },
        adjustments,
        methodology,
        dataQuality: {
          exactMatches: relevantListings.length,
          similarVehicles: marketListings.length,
          priceReliability: relevantListings.length >= 3 ? 0.9 : relevantListings.length >= 1 ? 0.6 : 0.3,
          recencyScore: marketListings.filter(l => l.days_on_market && l.days_on_market <= 30).length / Math.max(1, marketListings.length)
        }
      };

    } catch (error) {
      console.error('Enhanced Valuation Engine Error:', error);
      throw new Error('Failed to perform enhanced valuation');
    }
  }

  private async estimateFromMSRP(input: EnhancedValuationInput): Promise<number> {
    // Simplified MSRP estimation - in production, this would use a comprehensive database
    const baseEstimates: Record<string, Record<string, number>> = {
      'Ford': {
        'F-150': 35000,
        'Mustang': 32000,
        'Explorer': 33000,
        'Escape': 26000
      },
      'Toyota': {
        'Camry': 25000,
        'Prius': 28000,
        'RAV4': 28000,
        'Highlander': 35000
      },
      'Honda': {
        'Civic': 23000,
        'Accord': 25000,
        'CR-V': 26000,
        'Pilot': 33000
      }
    };

    const makeEstimates = baseEstimates[input.make];
    if (makeEstimates && makeEstimates[input.model]) {
      return makeEstimates[input.model];
    }

    // Generic fallback based on vehicle type
    return 30000; // Default estimate
  }

  private calculateDepreciationAdjustment(year: number, msrp: number): number {
    const age = 2024 - year;
    const yearlyDepreciation = 0.15; // 15% per year standard
    const totalDepreciation = Math.min(0.7, age * yearlyDepreciation); // Cap at 70%
    return -Math.round(msrp * totalDepreciation);
  }
}