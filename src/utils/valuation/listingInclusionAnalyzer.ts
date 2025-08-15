// Listing Quality & Inclusion Analyzer
import { MarketListing } from '@/types/marketListing';

export interface InclusionResult {
  included: boolean;
  qualityScore: number;
  exclusionReason?: string;
  trustTier: 'tier1' | 'tier2' | 'tier3';
  confidenceAdjustment: number;
}

export interface AnalysisMetrics {
  totalListings: number;
  includedListings: number;
  excludedByQuality: number;
  excludedByRadius: number;
  excludedByOutlier: number;
  excludedByStale: number;
  averageQualityScore: number;
}

export class ListingInclusionAnalyzer {
  
  private static readonly QUALITY_THRESHOLD = 60;
  private static readonly RADIUS_MILES = 100;
  private static readonly OUTLIER_THRESHOLD = 2.5; // Standard deviations
  private static readonly STALE_DAYS = 30;

  /**
   * Analyze all listings for inclusion in comp set
   */
  static analyzeListings(
    listings: MarketListing[],
    targetZip?: string,
    subjectPrice?: number
  ): { results: InclusionResult[]; metrics: AnalysisMetrics } {
    
    if (!listings.length) {
      return {
        results: [],
        metrics: {
          totalListings: 0,
          includedListings: 0,
          excludedByQuality: 0,
          excludedByRadius: 0,
          excludedByOutlier: 0,
          excludedByStale: 0,
          averageQualityScore: 0
        }
      };
    }

    const results: InclusionResult[] = [];
    const prices = listings.map(l => l.price).filter(p => p && p > 0);
    const priceStats = this.calculatePriceStats(prices);
    
    let excludedByQuality = 0;
    let excludedByRadius = 0; 
    let excludedByOutlier = 0;
    let excludedByStale = 0;
    let totalQualityScore = 0;

    for (const listing of listings) {
      const analysis = this.analyzeSingleListing(
        listing,
        targetZip,
        priceStats,
        subjectPrice
      );
      
      results.push(analysis);
      totalQualityScore += analysis.qualityScore;
      
      if (!analysis.included && analysis.exclusionReason) {
        if (analysis.exclusionReason.includes('quality')) excludedByQuality++;
        else if (analysis.exclusionReason.includes('radius')) excludedByRadius++;
        else if (analysis.exclusionReason.includes('outlier')) excludedByOutlier++;
        else if (analysis.exclusionReason.includes('stale')) excludedByStale++;
      }
    }

    const includedCount = results.filter(r => r.included).length;

    return {
      results,
      metrics: {
        totalListings: listings.length,
        includedListings: includedCount,
        excludedByQuality,
        excludedByRadius,
        excludedByOutlier,
        excludedByStale,
        averageQualityScore: totalQualityScore / listings.length
      }
    };
  }

  /**
   * Analyze single listing for inclusion
   */
  private static analyzeSingleListing(
    listing: MarketListing,
    targetZip?: string,
    priceStats?: { mean: number; stdDev: number; median: number },
    subjectPrice?: number
  ): InclusionResult {
    
    // Calculate quality score
    const qualityScore = this.calculateQualityScore(listing);
    const trustTier = this.determineTrustTier(listing.source);
    
    // Check quality threshold
    if (qualityScore < this.QUALITY_THRESHOLD) {
      return {
        included: false,
        qualityScore,
        exclusionReason: `Low quality score (${qualityScore}/100)`,
        trustTier,
        confidenceAdjustment: -20
      };
    }

    // Check radius
    if (targetZip && (listing.zipCode || listing.zip)) {
      const distance = this.calculateDistance(listing.zipCode || listing.zip!, targetZip);
      if (distance > this.RADIUS_MILES) {
        return {
          included: false,
          qualityScore,
          exclusionReason: `Out of radius (${distance} miles > ${this.RADIUS_MILES})`,
          trustTier,
          confidenceAdjustment: -15
        };
      }
    }

    // Check for price outliers
    if (priceStats && listing.price) {
      const zScore = Math.abs(listing.price - priceStats.mean) / priceStats.stdDev;
      if (zScore > this.OUTLIER_THRESHOLD) {
        return {
          included: false,
          qualityScore,
          exclusionReason: `Price outlier (${zScore.toFixed(1)} standard deviations)`,
          trustTier,
          confidenceAdjustment: -10
        };
      }
    }

    // Check for stale listings
    if (listing.listingDate) {
      const daysSinceListed = this.getDaysSince(listing.listingDate);
      if (daysSinceListed > this.STALE_DAYS) {
        return {
          included: false,
          qualityScore,
          exclusionReason: `Stale listing (${daysSinceListed} days old)`,
          trustTier,
          confidenceAdjustment: -5
        };
      }
    }

    // Check for missing required fields
    const missingFields = this.getMissingRequiredFields(listing);
    if (missingFields.length > 0) {
      return {
        included: false,
        qualityScore,
        exclusionReason: `Missing required fields: ${missingFields.join(', ')}`,
        trustTier,
        confidenceAdjustment: -15
      };
    }

    // Listing passed all checks
    const confidenceAdjustment = this.calculateConfidenceAdjustment(
      qualityScore,
      trustTier,
      listing
    );

    return {
      included: true,
      qualityScore,
      trustTier,
      confidenceAdjustment
    };
  }

