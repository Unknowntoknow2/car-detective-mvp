// Market Search Agent - Google-Grade Tier-Based Market Intelligence 
import { supabase } from "@/integrations/supabase/client";
import { ValuationInput, MarketListing } from "@/types/valuation";
import { parseVehicleListingsFromWeb, type ParsedListing } from "@/utils/parsers/listingParser";

// TIER-BASED MARKET SOURCE ARCHITECTURE (FANG-GRADE)
const MARKET_SOURCE_TIERS = {
  // CATEGORY 1: Retail Dealership Aggregators
  RETAIL_AGGREGATORS: {
    TIER_1: {
      sources: ['AutoTrader', 'Cars.com', 'Edmunds', 'CarGurus', 'KBB Used', 'Carfax Listings'],
      domains: ['autotrader.com', 'cars.com', 'edmunds.com', 'cargurus.com', 'kbb.com', 'carfax.com'],
      trustWeight: 1.0,
      type: 'retail' as const
    },
    TIER_2: {
      sources: ['AutoNation', 'Enterprise Car Sales', 'EchoPark', 'Hertz Car Sales', 'Sonic Automotive'],
      domains: ['autonation.com', 'enterprisecarsales.com', 'echopark.com', 'hertzcarsales.com', 'sonicautomotive.com'],
      trustWeight: 0.85,
      type: 'retail' as const
    },
    TIER_3: {
      sources: ['Fred Beans', 'Lithia Motors', 'Koons', 'Napleton', 'Penske', 'Priority Auto Group'],
      domains: ['fredbeans.com', 'lithia.com', 'koons.com', 'napleton.com', 'penske.com', 'priorityauto.com'],
      trustWeight: 0.7,
      type: 'retail' as const
    }
  },
  
  // CATEGORY 2: Private-Party Marketplaces (P2P)
  P2P_MARKETPLACES: {
    TIER_1: {
      sources: ['Facebook Marketplace', 'Craigslist', 'OfferUp'],
      domains: ['facebook.com/marketplace', 'craigslist.org', 'offerup.com'],
      trustWeight: 0.75,
      type: 'p2p' as const
    },
    TIER_2: {
      sources: ['eBay Motors', 'Nextdoor', 'KSL Classifieds'],
      domains: ['ebay.com/motors', 'nextdoor.com', 'ksl.com'],
      trustWeight: 0.65,
      type: 'p2p' as const
    },
    TIER_3: {
      sources: ['Oodle', 'Recycler', 'CarSoup'],
      domains: ['oodle.com', 'recycler.com', 'carsoup.com'],
      trustWeight: 0.55,
      type: 'p2p' as const
    }
  },
  
  // CATEGORY 3: Wholesale + Dealer Auctions
  AUCTIONS: {
    TIER_1: {
      sources: ['Manheim', 'ADESA', 'ACV Auctions', 'BacklotCars'],
      domains: ['manheim.com', 'adesa.com', 'acvauctions.com', 'backlotcars.com'],
      trustWeight: 0.8,
      type: 'auction' as const
    },
    TIER_2: {
      sources: ['IAA', 'Copart', 'Westlake Auctions'],
      domains: ['iaai.com', 'copart.com', 'westlakeauctions.com'],
      trustWeight: 0.6,
      type: 'auction' as const
    },
    TIER_3: {
      sources: ['GovDeals', 'GovPlanet', 'Purple Wave'],
      domains: ['govdeals.com', 'govplanet.com', 'purplewave.com'],
      trustWeight: 0.5,
      type: 'auction' as const
    }
  }
} as const;

type MarketQueryInput = {
  vin?: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  mileage?: number;
  zipCode?: string;
};

export type EnrichedMarketListing = {
  source: string;
  tier: 1 | 2 | 3;
  type: 'retail' | 'p2p' | 'auction';
  vin?: string;
  year: number;
  make: string;
  model: string;
  mileage: number;
  price: number;
  location?: string;
  url?: string;
  trustWeight: number;
};

interface ListingComp {
  price: number;
  title: string;
  source: string;
  url: string;
}

