
import { supabase } from "@/integrations/supabase/client";

export interface AuctionData {
  id: string;
  vin: string;
  source: string;
  salePrice: number;
  saleDate: string;
  mileage: number;
  condition: string;
  location: string;
  images: string[];
  make?: string;
  model?: string;
  year?: number;
}

export async function fetchAuctionHistory(vin: string): Promise<AuctionData[]> {
  try {
    // First check existing auction data
    const { data: existingData } = await supabase
      .from('auction_results_by_vin')
      .select('*')
      .eq('vin', vin)
      .order('sold_date', { ascending: false });

    if (existingData && existingData.length > 0) {
      return existingData.map(item => ({
        id: item.id,
        vin: item.vin,
        source: item.auction_source,
        salePrice: parseInt(item.price.replace(/[^0-9]/g, '')) || 0,
        saleDate: item.sold_date,
        mileage: parseInt(item.odometer.replace(/[^0-9]/g, '')) || 0,
        condition: item.condition_grade || 'Unknown',
        location: item.location || 'Unknown',
        images: item.photo_urls || [],
        make: item.make,
        model: item.model,
        year: item.year
      }));
    }

    // Trigger fresh auction data fetch
    const { data: freshData } = await supabase.functions.invoke('fetch-auction-history', {
      body: { vin }
    });

    return freshData?.data || [];
  } catch (error) {
    return [];
  }
}

export async function fetchMarketplaceListings(make: string, model: string, year: number, zipCode: string) {
  try {
    const query = `${year} ${make} ${model}`;
    
    // Fetch from multiple platforms
    const platforms = ['craigslist', 'facebook', 'ebay', 'offerup'];
    const results = [];

    for (const platform of platforms) {
      try {
        const { data } = await supabase.functions.invoke('fetch-marketplace-data', {
          body: { query, zipCode, platform }
        });
        
        if (data?.success) {
          results.push({
            platform,
            count: data.count,
            query,
            zipCode
          });
        }
      } catch (error) {
      }
    }

    return results;
  } catch (error) {
    return [];
  }
}

export async function fetchIndustryLeaderData(vin: string, make: string, model: string, year: string) {
  try {
    // Fetch competitor prices from industry leaders
    const { data } = await supabase.functions.invoke('fetch-competitor-prices', {
      body: { vin, make, model, year }
    });

    if (data?.success) {
      return {
        carvana: data.data?.carvana_value || null,
        carmax: data.data?.carmax_value || null,
        edmunds: data.data?.edmunds_value || null,
        carfax: data.data?.carfax_value || null,
        carsDotCom: data.data?.carsdotcom_value || null,
        autotrader: data.data?.autotrader_value || null,
        fetchedAt: data.data?.fetched_at || new Date().toISOString()
      };
    }

    return null;
  } catch (error) {
    return null;
  }
}
