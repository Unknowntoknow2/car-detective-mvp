import { supabase } from '@/integrations/supabase/client';
import { fetchStatVinData } from './sources/fetchStatVinData';
import { fetchMarketplaceListings, MarketplaceData } from './sources/fetchMarketplaceListings';

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
    marketplaces: MarketplaceData | null;
    facebook: null;
    craigslist: null;
    ebay: null;
    carsdotcom: null;
    offerup: null;
  };
  marketAnalysis?: {
    averageMarketPrice: number;
    auctionDiscount: number;
    dealerMargin: number;
    priceConfidence: number;
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
  console.log(`🔍 Starting enhanced enriched data fetch for VIN: ${vin}`);
  
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

    console.log('✅ User has premium access, fetching comprehensive enrichment data');

    // Check cache first
    const { data: cached } = await supabase
      .from('auction_enrichment_by_vin')
      .select('*')
      .eq('vin', vin)
      .eq('source', 'comprehensive')
      .single();

    // Use cache if it's less than 24 hours old
    if (cached && cached.updated_at) {
      const cacheAge = Date.now() - new Date(cached.updated_at).getTime();
      const maxCacheAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (cacheAge < maxCacheAge) {
        console.log('✅ Using cached comprehensive enrichment data');
        return {
          ...cached.data,
          cached: true,
          lastUpdated: cached.updated_at,
        };
      }
    }

    // Fetch fresh data from all sources
    console.log('🔄 Fetching fresh data from all sources...');
    
    const [statVinData, marketplaceData] = await Promise.allSettled([
      fetchStatVinData(vin),
      make && model && year 
        ? fetchMarketplaceListings({ make, model, year, zipCode: '90210' }) // Default ZIP for nationwide search
        : Promise.resolve(null),
    ]);

    const statVin = statVinData.status === 'fulfilled' ? statVinData.value : null;
    const marketplaces = marketplaceData.status === 'fulfilled' ? marketplaceData.value : null;

    // Calculate market analysis
    const marketAnalysis = calculateMarketAnalysis(statVin, marketplaces);

    const enrichedData: EnrichedVehicleData = {
      vin,
      sources: {
        statVin,
        marketplaces,
        facebook: null,
        craigslist: null,
        ebay: null,
        carsdotcom: null,
        offerup: null,
      },
      marketAnalysis,
      lastUpdated: new Date().toISOString(),
      cached: false,
    };

    // Cache the comprehensive data
    await supabase
      .from('auction_enrichment_by_vin')
      .upsert({
        vin,
        source: 'comprehensive',
        data: enrichedData,
        updated_at: new Date().toISOString(),
      });

    console.log('✅ Comprehensive enriched data compilation complete');
    return enrichedData;
    
  } catch (error) {
    console.error('❌ Error fetching comprehensive enriched vehicle data:', error);
    return createEmptyEnrichedData(vin);
  }
}

function calculateMarketAnalysis(
  statVin: StatVinData | null, 
  marketplaces: MarketplaceData | null
) {
  if (!marketplaces || marketplaces.allListings.length === 0) {
    return undefined;
  }

  const averageMarketPrice = marketplaces.priceAnalysis.averagePrice;
  
  // Calculate auction discount if we have STAT.vin data
  let auctionDiscount = 0;
  if (statVin?.salePrice) {
    const auctionPrice = parseFloat(statVin.salePrice.replace(/,/g, ''));
    if (auctionPrice > 0) {
      auctionDiscount = ((averageMarketPrice - auctionPrice) / averageMarketPrice) * 100;
    }
  }

  // Estimate dealer margin (typically 15-25% markup from auction)
  const dealerMargin = auctionDiscount > 0 ? auctionDiscount * 0.7 : 20; // Default 20% if no auction data

  // Calculate price confidence based on number of listings and data sources
  const listingCount = marketplaces.allListings.length;
  const sourceCount = [
    marketplaces.bySource.facebook.length > 0,
    marketplaces.bySource.craigslist.length > 0,
    marketplaces.bySource.carscom.length > 0,
    statVin !== null,
  ].filter(Boolean).length;

  const priceConfidence = Math.min(
    (listingCount * 10) + (sourceCount * 20), 
    100
  );

  return {
    averageMarketPrice,
    auctionDiscount: Math.round(auctionDiscount),
    dealerMargin: Math.round(dealerMargin),
    priceConfidence,
  };
}

function createEmptyEnrichedData(vin: string): EnrichedVehicleData {
  return {
    vin,
    sources: {
      statVin: null,
      marketplaces: null,
      facebook: null,
      craigslist: null,
      ebay: null,
      carsdotcom: null,
      offerup: null,
    }
  };
}
