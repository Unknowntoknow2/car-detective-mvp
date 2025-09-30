
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

interface BidCarsRecord {
  vin: string;
  price: string;
  odometer: string;
  year?: string;
  make?: string;
  model?: string;
  condition?: string;
  auction_date?: string;
  image?: string;
  source: string;
}

interface AutoAuctionsRecord {
  vin: string;
  price: string;
  odometer: string;
  year?: string;
  make?: string;
  model?: string;
  condition?: string;
  auction_date?: string;
  location?: string;
  image?: string;
  source: string;
}

// Function to fetch auction data from the database
export async function getAuctionResultsByVin(vin: string): Promise<AuctionResult[]> {
  const { data, error } = await supabase
    .from('auction_results_by_vin')
    .select('*')
    .eq('vin', vin)
    .order('sold_date', { ascending: false });

  if (error) {
    return [];
  }

  return data || [];
}

// Function to trigger background fetch of auction data
export async function triggerAuctionDataFetch(vin: string): Promise<void> {
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
      return;
    }
  }

  // Trigger the Edge Function to fetch auction data
  await supabase.functions.invoke('fetch-auction-data', {
    body: { vin }
  });
}

// Function to fetch Bid.Cars data
export async function fetchBidCarsByVin(vin: string): Promise<BidCarsRecord[]> {
  const { data, error } = await supabase.functions.invoke('fetch-bidcars-data', {
    body: { vin }
  });
  if (error) {
    return [];
  }
  return data?.records || [];
}

// Function to fetch AutoAuctions.io data
export async function fetchAutoAuctionsByVin(vin: string): Promise<AutoAuctionsRecord[]> {
  const { data, error } = await supabase.functions.invoke('fetch-autoauctions-data', {
    body: { vin }
  });
  if (error) {
    return [];
  }
  return data?.records || [];
}