  /**
   * Calculate comprehensive quality score (0-100)
   */
  private static calculateQualityScore(listing: MarketListing): number {
    let score = 0;
    
    // Price validity (20 points)
    if (listing.price && listing.price > 1000 && listing.price < 200000) {
      score += 20;
    }
    
    // Mileage present (15 points)
    if (listing.mileage && listing.mileage > 0) {
      score += 15;
    }
    
    // Photo quality (15 points)
    const photoCount = listing.photos?.length || 0;
    if (photoCount >= 8) score += 15;
    else if (photoCount >= 4) score += 10;
    else if (photoCount >= 1) score += 5;
    
    // VIN present (15 points)
    if (listing.vin && listing.vin.length === 17) {
      score += 15;
    }
    
    // Vehicle details (15 points)
    if (listing.make && listing.model && listing.year) {
      score += 15;
    }
    
    // Location data (10 points)
    if (listing.zipCode || listing.zip || (listing.location && listing.location.length > 3)) {
      score += 10;
    }
    
    // Dealer information (10 points)
    if (listing.dealerName || listing.dealer) {
      score += 10;
    }
    
    // Bonus points for additional quality indicators
    if (listing.features && listing.features.length > 0) score += 2;
    if (listing.titleStatus) score += 1;
    
    return Math.min(score, 100);
  }

  /**
   * Determine source trust tier
   */
  private static determineTrustTier(source: string): 'tier1' | 'tier2' | 'tier3' {
    const sourceLower = source.toLowerCase();
    
    // Tier 1: Major national dealers with verified data
    const tier1Sources = [
      'carmax', 'carvana', 'vroom', 'shift', 'autonation',
      'carfax_dealer', 'certified_dealer'
    ];
    
    // Tier 2: Established platforms with good data quality
    const tier2Sources = [
      'autotrader', 'cars.com', 'edmunds', 'truecar',
      'carfax', 'manheim', 'adesa'
    ];
    
    if (tier1Sources.some(t1 => sourceLower.includes(t1))) {
      return 'tier1';
    }
    
    if (tier2Sources.some(t2 => sourceLower.includes(t2))) {
      return 'tier2';
    }
    
    return 'tier3';
  }

  /**
   * Calculate confidence adjustment based on listing quality
   */
  private static calculateConfidenceAdjustment(
    qualityScore: number,
    trustTier: 'tier1' | 'tier2' | 'tier3',
    listing: MarketListing
  ): number {
    let adjustment = 0;
    
    // Base adjustment from quality score
    if (qualityScore >= 90) adjustment += 10;
    else if (qualityScore >= 80) adjustment += 5;
    else if (qualityScore >= 70) adjustment += 2;
    
    // Trust tier adjustment
    if (trustTier === 'tier1') adjustment += 8;
    else if (trustTier === 'tier2') adjustment += 4;
    
    // VIN match bonus
    if (listing.vin && listing.vin.length === 17) {
      adjustment += 5;
    }
    
    // Recent listing bonus
    if (listing.listingDate) {
      const daysSince = this.getDaysSince(listing.listingDate);
      if (daysSince <= 7) adjustment += 3;
      else if (daysSince <= 14) adjustment += 1;
    }
    
    return Math.min(adjustment, 20);
  }

  /**
   * Calculate price statistics
   */
  private static calculatePriceStats(prices: number[]): { mean: number; stdDev: number; median: number } {
    if (prices.length === 0) {
      return { mean: 0, stdDev: 0, median: 0 };
    }
    
    const mean = prices.reduce((sum, p) => sum + p, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - mean, 2), 0) / prices.length;
    const stdDev = Math.sqrt(variance);
    
    const sortedPrices = [...prices].sort((a, b) => a - b);
    const median = sortedPrices.length % 2 === 0
      ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
      : sortedPrices[Math.floor(sortedPrices.length / 2)];
    
    return { mean, stdDev, median };
  }

  /**
   * Calculate approximate distance between ZIP codes
   */
  private static calculateDistance(zip1: string, zip2: string): number {
    // Simplified ZIP code distance calculation
    // In production, would use actual geocoding service
    const zip1Prefix = parseInt(zip1.substring(0, 3));
    const zip2Prefix = parseInt(zip2.substring(0, 3));
    
    // Rough approximation: each ZIP prefix difference ≈ 100 miles
    return Math.abs(zip1Prefix - zip2Prefix) * 100;
  }

  /**
   * Get days since a given date
   */
  private static getDaysSince(dateString: string): number {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Get missing required fields for listing
   */
  private static getMissingRequiredFields(listing: MarketListing): string[] {
    const required = ['price', 'make', 'model', 'year'];
    const missing: string[] = [];
    
    if (!listing.price || listing.price <= 0) missing.push('price');
    if (!listing.make) missing.push('make');
    if (!listing.model) missing.push('model');
    if (!listing.year || listing.year < 1990) missing.push('year');
    
    return missing;
  }
}