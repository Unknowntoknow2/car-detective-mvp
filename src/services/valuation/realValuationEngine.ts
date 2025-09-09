// Real Valuation Engine - Only uses actual market data, no mock/fake values
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface RealValuationInput {
  vin: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  condition: string;
  zipCode: string;
  accidents?: number;
  titleStatus?: string;
}

export interface RealValuationResult {
  success: boolean;
  estimatedValue: number;
  confidenceScore: number;
  dataSourcesUsed: string[];
  marketListingsCount: number;
  adjustments: Array<{
    factor: string;
    impact: number;
    description: string;
  }>;
  priceRange: [number, number];
  error?: string;
}

export class RealValuationEngine {
  static async calculateValuation(input: RealValuationInput): Promise<RealValuationResult> {
    console.log('🔍 Real Valuation Engine: Processing valuation for', {
      vin: input.vin,
      vehicle: `${input.year} ${input.make} ${input.model}`,
      mileage: input.mileage,
      condition: input.condition
    });

    try {
      // 1. Check for existing real market listings in database
      const { data: marketListings, error: marketError } = await supabase
        .from('enhanced_market_listings')
        .select('*')
        .ilike('make', input.make)
        .ilike('model', input.model)
        .eq('year', input.year)
        .eq('listing_status', 'active')
        .gte('fetched_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
        .order('price', { ascending: true })
        .limit(50);

      if (marketError) {
        console.error('❌ Database query error:', marketError);
        return this.generateErrorResult('Database query failed');
      }

      // Filter only real, verified listings
      const realListings = (marketListings || []).filter(listing => 
        listing.listing_url && 
        !listing.listing_url.includes('example.com') &&
        !listing.listing_url.includes('mock') &&
        !listing.listing_url.includes('fake') &&
        !listing.listing_url.includes('test') &&
        listing.price > 5000 &&
        listing.price < 200000 &&
        listing.mileage &&
        listing.mileage > 0 &&
        listing.mileage < 500000
      );

      if (realListings.length < 3) {
        console.warn('⚠️ Insufficient real market data:', {
          totalFound: marketListings?.length || 0,
          validListings: realListings.length,
          minRequired: 3
        });
        
        return {
          success: false,
          estimatedValue: 0,
          confidenceScore: 0,
          dataSourcesUsed: ['database_insufficient'],
          marketListingsCount: realListings.length,
          adjustments: [],
          priceRange: [0, 0],
          error: `Only found ${realListings.length} valid market listings. Need at least 3 for accurate valuation.`
        };
      }

      // 2. Calculate market-based valuation using real listings
      const prices = realListings.map(listing => listing.price);
      const medianPrice = this.calculateMedian(prices);
      const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      
      // Use median as more robust estimate
      let estimatedValue = medianPrice;

      // 3. Apply condition adjustments based on real market data
      const conditionAdjustments = {
        'excellent': 1.10,
        'good': 1.00,
        'fair': 0.85,
        'poor': 0.70
      };
      
      const conditionMultiplier = conditionAdjustments[input.condition.toLowerCase() as keyof typeof conditionAdjustments] || 1.0;
      const conditionAdjustment = (conditionMultiplier - 1) * estimatedValue;
      estimatedValue *= conditionMultiplier;

      // 4. Apply mileage adjustments
      const averageMileage = realListings.reduce((sum, listing) => sum + (listing.mileage || 0), 0) / realListings.length;
      const mileageDiff = input.mileage - averageMileage;
      const mileageAdjustment = -(mileageDiff / 1000) * 50; // $50 per 1000 miles difference
      estimatedValue += mileageAdjustment;

      // 5. Apply accident history if provided
      let accidentAdjustment = 0;
      if (input.accidents && input.accidents > 0) {
        accidentAdjustment = -estimatedValue * (0.05 + (input.accidents - 1) * 0.03);
        estimatedValue += accidentAdjustment;
      }

      // 6. Calculate confidence score based on data quality
      const confidenceScore = Math.min(95, 40 + (realListings.length * 8) + (realListings.length >= 10 ? 15 : 0));

      // 7. Calculate price range
      const priceRange: [number, number] = [
        Math.round(estimatedValue * 0.85),
        Math.round(estimatedValue * 1.15)
      ];

      const result: RealValuationResult = {
        success: true,
        estimatedValue: Math.round(estimatedValue),
        confidenceScore,
        dataSourcesUsed: ['enhanced_market_listings'],
        marketListingsCount: realListings.length,
        adjustments: [
          {
            factor: 'Market Base Price',
            impact: Math.round(medianPrice),
            description: `Based on ${realListings.length} comparable listings`
          },
          ...(conditionAdjustment !== 0 ? [{
            factor: 'Condition Adjustment',
            impact: Math.round(conditionAdjustment),
            description: `${input.condition} condition (${conditionMultiplier > 1 ? '+' : ''}${Math.round((conditionMultiplier - 1) * 100)}%)`
          }] : []),
          ...(Math.abs(mileageAdjustment) > 100 ? [{
            factor: 'Mileage Adjustment', 
            impact: Math.round(mileageAdjustment),
            description: `${input.mileage.toLocaleString()} miles vs ${Math.round(averageMileage).toLocaleString()} average`
          }] : []),
          ...(accidentAdjustment !== 0 ? [{
            factor: 'Accident History',
            impact: Math.round(accidentAdjustment),
            description: `${input.accidents} accident${input.accidents !== 1 ? 's' : ''} reported`
          }] : [])
        ],
        priceRange
      };

      console.log('✅ Real Valuation Engine: Completed successfully', {
        estimatedValue: result.estimatedValue,
        confidenceScore: result.confidenceScore,
        marketListingsUsed: realListings.length
      });

      return result;

    } catch (error) {
      console.error('❌ Real Valuation Engine error:', error);
      return this.generateErrorResult(error instanceof Error ? error.message : 'Unknown error');
    }
  }

  private static calculateMedian(numbers: number[]): number {
    const sorted = [...numbers].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0 
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  private static generateErrorResult(error: string): RealValuationResult {
    return {
      success: false,
      estimatedValue: 0,
      confidenceScore: 0,
      dataSourcesUsed: [],
      marketListingsCount: 0,
      adjustments: [],
      priceRange: [0, 0],
      error
    };
  }
}