
import { supabase } from '@/integrations/supabase/client';

interface AuctionResult {
  id: string;
  vin: string;
  price: string;
  sold_date: string;
  odometer: string;
  condition_grade?: string;
  location?: string;
  auction_source: string;
  photo_urls: string[];
}

// Function to fetch auction data from the database
export async function getAuctionResultsByVin(vin: string): Promise<AuctionResult[]> {
  const { data, error } = await supabase
    .from('auction_results_by_vin')
    .select('*')
    .eq('vin', vin)
    .order('sold_date', { ascending: false });

  if (error) {
    console.error('Error fetching auction results:', error);
    return [];
  }

  return data || [];
}

// Function to trigger background fetch of auction data
export async function triggerAuctionDataFetch(vin: string): Promise<void> {
  try {
    // First check if we already have data for this VIN
    const { count, error } = await supabase
      .from('auction_results_by_vin')
      .select('*', { count: 'exact', head: true })
      .eq('vin', vin);
    
    // If we already have data, don't fetch again unless it's older than 7 days
    if (count && count > 0) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      const { data: recentData } = await supabase
        .from('auction_results_by_vin')
        .select('fetched_at')
        .eq('vin', vin)
        .gt('fetched_at', sevenDaysAgo.toISOString())
        .limit(1);
      
      if (recentData && recentData.length > 0) {
        console.log('Recent auction data exists, skipping fetch');
        return;
      }
    }

    // Trigger the Edge Function to fetch auction data
    const { data, error: functionError } = await supabase.functions.invoke('fetch-auction-data', {
      body: { vin }
    });

    if (functionError) {
      console.error('Error triggering auction data fetch:', functionError);
    } else {
      console.log('Auction data fetch triggered successfully:', data);
    }
  } catch (error) {
    console.error('Error in triggerAuctionDataFetch:', error);
  }
}
