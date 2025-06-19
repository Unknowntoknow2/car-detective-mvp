
import { getStatVinData } from './sources/statvin';
import { fetchMarketplaceListings, MarketplaceSearchParams } from './sources/fetchMarketplaceListings';
import { EnrichedVehicleData } from './types';
import { supabase } from '@/integrations/supabase/client';

// Re-export the type for convenience
export type { EnrichedVehicleData } from './types';

export async function getEnrichedVehicleData(
  vin: string,
  make?: string,
  model?: string,
  year?: number
): Promise<EnrichedVehicleData> {
  console.log(`🔍 Starting enrichment for VIN: ${vin}`);
  
  // Check cache first
  const cached = await getCachedEnrichment(vin);
  if (cached) {
    console.log('✅ Using cached enrichment data');
    return cached;
  }

  console.log('🔄 Fetching fresh enrichment data...');
  
  try {
    // Fetch available data sources
    const [statVinData, marketplaceData] = await Promise.allSettled([
      getStatVinData(vin),
      make && model && year ? fetchMarketplaceListings({
        make,
        model,
        year,
        maxResultsPerSource: 10
      }) : Promise.resolve({
        allListings: [],
        bySource: { facebook: [], craigslist: [], carscom: [] },
        priceAnalysis: { averagePrice: 0, medianPrice: 0, priceRange: [0, 0] as [number, number], listingCount: 0 },
        errors: []
      })
    ]);

    // Process results
    const enrichedData: EnrichedVehicleData = {
      vin,
      lastUpdated: new Date().toISOString(),
      sources: {
        statVin: statVinData.status === 'fulfilled' ? statVinData.value : null,
        facebook: null,
        craigslist: null,
        ebay: null,
        carsdotcom: marketplaceData.status === 'fulfilled' ? marketplaceData.value.bySource.carscom : null,
        offerup: null // Reserved for future implementation
      }
    };

    // Cache the results
    await cacheEnrichment(vin, enrichedData);
    
    console.log('✅ Enrichment completed successfully');
    return enrichedData;

  } catch (error) {
    console.error('❌ Enrichment failed:', error);
    
    // Return empty structure on error
    return {
      vin,
      lastUpdated: new Date().toISOString(),
      sources: {
        statVin: null,
        facebook: null,
        craigslist: null,
        ebay: null,
        carsdotcom: null,
        offerup: null
      }
    };
  }
}

async function getCachedEnrichment(vin: string): Promise<EnrichedVehicleData | null> {
  try {
    const { data, error } = await supabase
      .from('auction_enrichment_by_vin')
      .select('data, updated_at')
      .eq('vin', vin.toUpperCase())
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    // Check if cache is still fresh (less than 1 hour old)
    const cacheAge = Date.now() - new Date(data.updated_at).getTime();
    const maxCacheAge = 60 * 60 * 1000; // 1 hour

    if (cacheAge > maxCacheAge) {
      console.log('⏰ Cache expired, fetching fresh data');
      return null;
    }

    return data.data as EnrichedVehicleData;
  } catch (error) {
    console.error('Error checking cache:', error);
    return null;
  }
}

async function cacheEnrichment(vin: string, data: EnrichedVehicleData): Promise<void> {
  try {
    // Use upsert to handle existing records
    const { error } = await supabase
      .from('auction_enrichment_by_vin')
      .upsert({
        vin: vin.toUpperCase(),
        source: 'unified_enrichment',
        data: data,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'vin'
      });

    if (error) {
      console.error('Failed to cache enrichment:', error);
    } else {
      console.log('✅ Enrichment data cached successfully');
    }
  } catch (error) {
    console.error('Error caching enrichment:', error);
  }
}

// Helper function to check if user has premium access
export async function hasEnrichmentAccess(): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if user has premium access
    const { data: premiumAccess } = await supabase
      .from('premium_access')
      .select('*')
      .eq('user_id', user.id)
      .gt('credits_remaining', 0)
      .maybeSingle();

    // Check if user has admin role
    const { data: userRole } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    return !!(premiumAccess || userRole);
  } catch (error) {
    console.error('Error checking enrichment access:', error);
    return false;
  }
}

// Calculate market value based on enrichment data
export function calculateMarketValue(enrichedData: EnrichedVehicleData): {
  averagePrice: number;
  priceRange: [number, number];
  dataPoints: number;
} {
  const prices: number[] = [];
  
  // Collect prices from STAT.vin
  if (enrichedData.sources.statVin?.salePrice) {
    const price = parseFloat(enrichedData.sources.statVin.salePrice.replace(/[,$]/g, ''));
    if (!isNaN(price)) prices.push(price);
  }

  if (prices.length === 0) {
    return { averagePrice: 0, priceRange: [0, 0], dataPoints: 0 };
  }

  prices.sort((a, b) => a - b);
  const averagePrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const priceRange: [number, number] = [prices[0], prices[prices.length - 1]];

  return {
    averagePrice: Math.round(averagePrice),
    priceRange,
    dataPoints: prices.length
  };
}
