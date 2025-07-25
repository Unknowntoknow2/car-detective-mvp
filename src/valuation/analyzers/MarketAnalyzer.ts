/**
 * Market Analyzer - Advanced market condition analysis
 */

import { MarketAnalysisInput, MarketAnalysisResult, MarketListing } from '../types/core';

export class MarketAnalyzer {
  analyze(input: MarketAnalysisInput): MarketAnalysisResult {
    const localAnalysis = this.analyzeLocalMarket(input.localMarket);
    const seasonalAnalysis = this.analyzeSeasonality(input.seasonality);
    const demandAnalysis = this.analyzeDemand(input.demand);
    const competitiveAnalysis = this.analyzeCompetitivePosition(
      input.localMarket, 
      input.nationalMarket
    );

    const adjustmentFactor = this.calculateOverallAdjustment(
      localAnalysis,
      seasonalAnalysis,
      demandAnalysis,
      competitiveAnalysis
    );

    const confidence = this.calculateConfidence(input);
    const insights = this.generateInsights(
      localAnalysis,
      seasonalAnalysis,
      demandAnalysis,
      competitiveAnalysis
    );

    return {
      adjustmentFactor,
      confidence,
      insights,
      competitivePosition: competitiveAnalysis.position
    };
  }

  private analyzeLocalMarket(listings: MarketListing[]): LocalMarketAnalysis {
    if (listings.length === 0) {
      return {
        averagePrice: 0,
        priceRange: [0, 0],
        listingDensity: 'very_low',
        marketActivity: 'inactive',
        priceStability: 'unknown',
        dealerVsPrivate: { dealer: 0, private: 0 },
        adjustmentFactor: 1.0
      };
    }

    const prices = listings.map(l => l.price).sort((a, b) => a - b);
    const averagePrice = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const medianPrice = prices[Math.floor(prices.length / 2)];
    
    const priceRange: [number, number] = [prices[0], prices[prices.length - 1]];
    const priceVariation = (priceRange[1] - priceRange[0]) / averagePrice;

    // Categorize listing density
    const listingDensity = this.categorizeListingDensity(listings.length);
    
    // Analyze market activity
    const recentListings = this.getRecentListings(listings, 30); // Last 30 days
    const marketActivity = this.categorizeMarketActivity(recentListings.length, listings.length);
    
    // Price stability analysis
    const priceStability = this.analyzePriceStability(priceVariation);
    
    // Dealer vs private ratio
    const dealerListings = listings.filter(l => l.dealer).length;
    const privateListings = listings.length - dealerListings;
    const dealerVsPrivate = {
      dealer: dealerListings / listings.length,
      private: privateListings / listings.length
    };

    // Calculate local market adjustment
    let adjustmentFactor = 1.0;
    
    // High dealer presence typically means higher prices
    if (dealerVsPrivate.dealer > 0.7) {
      adjustmentFactor += 0.05;
    }
    
    // Market activity impact
    if (marketActivity === 'very_active') {
      adjustmentFactor += 0.03;
    } else if (marketActivity === 'inactive') {
      adjustmentFactor -= 0.05;
    }
    
    // Price stability impact
    if (priceStability === 'stable') {
      adjustmentFactor += 0.02;
    } else if (priceStability === 'volatile') {
      adjustmentFactor -= 0.03;
    }

    return {
      averagePrice,
      priceRange,
      listingDensity,
      marketActivity,
      priceStability,
      dealerVsPrivate,
      adjustmentFactor: Math.max(0.9, Math.min(1.15, adjustmentFactor))
    };
  }

  private analyzeSeasonality(trends: any[]): SeasonalAnalysis {
    const currentMonth = new Date().getMonth() + 1;
    const currentTrend = trends.find(t => t.month === currentMonth);
    
    if (!currentTrend) {
      return {
        currentMonthMultiplier: 1.0,
        seasonalTrend: 'neutral',
        adjustmentFactor: 1.0,
        recommendation: 'No seasonal data available'
      };
    }

    const multiplier = currentTrend.multiplier;
    let seasonalTrend: 'peak' | 'valley' | 'rising' | 'falling' | 'neutral';
    
    if (multiplier > 1.05) {
      seasonalTrend = 'peak';
    } else if (multiplier < 0.95) {
      seasonalTrend = 'valley';
    } else {
      seasonalTrend = 'neutral';
    }

    // Look at trend direction
    const nextMonth = trends.find(t => t.month === (currentMonth % 12) + 1);
    if (nextMonth && Math.abs(nextMonth.multiplier - multiplier) > 0.02) {
      seasonalTrend = nextMonth.multiplier > multiplier ? 'rising' : 'falling';
    }

    const adjustmentFactor = Math.max(0.95, Math.min(1.08, multiplier));
    
    const recommendation = this.getSeasonalRecommendation(seasonalTrend, currentMonth);

    return {
      currentMonthMultiplier: multiplier,
      seasonalTrend,
      adjustmentFactor,
      recommendation
    };
  }

