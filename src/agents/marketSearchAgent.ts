
// src/agents/marketSearchAgent.ts

import { MarketListing, normalizeListing } from "@/types/marketListing";
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface MarketSearchInput {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  mileage?: number;
  condition?: string;
  zipCode?: string;
}

export interface MarketSearchResult {
  listings: MarketListing[];
  totalFound: number;
  searchQuery: string;
  confidence: number;
  trust: number;
  source: 'enhanced_market_search' | 'live_search_only' | 'database_fallback' | 'no_data';
  notes: string[];
  metadata?: {
    liveListingsCount: number;
    dbListingsCount: number;
    processingTimeMs: number;
    searchSources: string[];
    exactVinMatches: number;
  };
}

export async function fetchMarketComps(input: MarketSearchInput): Promise<MarketSearchResult> {
  const startTime = Date.now();
  logger.log('🎯 Starting market comp search for:', input);
  
  const listings = await searchMarketListings(input);
  const processingTime = Date.now() - startTime;
  
  // Analyze listing composition
  const liveListings = listings.filter(l => l.sourceType === 'live' || l.source_type === 'live');
  const dbListings = listings.filter(l => l.sourceType === 'database' || l.source_type === 'database');
  const exactVinMatches = input.vin ? listings.filter(l => l.vin === input.vin).length : 0;
  
  // Calculate enhanced trust and confidence scores
  const qualityScore = liveListings.length * 0.8 + dbListings.length * 0.6;
  const trust = Math.min(0.95, 0.3 + (qualityScore * 0.08));
  const confidence = Math.min(95, 25 + (qualityScore * 10) + (exactVinMatches * 15));
  
  // Determine source type
  let sourceType: 'enhanced_market_search' | 'live_search_only' | 'database_fallback' | 'no_data';
  if (liveListings.length > 0 && dbListings.length > 0) {
    sourceType = 'enhanced_market_search';
  } else if (liveListings.length > 0) {
    sourceType = 'live_search_only';
  } else if (dbListings.length > 0) {
    sourceType = 'database_fallback';
  } else {
    sourceType = 'no_data';
  }
  
  // Generate comprehensive notes
  const notes = [];
  if (listings.length > 0) {
    notes.push(`Found ${listings.length} total listings`);
    if (liveListings.length > 0) notes.push(`${liveListings.length} live web listings`);
    if (dbListings.length > 0) notes.push(`${dbListings.length} database listings`);
    if (exactVinMatches > 0) notes.push(`${exactVinMatches} exact VIN matches`);
    notes.push(`Search completed in ${processingTime}ms`);
  } else {
    notes.push('No market listings found');
    notes.push('Consider expanding search criteria or using depreciation-based valuation');
  }
  
  // Create metadata object
  const metadata = {
    liveListingsCount: liveListings.length,
    dbListingsCount: dbListings.length,
    processingTimeMs: processingTime,
    searchSources: Array.from(new Set(listings.map(l => l.source))),
    exactVinMatches
  };
  
  return {
    listings,
    totalFound: listings.length,
    searchQuery: `${input.year} ${input.make} ${input.model}${input.trim ? ` ${input.trim}` : ''}`,
    confidence,
    trust,
    source: sourceType,
    notes,
    metadata
  };
}

/**
 * UNIFIED MARKET SEARCH AGENT
 * Single source of truth for all vehicle listings
 * Priority: Live web search → Database fallback
 */
export async function searchMarketListings(input: MarketSearchInput): Promise<MarketListing[]> {
  const { make, model, year, zipCode } = input;

  logger.log('🎯 UNIFIED Market Search Agent - Starting search:', { make, model, year, zipCode });

  // Step 1: Attempt live web search first
  const liveListings = await attemptLiveSearch({ make, model, year, zipCode });
  
  if (liveListings.length > 0) {
    logger.log(`✅ Live search successful: ${liveListings.length} listings found`);
    // Validate and normalize live listings
    const validatedListings = liveListings.filter(validateListing).map(normalizeListing);
    logger.log(`📊 After validation: ${validatedListings.length} valid listings`);
    return validatedListings;
  }

  // Step 2: Fallback to database search
  logger.log("🔄 Market listings fallback used: enhanced_market_listings (no live data found)");
  const dbListings = await fallbackDatabaseSearch({ make, model, year, zipCode });
  
  logger.log(`📊 Database fallback returned: ${dbListings.length} listings`);
  // Validate and normalize database listings
  const validatedDbListings = dbListings.filter(validateListing).map(normalizeListing);
  logger.log(`📊 After validation: ${validatedDbListings.length} valid database listings`);
  return validatedDbListings;
}