interface MarketComps {
  average: number;
  low: number;
  high: number;
  sources: ListingComp[];
}

export interface MarketSearchResult {
  listings: MarketListing[];
  trust: number;
  notes: string[];
  source: string;
  exactVinMatch?: MarketListing | null;
}

export async function fetchMarketComps(input: ValuationInput): Promise<MarketSearchResult> {
  try {
    console.log('[MARKET_SEARCH DEBUG] Starting market search for:', {
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipCode
    });
    
    console.log('[MARKET_SEARCH DEBUG] Input values:', {
      year: input.year,
      make: input.make,
      model: input.model,
      zip: input.zipCode,
      vin: input.vin
    });

    // Step 1: Check existing database listings first for faster results
    console.log('📊 Checking database for existing market listings...');
    let marketListings: MarketListing[] = [];
    
    try {
      const { data: dbListings, error: dbError } = await supabase
        .from('market_listings')
        .select('*')
        .eq('make', input.make)
        .eq('model', input.model)
        .eq('year', input.year)
        .order('created_at', { ascending: false })
        .limit(10);

      if (dbListings && dbListings.length > 0) {
        marketListings = dbListings.map(transformToMarketListing);
        console.log(`✅ Found ${marketListings.length} existing listings in database`);
        
        // If we have good database listings, use them with high confidence
        if (marketListings.length >= 3) {
          const exactVinMatch = marketListings.find(listing => listing.vin === input.vin);
          
          return {
            listings: marketListings,
            trust: exactVinMatch ? 0.95 : 0.85, // High trust for database listings
            notes: exactVinMatch ? 
              ['Exact VIN match found in database', `Using ${marketListings.length} comparable listings`] :
              [`Using ${marketListings.length} comparable listings from database`],
            source: exactVinMatch ? 'exact_vin_match' : 'database_listings',
            exactVinMatch: exactVinMatch || null
          };
        }
      }
    } catch (dbError) {
      console.warn('⚠️ Database listing check failed, continuing with web search:', dbError);
    }

    // Step 2: If no sufficient database listings, try web search
    console.log('🌐 Insufficient database listings, attempting web search...');
    
    let query = `Used ${input.year} ${input.make} ${input.model} for sale`;
    
    if (input.vin) {
      query = `"${input.vin}" OR "${input.year} ${input.make} ${input.model}" for sale price mileage`;
    }
    
    if (input.zipCode) {
      query += ` near ${input.zipCode}`;
    }
    
    // Add common dealer and marketplace terms
    query += ` CarMax AutoTrader Cars.com dealer price mileage`;
    
    console.log('🔍 Web search query:', query);
    
    console.log('[MARKET_SEARCH DEBUG] Final query string:', query);
    
    // Try OpenAI web search if available
    let webSearchResult: any = null;
    try {
      const payload = { 
        query,
        max_tokens: 3000,
        saveToDb: true,
        vehicleData: {
          make: input.make,
          model: input.model,
          year: input.year,
          trim: input.trim,
          zipCode: input.zipCode,
          vin: input.vin
        }
      };
      
      console.log('[MARKET_SEARCH DEBUG] Invoking openai-web-search edge function with payload:', payload);

      const { data: searchResult, error: searchError } = await supabase.functions.invoke('openai-web-search', {
        body: payload
      });
      
      console.log('[MARKET_SEARCH DEBUG] Edge function result:', {
        searchResult: searchResult,
        searchError: searchError
      });
      
      if (searchError) {
        console.error('[MARKET_SEARCH DEBUG] ❌ Edge function invocation error:', searchError);
        console.error('[MARKET_SEARCH DEBUG] ❌ Error details:', JSON.stringify(searchError, null, 2));
      } else if (searchResult) {
        webSearchResult = searchResult;
        console.log('[MARKET_SEARCH DEBUG] ✅ Web search completed successfully');
        console.log('[MARKET_SEARCH DEBUG] 📊 Search result data structure:', {
          hasContent: !!searchResult.content,
          hasListings: !!searchResult.listings,
          listingsCount: searchResult.listings?.length || 0,
          searchQuery: searchResult.searchQuery
        });
      } else {
        console.log('[MARKET_SEARCH DEBUG] ⚠️ Edge function returned empty result');
      }
    } catch (searchError) {
      console.error('[MARKET_SEARCH DEBUG] 💥 Web search exception:', searchError);
      console.error('[MARKET_SEARCH DEBUG] 💥 Exception details:', JSON.stringify(searchError, null, 2));
    }
    
    console.log('[MARKET_SEARCH DEBUG] webSearchResult after edge function call:', webSearchResult);
    if (webSearchResult && webSearchResult.listings && webSearchResult.listings.length === 0) {
      console.warn('[MARKET_SEARCH DEBUG] ⚠️ Edge function returned zero listings');
    }

    // Step 3: Process web search results if available
    let webListings: MarketListing[] = [];
    let content = '';
    
    if (webSearchResult) {
      content = webSearchResult.content || webSearchResult.result || '';
      console.log('📄 Search content length:', content.length, 'chars');
      
      // Use saved listings from Edge Function database response
      if (webSearchResult.listings && webSearchResult.listings.length > 0) {
        webListings = webSearchResult.listings.map(transformToMarketListing);
        console.log('✅ Using freshly saved market listings from Edge Function:', webListings.length);
        
        // Debug each listing
        webListings.forEach((listing, i) => {
          console.log(`📋 Listing ${i + 1}:`, {
            price: listing.price,
            source: listing.source,
            vin: listing.vin,
            dealer: listing.dealer_name
          });
        });
      } else {
        console.log('⚠️ No listings returned from Edge Function, attempting content parsing...');
        // Fallback to parsing from content
        const parsedListings = parseVehicleListingsFromWeb(content);
        webListings = parsedListings.map(listing => transformParsedToMarketListing(listing, input));
        console.log('📋 Parsed listings from content:', webListings.length);
      }
    }
    
    // Combine database and web listings, prioritizing web listings for freshness
    const combinedListings = [...webListings, ...marketListings];
    const finalListings = removeDuplicateListings(combinedListings).slice(0, 15); // Limit to 15 best listings

    // Calculate trust score based on all available data
    const trustResult = calculateTrustScore(content, [], finalListings);

    // Check for exact VIN match across all listings
    const exactVinMatch = finalListings.find(listing => listing.vin === input.vin);
    if (exactVinMatch) {
      console.log('🎯 EXACT VIN MATCH DETECTED:', {
        vin: exactVinMatch.vin,
        price: exactVinMatch.price,
        source: exactVinMatch.source
      });
      trustResult.trust = Math.max(trustResult.trust, 0.95); // Boost trust for exact match
      trustResult.notes.push('Exact VIN match found - highest confidence');
    }

    // Enhanced fallback handling with transparency
    const realListingsCount = finalListings.filter(l => l.source_type !== 'estimated').length;
    
    if (realListingsCount === 0) {
      console.log('⚠️ No real market listings found, using synthetic fallback data');
      const syntheticListings = createFallbackListings(input);
      return {
        listings: syntheticListings,
        trust: 0.15, // Very low trust for synthetic data
        notes: [
          'FALLBACK MODE: No real market data found',
          'Using estimated values based on depreciation models',
          'Consider checking manually for recent listings'
        ],
        source: 'synthetic_fallback',
        exactVinMatch: null
      };
    } else if (realListingsCount < 3) {
      trustResult.notes.push(`LIMITED DATA: Only ${realListingsCount} real market listing(s) found`);
      trustResult.trust = Math.min(trustResult.trust, 0.6); // Cap trust for limited data
    }

    console.log('✅ Market search completed:', {
      listingsCount: finalListings.length,
      trustScore: trustResult.trust,
      exactVinMatch: !!exactVinMatch,
      notes: trustResult.notes
    });

    return {
      listings: finalListings,
      trust: trustResult.trust,
      notes: trustResult.notes,
      source: exactVinMatch ? 'exact_vin_match' : (webListings.length > 0 ? 'web_search' : 'database_listings'),
      exactVinMatch: exactVinMatch || null
    };

  } catch (error) {
    console.error('❌ Market Search Agent error:', error);
    return {
      listings: [],
      trust: 0.0,
      notes: ['Search agent error'],
      source: 'error'
    };
  }
}