  private analyzeDemand(demandIndex: number): DemandAnalysis {
    let demandLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
    let adjustmentFactor = 1.0;
    
    if (demandIndex >= 85) {
      demandLevel = 'very_high';
      adjustmentFactor = 1.08;
    } else if (demandIndex >= 70) {
      demandLevel = 'high';
      adjustmentFactor = 1.05;
    } else if (demandIndex >= 50) {
      demandLevel = 'moderate';
      adjustmentFactor = 1.0;
    } else if (demandIndex >= 30) {
      demandLevel = 'low';
      adjustmentFactor = 0.97;
    } else {
      demandLevel = 'very_low';
      adjustmentFactor = 0.93;
    }

    const impact = this.getDemandImpactDescription(demandLevel);

    return {
      demandLevel,
      demandIndex,
      adjustmentFactor,
      impact
    };
  }

  private analyzeCompetitivePosition(
    localListings: MarketListing[], 
    nationalAverage: number
  ): CompetitiveAnalysis {
    if (localListings.length === 0) {
      return {
        position: 'unknown',
        localVsNational: 0,
        adjustmentFactor: 1.0,
        competitionLevel: 'unknown'
      };
    }

    const localAverage = localListings.reduce((sum, l) => sum + l.price, 0) / localListings.length;
    const localVsNational = (localAverage - nationalAverage) / nationalAverage;
    
    let position: 'below_market' | 'at_market' | 'above_market' | 'unknown';
    if (Math.abs(localVsNational) < 0.05) {
      position = 'at_market';
    } else if (localVsNational < 0) {
      position = 'below_market';
    } else {
      position = 'above_market';
    }

    // Competition level based on listing density
    const competitionLevel = this.assessCompetitionLevel(localListings.length);
    
    // Adjustment based on local vs national pricing
    let adjustmentFactor = 1.0 + localVsNational * 0.5; // 50% of the difference
    adjustmentFactor = Math.max(0.92, Math.min(1.12, adjustmentFactor));

    return {
      position,
      localVsNational,
      adjustmentFactor,
      competitionLevel
    };
  }

  private calculateOverallAdjustment(
    local: LocalMarketAnalysis,
    seasonal: SeasonalAnalysis,
    demand: DemandAnalysis,
    competitive: CompetitiveAnalysis
  ): number {
    // Weighted combination of all factors
    const weights = {
      local: 0.4,
      seasonal: 0.2,
      demand: 0.25,
      competitive: 0.15
    };

    const weightedAdjustment = 
      (local.adjustmentFactor * weights.local) +
      (seasonal.adjustmentFactor * weights.seasonal) +
      (demand.adjustmentFactor * weights.demand) +
      (competitive.adjustmentFactor * weights.competitive);

    return Math.max(0.85, Math.min(1.20, weightedAdjustment));
  }

  private calculateConfidence(input: MarketAnalysisInput): number {
    let confidence = 0.7; // Base confidence

    // More listings = higher confidence
    if (input.localMarket.length > 15) {
      confidence += 0.15;
    } else if (input.localMarket.length > 5) {
      confidence += 0.1;
    } else if (input.localMarket.length < 3) {
      confidence -= 0.2;
    }

    // Seasonal data availability
    if (input.seasonality.length >= 12) {
      confidence += 0.1;
    }

    // Recent listings indicate active market
    const recentListings = this.getRecentListings(input.localMarket, 14);
    if (recentListings.length > input.localMarket.length * 0.3) {
      confidence += 0.05;
    }

    return Math.max(0.4, Math.min(0.95, confidence));
  }

