// Enhanced Listing Audit Service - AIN Free Valuation System
import { MarketListing } from '@/types/marketListing';

export interface ListingAuditInput {
  url: string;
  source: string;
  vin?: string;
  captureDateTime: string;
  targetZip: string;
  targetVin?: string;
}

export interface APIOutcome {
  status: 'success' | 'fail' | 'partial';
  httpCode: number;
  errorMessage?: string;
  processingStages: ProcessingStage[];
}

export interface ProcessingStage {
  stage: 'decode' | 'normalize' | 'match' | 'quality_score' | 'comp_inclusion';
  passed: boolean;
  timestamp: string;
  failReason?: string;
}

export interface ListingAuditResult {
  // Section 1: Capture & API Outcome
  listingUrl: string;
  captureDateTime: string;
  source: string;
  apiOutcome: APIOutcome;
  
  // Section 2: Vehicle Identity Verification  
  vin?: string;
  vehicleInfo: {
    year?: number;
    make?: string;
    model?: string;
    trim?: string;
  };
  stockNumber?: string;
  matchToSubject: 'exact' | 'trim-level' | 'no-match';
  matchFailReason?: string;
  
  // Section 3: Price & Fee Audit
  advertisedPrice?: number;
  dealerFeesListed: boolean;
  feeTransparencyScore: number;
  taxesIncluded: boolean;
  priceChangeHistory?: string[];
  
  // Section 4: Mileage & Condition
  odometer?: number;
  mileagePresent: boolean;
  mileageFailReason?: string;
  dealerClaimedCondition?: string;
  photoCount: number;
  hasVinPlatePhoto: boolean;
  
  // Section 5: History (Free Data Only)
  accidentDisclosure?: string;
  ownerCount?: number;
  titleStatus?: string;
  
  // Section 6: Recalls & Inspection
  recallNotePresent: boolean;
  inspectionStatus?: 'passed' | 'failed' | 'not-provided';
  
  // Section 7: Features & Packages
  keyFeatures: string[];
  packages: string[];
  specialPaint?: string;
  
  // Section 8: Location & Radius Check
  listingZip?: string;
  distanceFromTarget?: number;
  withinRadius: boolean;
  radiusFailReason?: string;
  transferAvailable?: boolean;
  
  // Section 9: Listing Quality & Comp Inclusion
  qualityScore: number;
  systemConfidenceScore: number;
  trustTier: 'tier1' | 'tier2' | 'tier3';
  includedInCompSet: boolean;
  exclusionReason?: string;
  
  // Section 10: Fallback & Retry
  fallbackMethod?: 'none' | 'depreciation-curve' | 'broadened-search' | 'manual-match';
  retryAttempts: number;
  finalMethod: string;
}

export class ListingAuditService {
  
