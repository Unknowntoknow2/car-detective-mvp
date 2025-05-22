
import axios from 'axios';
import { toast } from 'sonner';

interface CopartAuctionResult {
  vin: string;
  sale_date: string;
  yard_name: string;
  year: number;
  make: string;
  model: string;
  odometer: string;
  final_bid: number;
  damage_type?: string;
  images?: string[];
}

export async function fetchCopartAuctionHistory(vin: string): Promise<CopartAuctionResult[]> {
  try {
    // In a real implementation, we'd call an API that has access to Copart data
    // For now, we'll return mock data with a realistic structure
    
    // For testing, you could use a Supabase Edge Function to proxy requests
    const { data } = await axios.get(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data`, {
      params: { vin, source: 'copart' },
      headers: {
        'Content-Type': 'application/json',
        // In a real implementation, you would authenticate these requests
      }
    });

    return data.results || [];
  } catch (error: any) {
    console.error('Error fetching Copart auction history:', error.message);
    // Don't show errors to users unless in development
    if (process.env.NODE_ENV === 'development') {
      toast.error(`Copart API error: ${error.message}`);
    }
    return [];
  }
}

// Function to format auction results for display and database storage
export function formatCopartResults(results: CopartAuctionResult[]) {
  return results.map(result => ({
    vin: result.vin,
    source: 'copart',
    price: result.final_bid.toString(),
    sold_date: result.sale_date,
    odometer: result.odometer,
    condition_grade: result.damage_type || 'Unknown',
    location: result.yard_name,
    photo_urls: result.images || [],
  }));
}
