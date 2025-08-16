
export interface AuctionData {
  vin: string;
  salePrice?: number;
  estimatedValue?: number;
  condition: string;
  damageType?: string;
  titleStatus?: string;
  saleDate?: string;
  location?: string;
  images: string[];
  auctionHouse?: string;
  lot?: string;
  vehicleInfo: {
    make?: string;
    model?: string;
    year?: number;
    mileage?: number;
    bodyType?: string;
    engine?: string;
    transmission?: string;
    fuelType?: string;
    exteriorColor?: string;
    interiorColor?: string;
  };
  confidence: number;
}

export async function getStatvinData(vin: string): Promise<{ vin: string; data: AuctionData | null; error: string | null }> {
  console.log(`🔍 Fetching auction data for VIN: ${vin}`);
  
  try {
    // Call our enhanced auction data edge function instead of StatVin
    const response = await fetch(`https://xltxqqzattxogxtqrggt.supabase.co/functions/v1/fetch-auction-data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY`
      },
      body: JSON.stringify({ vin })
    });

    if (!response.ok) {
      console.error(`❌ Auction data API failed: ${response.status}`);
      return {
        vin,
        data: null,
        error: `API error: ${response.status}`
      };
    }

    const result = await response.json();
    
    if (result.success && result.data) {
      console.log(`✅ Found auction data for VIN ${vin}`);
      return {
        vin,
        data: result.data,
        error: null
      };
    } else {
      console.log(`ℹ️ No auction data found for VIN ${vin}`);
      return {
        vin,
        data: null,
        error: result.error || 'No auction data available'
      };
    }

  } catch (error) {
    console.error('❌ Auction data fetch failed:', error);
    return {
      vin,
      data: null,
      error: `Network error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
