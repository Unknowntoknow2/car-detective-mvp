import { MarketListing } from '@/types/marketListing';
import { logger } from '@/lib/logger';

// Helper functions for listing processing and deduplication

// Remove duplicate listings based on price, mileage, and source similarity
function removeDuplicateListings(listings: MarketListing[]): MarketListing[] {
  const seen = new Set<string>();
  const uniqueListings: MarketListing[] = [];

  for (const listing of listings) {
    // Create a unique key based on price, mileage, and normalized source
    const key = `${listing.price}-${listing.mileage || 0}-${listing.source?.toLowerCase().replace(/[^a-z]/g, '')}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      uniqueListings.push(listing);
    } else {
      logger.log('🗑️ Removed duplicate listing:', { price: listing.price, source: listing.source });
    }
  }

  logger.log(`🔍 Deduplication: ${listings.length} → ${uniqueListings.length} listings`);
  return uniqueListings;
}

// Sort listings by relevance to search criteria
function sortListingsByRelevance(listings: MarketListing[], input: any): MarketListing[] {
  return listings.sort((a, b) => {
    // Prioritize exact VIN matches
    if (input.vin) {
      if (a.vin === input.vin && b.vin !== input.vin) return -1;
      if (b.vin === input.vin && a.vin !== input.vin) return 1;
    }

    // Prioritize listings with more complete data
    const aCompleteness = calculateDataCompleteness(a);
    const bCompleteness = calculateDataCompleteness(b);
    if (aCompleteness !== bCompleteness) return bCompleteness - aCompleteness;

    // Prioritize higher confidence scores
    const aConfidence = a.confidenceScore || 50;
    const bConfidence = b.confidenceScore || 50;
    if (aConfidence !== bConfidence) return bConfidence - aConfidence;

    // Finally, sort by price (ascending)
    return a.price - b.price;
  });
}

// Calculate data completeness score for a listing
function calculateDataCompleteness(listing: MarketListing): number {
  let score = 0;
  
  if (listing.price > 0) score += 20;
  if (listing.mileage) score += 15;
  if (listing.vin) score += 20;
  if (listing.photos && listing.photos.length > 0) score += 10;
  if (listing.dealerName) score += 10;
  if (listing.titleStatus) score += 10;
  if (listing.listingUrl || listing.link) score += 10;
  if (listing.location) score += 5;
  
  return score;
}