  private generateInsights(
    local: LocalMarketAnalysis,
    seasonal: SeasonalAnalysis,
    demand: DemandAnalysis,
    competitive: CompetitiveAnalysis
  ): string[] {
    const insights: string[] = [];

    // Local market insights
    insights.push(`Local market has ${local.listingDensity} inventory with ${local.marketActivity} activity`);
    
    if (local.dealerVsPrivate.dealer > 0.6) {
      insights.push('Dealer-heavy market typically commands higher prices');
    } else if (local.dealerVsPrivate.private > 0.6) {
      insights.push('Private seller market may offer better value opportunities');
    }

    // Seasonal insights
    if (seasonal.seasonalTrend !== 'neutral') {
      insights.push(`Market is in ${seasonal.seasonalTrend} seasonal trend`);
    }
    insights.push(seasonal.recommendation);

    // Demand insights
    insights.push(`Demand level is ${demand.demandLevel} (${demand.demandIndex}/100)`);
    insights.push(demand.impact);

    // Competitive insights
    if (competitive.position !== 'unknown') {
      const direction = competitive.localVsNational > 0 ? 'above' : 'below';
      const percentage = Math.abs(competitive.localVsNational * 100).toFixed(1);
      insights.push(`Local market prices are ${percentage}% ${direction} national average`);
    }

    return insights;
  }

  // Helper methods
  private categorizeListingDensity(count: number): 'very_low' | 'low' | 'moderate' | 'high' | 'very_high' {
    if (count < 3) return 'very_low';
    if (count < 8) return 'low';
    if (count < 15) return 'moderate';
    if (count < 25) return 'high';
    return 'very_high';
  }

  private categorizeMarketActivity(recentCount: number, totalCount: number): 'inactive' | 'slow' | 'moderate' | 'active' | 'very_active' {
    const ratio = totalCount > 0 ? recentCount / totalCount : 0;
    if (ratio < 0.1) return 'inactive';
    if (ratio < 0.25) return 'slow';
    if (ratio < 0.5) return 'moderate';
    if (ratio < 0.75) return 'active';
    return 'very_active';
  }

  private analyzePriceStability(variation: number): 'stable' | 'moderate' | 'volatile' {
    if (variation < 0.15) return 'stable';
    if (variation < 0.35) return 'moderate';
    return 'volatile';
  }

  private getRecentListings(listings: MarketListing[], days: number): MarketListing[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return listings.filter(listing => {
      const listingDate = new Date(listing.listedDate);
      return listingDate > cutoffDate;
    });
  }

  private getSeasonalRecommendation(trend: string, month: number): string {
    const seasonMap: Record<string, string> = {
      'peak': 'Peak selling season - good time for premium pricing',
      'valley': 'Slower season - may need competitive pricing',
      'rising': 'Market strengthening - prices trending up',
      'falling': 'Market softening - prices trending down',
      'neutral': 'Stable seasonal conditions'
    };
    return seasonMap[trend] || 'No specific seasonal recommendation';
  }

  private getDemandImpactDescription(level: string): string {
    const impactMap: Record<string, string> = {
      'very_high': 'Strong buyer demand supports premium pricing',
      'high': 'Good demand allows for competitive pricing',
      'moderate': 'Balanced market conditions',
      'low': 'Weak demand may require aggressive pricing',
      'very_low': 'Very limited demand - consider market timing'
    };
    return impactMap[level] || 'Unknown demand impact';
  }

  private assessCompetitionLevel(listingCount: number): 'low' | 'moderate' | 'high' | 'unknown' {
    if (listingCount < 5) return 'low';
    if (listingCount < 15) return 'moderate';
    if (listingCount >= 15) return 'high';
    return 'unknown';
  }
}

// Supporting interfaces
interface LocalMarketAnalysis {
  averagePrice: number;
  priceRange: [number, number];
  listingDensity: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  marketActivity: 'inactive' | 'slow' | 'moderate' | 'active' | 'very_active';
  priceStability: 'stable' | 'moderate' | 'volatile' | 'unknown';
  dealerVsPrivate: { dealer: number; private: number };
  adjustmentFactor: number;
}

interface SeasonalAnalysis {
  currentMonthMultiplier: number;
  seasonalTrend: 'peak' | 'valley' | 'rising' | 'falling' | 'neutral';
  adjustmentFactor: number;
  recommendation: string;
}

interface DemandAnalysis {
  demandLevel: 'very_low' | 'low' | 'moderate' | 'high' | 'very_high';
  demandIndex: number;
  adjustmentFactor: number;
  impact: string;
}

interface CompetitiveAnalysis {
  position: 'below_market' | 'at_market' | 'above_market' | 'unknown';
  localVsNational: number;
  adjustmentFactor: number;
  competitionLevel: 'low' | 'moderate' | 'high' | 'unknown';
}