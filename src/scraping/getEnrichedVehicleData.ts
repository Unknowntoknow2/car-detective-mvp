
import { getStatVinData, StatVinData } from './brightdata/getStatVinData';

export interface EnrichedVehicleData {
  vin: string;
  statVin: StatVinData | null;
  craigslist: null; // Reserved for future implementation
  facebook: null;   // Reserved for future implementation
  ebay: null;       // Reserved for future implementation
}

export async function getEnrichedVehicleData(vin: string): Promise<EnrichedVehicleData> {
  console.log(`🔍 Starting enriched data fetch for VIN: ${vin}`);
  
  try {
    // Fetch STAT.vin data
    const statVin = await getStatVinData(vin);
    
    const enrichedData: EnrichedVehicleData = {
      vin,
      statVin,
      craigslist: null, // Reserved for future Craigslist integration
      facebook: null,   // Reserved for future Facebook Marketplace integration
      ebay: null,       // Reserved for future eBay Motors integration
    };

    console.log('✅ Enriched data compilation complete');
    return enrichedData;
  } catch (error) {
    console.error('❌ Error fetching enriched vehicle data:', error);
    
    // Return structure with null values on error
    return {
      vin,
      statVin: null,
      craigslist: null,
      facebook: null,
      ebay: null,
    };
  }
}
