
import { supabase } from '@/integrations/supabase/client';

export interface AuctionSaleRecord {
  date: string;
  auction: string;
  lotNumber: string;
  price: number;
  status: 'Sold' | 'Not Sold';
  location?: string;
  mileage?: number;
}

export interface OwnershipRecord {
  ownerNumber: number;
  yearPurchased: number;
  ownerType: 'Personal' | 'Personal lease' | 'Commercial' | 'Rental' | 'Fleet';
  estimatedOwnershipLength: string;
  estimatedMilesPerYear?: number;
  lastReportedOdometer?: number;
}

export interface DamageRecord {
  date: string;
  owner: number;
  mileage?: number;
  damageLocation: string[];
  severity: 'minor' | 'moderate' | 'severe';
  description: string;
  repairStatus?: 'repaired' | 'unrepaired' | 'unknown';
}

export interface TitleRecord {
  date: string;
  state: string;
  titleType: 'Clean' | 'Salvage' | 'Reconstructed' | 'Lemon' | 'Flood' | 'Total Loss';
  titleNumber?: string;
  issuedTo?: string;
  vehicleColor?: string;
  loanLienReported?: boolean;
}

export interface ServiceRecord {
  date: string;
  mileage?: number;
  serviceProvider: string;
  location: string;
  serviceType: string[];
  description: string;
}

export interface DetailedHistoryEvent {
  date: string;
  mileage?: number;
  source: string;
  eventType: 'Service' | 'Sale' | 'Registration' | 'Damage' | 'Recall' | 'Warranty' | 'Other';
  description: string;
  location?: string;
  owner?: number;
}

export interface StatVinData {
  vin: string;
  vehicleDetails: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    engine?: string;
    fuelType?: string;
    drivetrain?: string;
    bodyType?: string;
    country?: string;
  };
  photos: Array<{
    url: string;
    date?: string;
    auction?: string;
  }>;
  auctionSalesHistory: AuctionSaleRecord[];
  ownershipHistory: OwnershipRecord[];
  damageHistory: DamageRecord[];
  titleHistory: TitleRecord[];
  serviceHistory: ServiceRecord[];
  detailedHistory: DetailedHistoryEvent[];
  salesHistory: Array<{
    date: string;
    seller: string;
    sellerLocation?: string;
    odometer?: number;
  }>;
  summaries: {
    totalRecords: number;
    photoCount: number;
    auctionSalesCount: number;
    ownerCount: number;
    damageRecordsCount: number;
    titleRecordsCount: number;
    serviceRecordsCount: number;
    hasStructuralDamage: boolean;
    hasSalvageTitle: boolean;
    hasAirbagDeployment: boolean;
    hasOdometerIssues: boolean;
    hasOpenRecalls: boolean;
  };
  reportDate: string;
  lastUpdated?: string;
}

export interface EnrichedVehicleData {
  vin: string;
  sources: {
    statVin: StatVinData | null;
    facebook: null;
    craigslist: null;
    ebay: null;
    carsdotcom: null;
    offerup: null;
  };
  lastUpdated?: string;
  cached?: boolean;
}

export async function getEnrichedVehicleData(
  vin: string, 
  make?: string, 
  model?: string, 
  year?: number
): Promise<EnrichedVehicleData> {
  console.log(`🔍 Starting enriched data fetch for VIN: ${vin}`);
  
  try {
    // Check user access level first
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ User not authenticated');
      return createEmptyEnrichedData(vin);
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, is_premium_dealer')
      .eq('id', user.id)
      .single();

    const hasAccess = profile && (
      ['premium', 'dealer', 'admin'].includes(profile.role) || 
      profile.is_premium_dealer
    );

    if (!hasAccess) {
      console.log('❌ User does not have premium access');
      return createEmptyEnrichedData(vin);
    }

    console.log('✅ User has premium access, fetching enrichment data');

    // Call the enrichment cache edge function
    const { data, error } = await supabase.functions.invoke('enrichment-cache', {
      body: {
        vin,
        source: 'statvin'
      }
    });

    if (error) {
      console.error('❌ Error calling enrichment cache:', error);
      return createEmptyEnrichedData(vin);
    }

    const enrichedData: EnrichedVehicleData = {
      vin,
      sources: {
        statVin: data.data || null,
        facebook: null,
        craigslist: null,
        ebay: null,
        carsdotcom: null,
        offerup: null,
      },
      lastUpdated: data.lastUpdated,
      cached: data.cached
    };

    console.log('✅ Enriched data compilation complete');
    return enrichedData;
  } catch (error) {
    console.error('❌ Error fetching enriched vehicle data:', error);
    return createEmptyEnrichedData(vin);
  }
}

function createEmptyEnrichedData(vin: string): EnrichedVehicleData {
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
