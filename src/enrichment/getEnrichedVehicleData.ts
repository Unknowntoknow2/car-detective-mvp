
import { supabase } from '@/integrations/supabase/client';

export interface StatVinData {
  vin: string;
  statVinData?: {
    auctionHistory: Array<{
      date: string;
      price: number;
      location: string;
      condition: string;
      mileage: number;
    }>;
    damageHistory: Array<{
      type: string;
      location: string;
      severity: string;
    }>;
    titleHistory: Array<{
      state: string;
      type: string;
      date: string;
    }>;
  };
}

export interface EnrichedVehicleData {
  vin: string;
  sources: {
    statVin: StatVinData | null;
    facebook: null;
    craigslist: null;
    ebay: null;
    carsdotcom: null;
    offerup: null;
  };
  lastUpdated?: string;
  cached?: boolean;
}

export async function getEnrichedVehicleData(
  vin: string, 
  make?: string, 
  model?: string, 
  year?: number
): Promise<EnrichedVehicleData> {
  console.log(`🔍 Starting enriched data fetch for VIN: ${vin}`);
  
  try {
    // Check user access level first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ User not authenticated');
      return createEmptyEnrichedData(vin);
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_premium_dealer')
      .eq('id', user.id)
      .single();

    const hasAccess = profile && (
      ['premium', 'dealer', 'admin'].includes(profile.role) || 
      profile.is_premium_dealer
    );

    if (!hasAccess) {
      console.log('❌ User does not have premium access');
      return createEmptyEnrichedData(vin);
    }

    console.log('✅ User has premium access, fetching enrichment data');

    // Call the enrichment cache edge function
    const { data, error } = await supabase.functions.invoke('enrichment-cache', {
      body: {
        vin,
        source: 'statvin'
      }
    });

    if (error) {
      console.error('❌ Error calling enrichment cache:', error);
      return createEmptyEnrichedData(vin);
    }

    const enrichedData: EnrichedVehicleData = {
      vin,
      sources: {
        statVin: data.data || null,
        facebook: null,
        craigslist: null,
        ebay: null,
        carsdotcom: null,
        offerup: null,
      },
      lastUpdated: data.lastUpdated,
      cached: data.cached
    };

    console.log('✅ Enriched data compilation complete');
    return enrichedData;
  } catch (error) {
    console.error('❌ Error fetching enriched vehicle data:', error);
    return createEmptyEnrichedData(vin);
  }
}

function createEmptyEnrichedData(vin: string): EnrichedVehicleData {
  return {
    vin,
    sources: {
      statVin: null,
      facebook: null,
      craigslist: null,
      ebay: null,
      carsdotcom: null,
      offerup: null,
    }
  };
}

// Export types for external use
export type { EnrichedVehicleData, StatVinData };
