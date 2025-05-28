
import { getStatVinData } from './sources/statvin';
import { getFacebookListings } from './sources/facebook';
import { getCraigslistListings } from './sources/craigslist';
import { getEbayListings } from './sources/ebay';
import { EnrichedVehicleData } from './types';

export async function getEnrichedVehicleData(
  vin: string, 
  make?: string, 
  model?: string, 
  year?: number
): Promise<EnrichedVehicleData> {
  console.log(`🔍 Starting enriched data fetch for VIN: ${vin}`);
  
  try {
    // Fetch data from all sources in parallel
    const [statVin, facebook, craigslist, ebay] = await Promise.allSettled([
      getStatVinData(vin),
      getFacebookListings(vin, make, model, year),
      getCraigslistListings(vin, make, model, year),
      getEbayListings(vin, make, model, year)
    ]);

    const enrichedData: EnrichedVehicleData = {
      vin,
      sources: {
        statVin: statVin.status === 'fulfilled' ? statVin.value : null,
        facebook: facebook.status === 'fulfilled' ? facebook.value : null,
        craigslist: craigslist.status === 'fulfilled' ? craigslist.value : null,
        ebay: ebay.status === 'fulfilled' ? ebay.value : null,
        carsdotcom: null, // Reserved for future implementation
        offerup: null,    // Reserved for future implementation
      }
    };

    console.log('✅ Enriched data compilation complete');
    return enrichedData;
  } catch (error) {
    console.error('❌ Error fetching enriched vehicle data:', error);
    
    // Return structure with null values on error
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
}

// Export types for external use
export type { EnrichedVehicleData, StatVinData, FacebookListing, CraigslistListing, EbayListing } from './types';
