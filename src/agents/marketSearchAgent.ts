// Market Search Agent - Fetches real-time market data via OpenAI Web Search
import { supabase } from "@/integrations/supabase/client";
import { ValuationInput, MarketListing } from "@/types/valuation";
import { parseVehicleListingsFromWeb, type ParsedListing } from "@/utils/parsers/listingParser";

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
    console.log('🔍 Market Search Agent: Starting market search for:', {
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipCode
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
    
    // Try OpenAI web search if available
    let webSearchResult: any = null;
    try {
      const { data: searchResult, error: searchError } = await supabase.functions.invoke('openai-web-search', {
        body: { 
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
        }
      });
      
      if (!searchError && searchResult) {
        webSearchResult = searchResult;
        console.log('✅ Web search completed successfully');
      }
    } catch (searchError) {
      console.warn('⚠️ Web search failed, will use fallback approach:', searchError);
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

    // Fallback for when no listings are found - create synthetic market data
    if (finalListings.length === 0) {
      console.log('⚠️ No market listings found, using synthetic fallback data');
      const syntheticListings = createFallbackListings(input);
      return {
        listings: syntheticListings,
        trust: 0.3, // Low trust for synthetic data
        notes: ['No real market data found', 'Using estimated market range based on vehicle specs'],
        source: 'synthetic_fallback',
        exactVinMatch: null
      };
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