function transformParsedToMarketListing(listing: ParsedListing, input: ValuationInput): MarketListing {
  return {
    id: `ai-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: listing.source || 'OpenAI Web Search',
    source_type: 'marketplace',
    price: listing.price,
    year: input.year,
    make: input.make,
    model: input.model,
    trim: input.trim,
    vin: undefined,
    mileage: listing.mileage,
    condition: undefined,
    dealer_name: undefined,
    location: listing.zipCode || input.zipCode,
    listing_url: listing.url || 'https://openai-search-result',
    is_cpo: false,
    fetched_at: new Date().toISOString(),
    confidence_score: listing.mileage ? 85 : 75 // Higher confidence when mileage is available
  };
}

function transformToMarketListing(dbListing: any): MarketListing {
  return {
    id: dbListing.id,
    source: dbListing.source,
    source_type: dbListing.source_type || 'marketplace',
    price: dbListing.price,
    year: dbListing.year,
    make: dbListing.make,
    model: dbListing.model,
    trim: dbListing.trim,
    vin: dbListing.vin,
    mileage: dbListing.mileage,
    condition: dbListing.condition,
    dealer_name: dbListing.dealer_name,
    location: dbListing.location,
    listing_url: dbListing.listing_url,
    is_cpo: dbListing.is_cpo || false,
    fetched_at: dbListing.fetched_at || new Date().toISOString(),
    confidence_score: dbListing.confidence_score || 85
  };
}

function calculateTrustScore(content: string, parsedListings: ParsedListing[], marketListings: MarketListing[]): { trust: number; notes: string[] } {
  const notes: string[] = [];
  let trust = 1.0;

  // Check for dollar signs and price patterns
  if (!content.includes('$') || parsedListings.length < 2) {
    trust = 0.3;
    notes.push('Low listing quality or no dollar values detected');
  }

  // Check for trusted domains
  const trustedDomains = ['cars.com', 'autotrader.com', 'carfax.com', 'edmunds.com', 'cargurus.com'];
  const foundDomains = trustedDomains.filter(domain => content.toLowerCase().includes(domain));
  
  if (foundDomains.length === 0) {
    trust -= 0.3;
    notes.push('Missing high-trust marketplace domains');
  } else if (foundDomains.length >= 2) {
    trust += 0.1;
    notes.push(`Found listings from ${foundDomains.length} trusted sources`);
  }

  // Check for specific mileage and dealer information
  const hasMileageInfo = content.includes('mi') || content.includes('mile');
  const hasDealerInfo = content.includes('dealer') || content.includes('certified');
  
  if (!hasMileageInfo) {
    trust -= 0.15;
    notes.push('Limited mileage information');
  }

  if (hasDealerInfo) {
    trust += 0.05;
    notes.push('Includes dealer information');
  }

  // Boost trust for high volume of listings
  if (marketListings.length > 8) {
    trust += 0.1;
    notes.push('High volume of comparable listings');
  } else if (marketListings.length < 3) {
    trust -= 0.2;
    notes.push('Limited comparable listings found');
  }

  // Check for price consistency (avoid outliers indicating hallucination)
  if (marketListings.length >= 3) {
    const prices = marketListings.map(l => l.price);
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length;
    const stdDev = Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - mean, 2), 0) / prices.length);
    const outliers = prices.filter(price => Math.abs(price - mean) > 2 * stdDev);
    
    if (outliers.length > prices.length * 0.3) {
      trust -= 0.2;
      notes.push('High price variance suggests unreliable data');
    }
  }

  // Check for obvious AI hallucination patterns
  if (content.includes('I cannot') || content.includes('I don\'t have access') || content.includes('I apologize')) {
    trust = 0.1;
    notes.push('AI response indicates limited capability');
  }

  return {
    trust: Math.max(0.1, Math.min(1.0, trust)),
    notes
  };
}

// Utility function to remove duplicate listings
function removeDuplicateListings(listings: MarketListing[]): MarketListing[] {
  const seen = new Set<string>();
  return listings.filter(listing => {
    // Create a unique key based on price, mileage, and source
    const key = `${listing.price}-${listing.mileage || 0}-${listing.source}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// Fallback function to create synthetic market data when no real listings found
function createFallbackListings(input: ValuationInput): MarketListing[] {
  // Create estimated price ranges based on vehicle specs
  const basePrice = getEstimatedBasePrice(input);
  const mileageVariance = input.mileage || 100000;
  
  const syntheticListings: MarketListing[] = [
    {
      id: `synthetic-low-${Date.now()}`,
      source: 'Market Estimate',
      source_type: 'estimated',
      price: Math.round(basePrice * 0.85), // 15% below base
      year: input.year || 2020,
      make: input.make || 'Unknown',
      model: input.model || 'Unknown',
      trim: input.trim,
      vin: undefined,
      mileage: mileageVariance + 10000, // Higher mileage = lower price
      condition: 'good',
      dealer_name: 'Market Analysis',
      location: input.zipCode,
      listing_url: '#synthetic-estimate',
      is_cpo: false,
      fetched_at: new Date().toISOString(),
      confidence_score: 30 // Low confidence for synthetic data
    },
    {
      id: `synthetic-mid-${Date.now()}`,
      source: 'Market Estimate',
      source_type: 'estimated', 
      price: basePrice, // Base price
      year: input.year || 2020,
      make: input.make || 'Unknown',
      model: input.model || 'Unknown',
      trim: input.trim,
      vin: undefined,
      mileage: mileageVariance,
      condition: 'good',
      dealer_name: 'Market Analysis',
      location: input.zipCode,
      listing_url: '#synthetic-estimate',
      is_cpo: false,
      fetched_at: new Date().toISOString(),
      confidence_score: 30
    },
    {
      id: `synthetic-high-${Date.now()}`,
      source: 'Market Estimate',
      source_type: 'estimated',
      price: Math.round(basePrice * 1.15), // 15% above base
      year: input.year || 2020,
      make: input.make || 'Unknown',
      model: input.model || 'Unknown',
      trim: input.trim,
      vin: undefined,
      mileage: Math.max(0, mileageVariance - 20000), // Lower mileage = higher price
      condition: 'excellent',
      dealer_name: 'Market Analysis',
      location: input.zipCode,
      listing_url: '#synthetic-estimate',
      is_cpo: true, // CPO for premium price
      fetched_at: new Date().toISOString(),
      confidence_score: 30
    }
  ];
  
  return syntheticListings;
}

// Estimate base price for a vehicle when no market data is available
function getEstimatedBasePrice(input: ValuationInput): number {
  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - (input.year || currentYear);
  
  // Base MSRP estimates by make (rough averages)
  const msrpEstimates: Record<string, number> = {
    'TOYOTA': 28000,
    'HONDA': 26000,
    'LEXUS': 45000,
    'BMW': 50000,
    'MERCEDES-BENZ': 55000,
    'AUDI': 48000,
    'NISSAN': 25000,
    'FORD': 30000,
    'CHEVROLET': 28000,
    'HYUNDAI': 24000,
    'KIA': 23000,
    'MAZDA': 25000,
    'SUBARU': 27000,
    'VOLKSWAGEN': 29000
  };
  
  const baseMsrp = msrpEstimates[input.make?.toUpperCase() || 'TOYOTA'] || 26000;
  
  // Apply depreciation
  const depreciationRate = vehicleAge <= 1 ? 0.20 : 
                          vehicleAge <= 3 ? 0.15 : 
                          vehicleAge <= 5 ? 0.10 : 0.08;
  
  const totalDepreciation = Math.min(0.70, vehicleAge * depreciationRate);
  const deprecatedValue = baseMsrp * (1 - totalDepreciation);
  
  // Apply mileage adjustment
  const expectedMileage = vehicleAge * 12000;
  const mileageDiff = (input.mileage || expectedMileage) - expectedMileage;
  const mileageAdjustment = (mileageDiff / 1000) * -100; // $100 per 1000 miles difference
  
  return Math.max(5000, deprecatedValue + mileageAdjustment);
}

// ===== GOOGLE-GRADE TIER-AWARE MARKET SEARCH =====

export async function fetchTieredListings(input: MarketQueryInput): Promise<EnrichedMarketListing[]> {
  console.log('🚀 [TIER-SEARCH] Starting Google-grade tiered market search for:', input);
  
  const allListings: EnrichedMarketListing[] = [];
  const searchPromises: Promise<void>[] = [];
  
  // Helper function to build tier-specific search queries
  const buildTierQuery = (category: string, tier: any, input: MarketQueryInput): string => {
    const baseQuery = `${input.year} ${input.make} ${input.model}`;
    const locationQuery = input.zipCode ? ` near ${input.zipCode}` : '';
    const vinQuery = input.vin ? ` VIN "${input.vin}"` : '';
    const mileageQuery = input.mileage ? ` ${input.mileage} miles` : '';
    
    // Build tier-specific site queries
    const siteQueries = tier.domains.map((domain: string) => `site:${domain}`).join(' OR ');
    
    return `(${siteQueries}) "${baseQuery}" for sale price mileage${vinQuery}${mileageQuery}${locationQuery}`;
  };

  // Helper function to extract tier info from source/domain
  const getTierInfo = (source: string, url?: string): { tier: 1 | 2 | 3; type: 'retail' | 'p2p' | 'auction'; trustWeight: number } => {
    const sourceKey = source.toLowerCase();
    const urlDomain = url ? new URL(url).hostname.toLowerCase() : '';

    // Check each category and tier
    for (const [categoryKey, category] of Object.entries(MARKET_SOURCE_TIERS)) {
      for (const [tierKey, tierData] of Object.entries(category)) {
        const tierNum = parseInt(tierKey.split('_')[1]) as 1 | 2 | 3;
        
        const matchesSource = tierData.sources.some((s: string) => 
          sourceKey.includes(s.toLowerCase()) || s.toLowerCase().includes(sourceKey)
        );
        const matchesDomain = tierData.domains.some((d: string) => 
          urlDomain.includes(d.toLowerCase()) || d.toLowerCase().includes(urlDomain)
        );
        
        if (matchesSource || matchesDomain) {
          return {
            tier: tierNum,
            type: tierData.type,
            trustWeight: tierData.trustWeight
          };
        }
      }
    }
    
    // Default to Tier 3 P2P if unmatched
    return { tier: 3, type: 'p2p', trustWeight: 0.55 };
  };

  // Process each tier category with retry logic
  const searchTier = async (categoryName: string, tierKey: string, tierData: any) => {
    try {
      const query = buildTierQuery(categoryName, tierData, input);
      console.log(`🔍 [TIER-SEARCH] ${categoryName} ${tierKey} query:`, query);
      
      const searchPayload = {
        query,
        max_tokens: 2000,
        saveToDb: true,
        vehicleData: {
          make: input.make,
          model: input.model,
          year: input.year,
          trim: input.trim,
          zipCode: input.zipCode,
          vin: input.vin
        },
        tierInfo: {
          category: categoryName,
          tier: parseInt(tierKey.split('_')[1]),
          type: tierData.type,
          trustWeight: tierData.trustWeight
        }
      };

      const { data: searchResult, error } = await supabase.functions.invoke('openai-web-search', {
        body: searchPayload
      });

      if (error) {
        console.error(`❌ [TIER-SEARCH] ${categoryName} ${tierKey} search failed:`, error);
        return;
      }

      if (searchResult?.listings && Array.isArray(searchResult.listings)) {
        const tierListings: EnrichedMarketListing[] = searchResult.listings.map((listing: any) => {
          const tierInfo = getTierInfo(listing.source || 'Unknown', listing.listing_url);
          
          return {
            source: listing.source || `${categoryName} ${tierKey}`,
            tier: tierInfo.tier,
            type: tierInfo.type,
            vin: listing.vin || undefined,
            year: listing.year || input.year,
            make: listing.make || input.make,
            model: listing.model || input.model,
            mileage: listing.mileage || 0,
            price: listing.price || 0,
            location: listing.location || input.zipCode,
            url: listing.listing_url,
            trustWeight: tierInfo.trustWeight
          };
        }).filter((listing: EnrichedMarketListing) => 
          listing.price > 1000 && listing.price < 500000 // Sanity check
        );

        allListings.push(...tierListings);
        console.log(`✅ [TIER-SEARCH] ${categoryName} ${tierKey}: Found ${tierListings.length} listings`);
      } else {
        console.log(`⚠️ [TIER-SEARCH] ${categoryName} ${tierKey}: No listings returned`);
      }
    } catch (error) {
      console.error(`💥 [TIER-SEARCH] ${categoryName} ${tierKey} exception:`, error);
    }
  };

  // Launch parallel searches across all tiers (with rate limiting)
  const batchSize = 3; // Limit concurrent searches to avoid rate limits
  let currentBatch = 0;

  for (const [categoryName, category] of Object.entries(MARKET_SOURCE_TIERS)) {
    for (const [tierKey, tierData] of Object.entries(category)) {
      searchPromises.push(searchTier(categoryName, tierKey, tierData));
      
      // Process in batches to avoid overwhelming the API
      if (searchPromises.length >= batchSize) {
        await Promise.allSettled(searchPromises.splice(0, batchSize));
        currentBatch++;
        console.log(`📊 [TIER-SEARCH] Completed batch ${currentBatch}`);
        
        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }

  // Process remaining searches
  if (searchPromises.length > 0) {
    await Promise.allSettled(searchPromises);
    console.log(`📊 [TIER-SEARCH] Completed final batch`);
  }

  // Deduplicate and prioritize by tier
  const deduplicatedListings = deduplicateEnrichedListings(allListings);
  
  // Sort by tier priority (Tier 1 first) and trust weight
  const prioritizedListings = deduplicatedListings.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier; // Tier 1 before Tier 2, etc.
    return b.trustWeight - a.trustWeight; // Higher trust weight first within tier
  });

  // Limit to top 20 results
  const finalListings = prioritizedListings.slice(0, 20);

  console.log('🎯 [TIER-SEARCH] Final results:', {
    totalFound: allListings.length,
    afterDeduplication: deduplicatedListings.length,
    finalCount: finalListings.length,
    tierBreakdown: {
      tier1: finalListings.filter(l => l.tier === 1).length,
      tier2: finalListings.filter(l => l.tier === 2).length,
      tier3: finalListings.filter(l => l.tier === 3).length
    },
    typeBreakdown: {
      retail: finalListings.filter(l => l.type === 'retail').length,
      p2p: finalListings.filter(l => l.type === 'p2p').length,
      auction: finalListings.filter(l => l.type === 'auction').length
    }
  });

  return finalListings;
}

// Enhanced deduplication for enriched listings
function deduplicateEnrichedListings(listings: EnrichedMarketListing[]): EnrichedMarketListing[] {
  const seen = new Map<string, EnrichedMarketListing>();
  
  listings.forEach(listing => {
    // Create multiple deduplication keys
    const priceKey = `price_${listing.price}_${listing.mileage}`;
    const vinKey = listing.vin ? `vin_${listing.vin}` : null;
    const urlKey = listing.url ? `url_${listing.url}` : null;
    
    const keys = [priceKey, vinKey, urlKey].filter(Boolean) as string[];
    
    let isDuplicate = false;
    for (const key of keys) {
      if (seen.has(key)) {
        const existingListing = seen.get(key)!;
        // Keep the listing with higher trust weight
        if (listing.trustWeight > existingListing.trustWeight) {
          // Remove the old entry and update with new one
          for (const oldKey of keys) {
            if (seen.get(oldKey) === existingListing) {
              seen.delete(oldKey);
            }
          }
          break; // Will add new listing below
        } else {
          isDuplicate = true;
          break;
        }
      }
    }
    
    if (!isDuplicate) {
      keys.forEach(key => seen.set(key, listing));
    }
  });
  
  return Array.from(new Set(seen.values()));
}