  /**
   * Audit a single listing through the complete pipeline
   */
  static async auditListing(
    listing: MarketListing, 
    input: ListingAuditInput,
    pipelineResults: {
      decoded: boolean;
      normalized: boolean;
      matched: boolean;
      qualityPassed: boolean;
      includedInComps: boolean;
    }
  ): Promise<ListingAuditResult> {
    
    const processingStages: ProcessingStage[] = [
      {
        stage: 'decode',
        passed: pipelineResults.decoded,
        timestamp: new Date().toISOString(),
        failReason: !pipelineResults.decoded ? 'VIN decode failed' : undefined
      },
      {
        stage: 'normalize',
        passed: pipelineResults.normalized,
        timestamp: new Date().toISOString(),
        failReason: !pipelineResults.normalized ? 'Listing normalization failed' : undefined
      },
      {
        stage: 'match',
        passed: pipelineResults.matched,
        timestamp: new Date().toISOString(),
        failReason: !pipelineResults.matched ? 'No match to subject vehicle' : undefined
      },
      {
        stage: 'quality_score',
        passed: pipelineResults.qualityPassed,
        timestamp: new Date().toISOString(),
        failReason: !pipelineResults.qualityPassed ? 'Failed quality threshold' : undefined
      },
      {
        stage: 'comp_inclusion',
        passed: pipelineResults.includedInComps,
        timestamp: new Date().toISOString(),
        failReason: !pipelineResults.includedInComps ? 'Excluded from comp set' : undefined
      }
    ];

    const apiOutcome: APIOutcome = {
      status: processingStages.every(s => s.passed) ? 'success' : 
              processingStages.some(s => s.passed) ? 'partial' : 'fail',
      httpCode: 200, // Assumed success if we have listing data
      processingStages
    };

    // Calculate quality score based on listing completeness
    const qualityScore = this.calculateListingQualityScore(listing);
    
    // Determine match level
    const matchToSubject = this.determineMatchLevel(listing, input.targetVin);
    
    // Calculate distance from target ZIP  
    const distanceFromTarget = this.calculateDistance(listing.zipCode || listing.zip, input.targetZip);
    
    // Determine exclusion reason if not included
    let exclusionReason: string | undefined;
    if (!pipelineResults.includedInComps) {
      exclusionReason = this.determineExclusionReason(listing, qualityScore, distanceFromTarget);
    }

    return {
      // Section 1
      listingUrl: listing.url || listing.link || listing.listingUrl || '',
      captureDateTime: input.captureDateTime,
      source: listing.source,
      apiOutcome,
      
      // Section 2
      vin: listing.vin,
      vehicleInfo: {
        year: listing.year,
        make: listing.make,
        model: listing.model,
        trim: listing.trim
      },
      stockNumber: listing.stock_number,
      matchToSubject,
      matchFailReason: matchToSubject === 'no-match' ? 'VIN/trim mismatch' : undefined,
      
      // Section 3
      advertisedPrice: listing.price,
      dealerFeesListed: this.hasDealerFees(listing),
      feeTransparencyScore: this.calculateFeeTransparency(listing),
      taxesIncluded: this.taxesIncluded(listing),
      priceChangeHistory: [],
      
      // Section 4
      odometer: listing.mileage,
      mileagePresent: !!listing.mileage,
      mileageFailReason: !listing.mileage ? 'Odometer missing' : undefined,
      dealerClaimedCondition: listing.condition,
      photoCount: listing.photos?.length || 0,
      hasVinPlatePhoto: this.hasVinPlatePhoto(listing),
      
      // Section 5
      accidentDisclosure: this.extractAccidentInfo(listing),
      ownerCount: undefined, // Not available in current MarketListing type
      titleStatus: listing.titleStatus,
      
      // Section 6
      recallNotePresent: this.hasRecallInfo(listing),
      inspectionStatus: this.getInspectionStatus(listing),
      
      // Section 7
      keyFeatures: listing.features || [],
      packages: [], // Not available in current MarketListing type
      specialPaint: listing.exterior_color,
      
      // Section 8
      listingZip: listing.zipCode || listing.zip,
      distanceFromTarget,
      withinRadius: (distanceFromTarget || 0) <= 100,
      radiusFailReason: (distanceFromTarget || 0) > 100 ? 'Out of radius' : undefined,
      transferAvailable: undefined, // Not available in current MarketListing type
      
      // Section 9
      qualityScore,
      systemConfidenceScore: listing.confidenceScore || listing.confidence_score || 0,
      trustTier: this.determineTrustTier(listing.source),
      includedInCompSet: pipelineResults.includedInComps,
      exclusionReason,
      
      // Section 10
      fallbackMethod: 'none', // Will be set by calling service
      retryAttempts: 0,
      finalMethod: 'market_listings'
    };
  }

