import { supabase } from '@/integrations/supabase/client';
import type { MarketListing } from '@/types/marketListing';

export interface MarketSearchParams {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  zipCode: string;
  mileage?: number;
  radius?: number;
}

export interface EnhancedMarketSearchResult {
  listings: MarketListing[];
  meta: {
    totalFound: number;
    sources: string[];
    confidence: number;
    searchMethod: 'database' | 'openai' | 'enhanced' | 'fallback';
    exact_match?: boolean;
  };
}

export async function searchMarketListings(params: MarketSearchParams): Promise<EnhancedMarketSearchResult> {
  console.log('🔍 Starting market search with params:', params);
  
  try {
    // First, try enhanced market search (database)
    const databaseResult = await searchDatabaseListings(params);
    if (databaseResult.listings.length > 0) {
      console.log('✅ Found listings in database:', databaseResult.listings.length);
      return databaseResult;
    }

    // If no database results, try OpenAI live search
    console.log('📡 No database results, trying OpenAI live search...');
    const openaiResult = await searchOpenAIListings(params);
    if (openaiResult.listings.length > 0) {
      console.log('✅ Found listings via OpenAI:', openaiResult.listings.length);
      return openaiResult;
    }

    // Return empty result if no listings found
    console.log('❌ No listings found from any source');
    return {
      listings: [],
      meta: {
        totalFound: 0,
        sources: [],
        confidence: 30,
        searchMethod: 'fallback'
      }
    };

  } catch (error) {
    console.error('❌ Market search error:', error);
    return {
      listings: [],
      meta: {
        totalFound: 0,
        sources: [],
        confidence: 20,
        searchMethod: 'fallback'
      }
    };
  }
}

async function searchDatabaseListings(params: MarketSearchParams): Promise<EnhancedMarketSearchResult> {
  try {
    const { data, error } = await supabase.functions.invoke('enhanced-market-search', {
      body: {
        make: params.make,
        model: params.model,
        year: params.year,
        zip: params.zipCode,
        vin: params.vin,
        exact: false
      }
    });

    if (error) {
      console.error('Database search error:', error);
      throw error;
    }

    const listings = (data?.data || []).map(normalizeEnhancedListing);
    
    return {
      listings,
      meta: {
        totalFound: listings.length,
        sources: data?.meta?.sources || ['enhanced_market_listings'],
        confidence: data?.meta?.confidence || 70,
        searchMethod: 'database',
        exact_match: data?.meta?.exact_match || false
      }
    };
  } catch (error) {
    console.error('Database search failed:', error);
    throw error;
  }
}

async function searchOpenAIListings(params: MarketSearchParams): Promise<EnhancedMarketSearchResult> {
  try {
    const { data, error } = await supabase.functions.invoke('openai-market-search', {
      body: {
        make: params.make,
        model: params.model,
        year: params.year,
        trim: params.trim,
        zip: params.zipCode,
        mileage: params.mileage,
        radius: params.radius || 50
      }
    });

    if (error) {
      console.error('OpenAI search error:', error);
      throw error;
    }

    const listings = (data?.data || []).map(normalizeOpenAIListing);
    
    return {
      listings,
      meta: {
        totalFound: listings.length,
        sources: data?.meta?.sources || ['openai_live_search'],
        confidence: data?.meta?.confidence || 65,
        searchMethod: 'openai'
      }
    };
  } catch (error) {
    console.error('OpenAI search failed:', error);
    throw error;
  }
}

function normalizeEnhancedListing(listing: any): MarketListing {
  return {
    id: listing.id || `enhanced-${Date.now()}-${Math.random()}`,
    source: listing.source || 'Enhanced DB',
    source_type: listing.source_type || 'marketplace',
    price: Number(listing.price) || 0,
    year: Number(listing.year) || 2020,
    make: listing.make || 'Unknown',
    model: listing.model || 'Unknown',
    trim: listing.trim || '',
    vin: listing.vin || '',
    mileage: Number(listing.mileage) || 0,
    condition: listing.condition || 'used',
    dealer_name: listing.dealer_name || null,
    location: listing.location || '',
    listing_url: listing.listing_url || '#',
    is_cpo: Boolean(listing.is_cpo),
    fetched_at: listing.fetched_at || new Date().toISOString(),
    confidence_score: Number(listing.confidence_score) || 75
  };
}

function normalizeOpenAIListing(listing: any): MarketListing {
  return {
    id: listing.id || `openai-${Date.now()}-${Math.random()}`,
    source: listing.source || 'OpenAI Live',
    source_type: 'live',
    price: Number(listing.price) || 0,
    year: Number(listing.year) || 2020,
    make: listing.make || 'Unknown',
    model: listing.model || 'Unknown',
    trim: listing.trim || '',
    vin: listing.vin || '',
    mileage: Number(listing.mileage) || 0,
    condition: listing.condition || 'used',
    dealer_name: listing.dealerName || null,
    location: listing.location || '',
    listing_url: listing.link || '#',
    is_cpo: Boolean(listing.isCpo),
    fetched_at: new Date().toISOString(),
    confidence_score: Number(listing.confidenceScore) || 70
  };
}