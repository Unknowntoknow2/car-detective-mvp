
import { supabase } from "@/integrations/supabase/client";
import { AuctionResult } from "@/types/auction";

export async function fetchAuctionResultsByVin(vin: string): Promise<AuctionResult[]> {
  const { data, error } = await supabase
    .from("auction_results_by_vin")
    .select("*")
    .eq("vin", vin)
    .order("sold_date", { ascending: false });

  if (error) {
    return [];
  }

  return (data || []) as AuctionResult[];
}