  /**
   * Calculate listing quality score (0-100)
   */
  private static calculateListingQualityScore(listing: MarketListing): number {
    let score = 0;
    
    // Price present and reasonable (20 points)
    if (listing.price && listing.price > 1000 && listing.price < 200000) {
      score += 20;
    }
    
    // Mileage present (15 points)
    if (listing.mileage) {
      score += 15;
    }
    
    // Photos present (15 points)
    const photoCount = listing.photos?.length || 0;
    score += Math.min(photoCount * 3, 15);
    
    // VIN present (15 points)
    if (listing.vin && listing.vin.length === 17) {
      score += 15;
    }
    
    // Vehicle details complete (15 points)
    if (listing.make && listing.model && listing.year) {
      score += 15;
    }
    
    // Location info (10 points)
    if (listing.zipCode || listing.zip || listing.location) {
      score += 10;
    }
    
    // Dealer info (10 points)
    if (listing.dealerName || listing.dealer) {
      score += 10;
    }
    
    return Math.min(score, 100);
  }

  private static determineMatchLevel(listing: MarketListing, targetVin?: string): 'exact' | 'trim-level' | 'no-match' {
    if (listing.vin === targetVin) {
      return 'exact';
    }
    
    if (listing.make && listing.model && listing.year && listing.trim) {
      return 'trim-level';
    }
    
    return 'no-match';
  }

  private static calculateDistance(listingZip?: string, targetZip?: string): number | undefined {
    // Simplified distance calculation - in real implementation would use geocoding
    if (!listingZip || !targetZip) return undefined;
    
    // Mock distance calculation
    const zipDiff = Math.abs(parseInt(listingZip.substring(0, 3)) - parseInt(targetZip.substring(0, 3)));
    return zipDiff * 10; // Rough approximation
  }

  private static determineExclusionReason(listing: MarketListing, qualityScore: number, distance?: number): string {
    if (qualityScore < 60) {
      return 'Low quality score';
    }
    
    if (distance && distance > 100) {
      return 'Out of radius';
    }
    
    if (!listing.price || listing.price < 1000 || listing.price > 200000) {
      return 'Price/mileage outlier';
    }
    
    if (!listing.mileage) {
      return 'Missing required fields';
    }
    
    return 'Bad source tier';
  }

  private static hasDealerFees(listing: MarketListing): boolean {
    // No description field available, check for dealer fees in other fields
    return false; // Default to false as description not available
  }

  private static calculateFeeTransparency(listing: MarketListing): number {
    let score = 5; // Base score - assume moderate transparency
    
    // Without description field, use heuristics based on available data
    if (listing.dealerName || listing.dealer_name) score += 2;
    if (listing.stock_number) score += 1;
    
    return Math.min(score, 10);
  }

  private static taxesIncluded(listing: MarketListing): boolean {
    // Without description field, default to false
    return false;
  }

  private static hasVinPlatePhoto(listing: MarketListing): boolean {
    const photos = listing.photos || [];
    return photos.some((img: string) => 
      img.toLowerCase().includes('vin') || 
      img.toLowerCase().includes('plate') ||
      img.toLowerCase().includes('door')
    );
  }

  private static extractAccidentInfo(listing: MarketListing): string | undefined {
    // Without description field, check if there's any accident-related data
    // This would need to be enhanced with actual accident history integration
    return undefined;
  }

  private static hasRecallInfo(listing: MarketListing): boolean {
    // Without description field, cannot determine recall info
    return false;
  }

  private static getInspectionStatus(listing: MarketListing): 'passed' | 'failed' | 'not-provided' {
    // Check if it's a certified vehicle
    if (listing.isCpo || listing.is_cpo) {
      return 'passed';
    }
    return 'not-provided';
  }

  private static determineTrustTier(source: string): 'tier1' | 'tier2' | 'tier3' {
    const tier1Sources = ['carmax', 'carvana', 'vroom', 'cars.com'];
    const tier2Sources = ['autotrader', 'cars.com', 'carfax'];
    
    const sourceLower = source.toLowerCase();
    
    if (tier1Sources.some(t1 => sourceLower.includes(t1))) {
      return 'tier1';
    }
    
    if (tier2Sources.some(t2 => sourceLower.includes(t2))) {
      return 'tier2';  
    }
    
    return 'tier3';
  }
}