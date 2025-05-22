
import axios from 'axios';
import { toast } from 'sonner';

interface ManheimAuctionResult {
  vin: string;
  saleDate: string;
  auctionLocation: string;
  year: number;
  make: string;
  model: string;
  odometer: number;
  salePrice: number;
  conditionGrade?: string;
  images?: string[];
}

export async function fetchManheimAuctionHistory(vin: string): Promise<ManheimAuctionResult[]> {
  try {
    // In a real implementation, we'd call an API that has access to Manheim data
    // For now, we'll return mock data with a realistic structure
    
    // For testing, you could use a Supabase Edge Function to proxy requests
    const { data } = await axios.get(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data`, {
      params: { vin, source: 'manheim' },
      headers: {
        'Content-Type': 'application/json',
        // In a real implementation, you would authenticate these requests
      }
    });

    return data.results || [];
  } catch (error: any) {
    console.error('Error fetching Manheim auction history:', error.message);
    // Don't show errors to users unless in development
    if (process.env.NODE_ENV === 'development') {
      toast.error(`Manheim API error: ${error.message}`);
    }
    return [];
  }
}

// Function to format auction results for display and database storage
export function formatManheimResults(results: ManheimAuctionResult[]) {
  return results.map(result => ({
    vin: result.vin,
    source: 'manheim',
    price: result.salePrice.toString(), // Ensure price is a string
    sold_date: result.saleDate,
    odometer: result.odometer.toString(),
    condition_grade: result.conditionGrade || 'Unknown',
    location: result.auctionLocation,
    photo_urls: result.images || [],
  }));
}
