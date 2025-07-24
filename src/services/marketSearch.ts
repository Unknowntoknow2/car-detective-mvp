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
    // First, try to get REAL marketplace data only
    const { RealMarketplaceService } = await import('./realMarketplaceService');
    
    const realListings = await RealMarketplaceService.fetchRealListings({
      vin: params.vin,
      make: params.make,
      model: params.model,
      year: params.year,
      zipCode: params.zipCode,
      maxResults: 20
    });

    if (realListings.length > 0) {
      console.log('✅ Found real marketplace listings:', realListings.length);
      return {
        listings: realListings,
        meta: {
          totalFound: realListings.length,
          sources: ['real_marketplace'],
          confidence: 95,
          searchMethod: 'database',
          exact_match: true
        }
      };
    }

    // If no real data available, use statistical estimates instead of fake listings
    console.log('ℹ️ No real marketplace data available, using statistical estimates');
    const statisticalEstimates = generateStatisticalEstimates(params);
    
    return {
      listings: statisticalEstimates,
      meta: {
        totalFound: statisticalEstimates.length,
        sources: ['statistical_model'],
        confidence: 65,
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
    dealer_name: listing.dealer_name || undefined,
    location: listing.location || '',
    listing_url: listing.listing_url || '#',
    is_cpo: Boolean(listing.is_cpo),
    fetched_at: listing.fetched_at || new Date().toISOString(),
    confidence_score: Number(listing.confidence_score) || 75
  };
}

/**
 * Generate statistical price estimates based on market data
 * This replaces fake listings with transparent estimates
 */
function generateStatisticalEstimates(params: MarketSearchParams): MarketListing[] {
  console.log('📊 Generating statistical market estimates');
  
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - params.year;
  
  // Base MSRP estimates by make/model
  const basePrices: { [key: string]: { [key: string]: number } } = {
    'toyota': { 'camry': 26000, 'corolla': 22000, 'prius': 28000, 'rav4': 30000 },
    'honda': { 'accord': 26000, 'civic': 23000, 'crv': 28000, 'pilot': 34000 },
    'nissan': { 'altima': 25000, 'sentra': 20000, 'rogue': 28000, 'murano': 32000 }
  };
  
  const makeData = basePrices[params.make.toLowerCase()];
  const basePrice = makeData?.[params.model.toLowerCase()] || 28000;
  
  // Apply depreciation
  let estimatedValue = basePrice;
  if (vehicleAge > 0) {
    estimatedValue *= Math.pow(0.85, vehicleAge); // 15% per year
  }
  
  // Mileage adjustment
  const avgMilesPerYear = 12000;
  const expectedMiles = vehicleAge * avgMilesPerYear;
  const actualMiles = params.mileage || expectedMiles;
  
  if (actualMiles > expectedMiles) {
    const excessMiles = actualMiles - expectedMiles;
    estimatedValue -= (excessMiles / 1000) * 30; // $30 per 1000 excess miles
  }
  
  estimatedValue = Math.max(estimatedValue, 5000); // Reasonable floor
  
  // Generate price range estimates instead of fake individual listings
  const estimates: MarketListing[] = [
    {
      id: `estimate-low-${Date.now()}`,
      source: 'Market Analysis',
      source_type: 'estimate',
      price: Math.round(estimatedValue * 0.9), // 10% below estimate
      year: params.year,
      make: params.make,
      model: params.model,
      trim: 'Base',
      vin: '',
      mileage: params.mileage || expectedMiles,
      condition: 'good',
      dealer_name: undefined,
      location: `${params.zipCode} area`,
      listing_url: '',
      is_cpo: false,
      fetched_at: new Date().toISOString(),
      confidence_score: 65
    },
    {
      id: `estimate-avg-${Date.now()}`,
      source: 'Market Analysis', 
      source_type: 'estimate',
      price: Math.round(estimatedValue),
      year: params.year,
      make: params.make,
      model: params.model,
      trim: 'Mid',
      vin: '',
      mileage: params.mileage || expectedMiles,
      condition: 'good',
      dealer_name: undefined,
      location: `${params.zipCode} area`,
      listing_url: '',
      is_cpo: false,
      fetched_at: new Date().toISOString(),
      confidence_score: 70
    },
    {
      id: `estimate-high-${Date.now()}`,
      source: 'Market Analysis',
      source_type: 'estimate', 
      price: Math.round(estimatedValue * 1.15), // 15% above estimate
      year: params.year,
      make: params.make,
      model: params.model,
      trim: 'Premium',
      vin: '',
      mileage: params.mileage ? params.mileage - 10000 : expectedMiles - 10000,
      condition: 'excellent',
      dealer_name: undefined,
      location: `${params.zipCode} area`,
      listing_url: '',
      is_cpo: true,
      fetched_at: new Date().toISOString(),
      confidence_score: 65
    }
  ];
  
  return estimates;
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
    dealer_name: listing.dealerName || undefined,
    location: listing.location || '',
    listing_url: listing.link || '#',
    is_cpo: Boolean(listing.isCpo),
    fetched_at: new Date().toISOString(),
    confidence_score: Number(listing.confidenceScore) || 70
  };
}