/**
 * Validates that a MarketListing has required fields and valid data
 */
function validateListing(listing: MarketListing): boolean {
  // Check required fields
  if (!listing.price || listing.price <= 0) {
    return false;
  }
  
  if (!listing.source || listing.source.trim() === '') {
    return false;
  }
  
  // Price sanity check (between $1,000 and $200,000)
  if (listing.price < 1000 || listing.price > 200000) {
    return false;
  }
  
  // Mileage sanity check if provided
  if (listing.mileage !== undefined && (listing.mileage < 0 || listing.mileage > 500000)) {
    return false;
  }
  
  return true;
}

/**
 * Live search disabled - no external API calls for listings
 */
async function attemptLiveSearch(params: { make: string; model: string; year: number; zipCode?: string }): Promise<MarketListing[]> {
  logger.log('🌐 Live search disabled - no external API calls for listings');
  return [];
}

/**
 * Fallback to database search when live search fails
 */
async function fallbackDatabaseSearch(params: { make: string; model: string; year: number; zipCode?: string }): Promise<MarketListing[]> {
  try {
    logger.log('💾 Fallback: Searching database listings...');

    // Build database query with comprehensive filtering
    let query = supabase
      .from('enhanced_market_listings')
      .select('*')
      .ilike('make', params.make || '')
      .ilike('model', params.model || '')
      .eq('year', params.year)
      .eq('listing_status', 'active')
      .gt('price', 1000)
      .gte('updated_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()); // Last 30 days

    // Apply regional filtering if zipCode provided
    if (params.zipCode) {
      query = query.or(`zip_code.eq.${params.zipCode},geo_distance_miles.lte.100,geo_distance_miles.is.null`);
    }

    const { data: listings, error } = await query
      .order('updated_at', { ascending: false })
      .limit(5);

    if (error) {
      return [];
    }

    // Convert database listings to canonical MarketListing format
    return (listings || []).map((listing): MarketListing => ({
      id: listing.id || `db-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      price: Number(listing.price) || 0,
      mileage: Number(listing.mileage) || undefined,
      year: Number(listing.year) || params.year,
      make: listing.make || params.make,
      model: listing.model || params.model,
      trim: listing.trim || undefined,
      condition: listing.condition || 'used',
      vin: listing.vin || undefined,
      zipCode: listing.zip_code || params.zipCode,
      location: listing.location || undefined,
      source: listing.source || 'Enhanced Database',
      
      // Database format fields (with fallbacks to live format)
      listingUrl: listing.listing_url || undefined,
      listing_url: listing.listing_url || undefined,
      sourceType: 'database',
      source_type: 'database',
      dealerName: listing.dealer_name || undefined,
      dealer_name: listing.dealer_name || undefined,
      isCpo: Boolean(listing.is_cpo),
      is_cpo: Boolean(listing.is_cpo),
      titleStatus: listing.title_status || undefined,
      photos: listing.photos || undefined,
      
      // Extended database fields
      days_on_market: listing.days_on_market || undefined,
      dealer_rating: listing.dealer_rating || undefined,
      exterior_color: listing.exterior_color || undefined,
      interior_color: listing.interior_color || undefined,
      
      // Timestamps
      fetchedAt: listing.fetched_at || listing.created_at || new Date().toISOString(),
      fetched_at: listing.fetched_at || listing.created_at || new Date().toISOString(),
      updatedAt: listing.updated_at || undefined,
      updated_at: listing.updated_at || undefined,
      createdAt: listing.created_at || undefined,
      created_at: listing.created_at || undefined,
      
      confidenceScore: Number(listing.confidence_score) || 70 // Medium confidence for database data
    }));

  } catch (error) {
    return [];
  }
}
