
import axios from 'axios';
import { toast } from 'sonner';

interface IAAIAuctionResult {
  vin: string;
  sold_date: string;
  auction_location: string;
  year: number;
  make: string;
  model: string;
  odometer: string;
  sale_price: number;
  damage_type?: string;
  images?: string[];
}

export async function fetchIAAIAuctionHistory(vin: string): Promise<IAAIAuctionResult[]> {
  try {
    // In a real implementation, we'd call an API that has access to IAAI data
    // For now, we'll return mock data with a realistic structure
    
    // For testing, you could use a Supabase Edge Function to proxy requests
    const { data } = await axios.get(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data`, {
      params: { vin, source: 'iaai' },
      headers: {
        'Content-Type': 'application/json',
        // In a real implementation, you would authenticate these requests
      }
    });

    return data.results || [];
  } catch (error: any) {
    console.error('Error fetching IAAI auction history:', error.message);
    // Don't show errors to users unless in development
    if (process.env.NODE_ENV === 'development') {
      toast.error(`IAAI API error: ${error.message}`);
    }
    return [];
  }
}

// Function to format auction results for display and database storage
export function formatIAAIResults(results: IAAIAuctionResult[]) {
  return results.map(result => ({
    vin: result.vin,
    source: 'iaai',
    price: result.sale_price.toString(),
    sold_date: result.sold_date,
    odometer: result.odometer,
    condition_grade: result.damage_type || 'Unknown',
    location: result.auction_location,
    photo_urls: result.images || [],
  }));
}
