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
}

export async function fetchMarketComps(input: ValuationInput): Promise<MarketSearchResult> {
  try {
    console.log('🔍 Market Search Agent: Fetching real-time listings via OpenAI for:', {
      vin: input.vin,
      make: input.make,
      model: input.model,
      year: input.year,
      zipCode: input.zipCode
    });

    // First, try to get existing market listings from database
    const { data: existingListings, error } = await supabase
      .from('market_listings')
      .select('*')
      .eq('make', input.make)
      .eq('model', input.model)
      .eq('year', input.year)
      .order('fetched_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('❌ Error fetching market listings:', error);
    }

    if (existingListings && existingListings.length > 0) {
      console.log('📊 Found', existingListings.length, 'existing market listings');
      return {
        listings: existingListings.map(transformToMarketListing),
        trust: 0.85, // Database listings have high trust
        notes: ['Using verified database listings'],
        source: 'database'
      };
    }

    // Use OpenAI web search to find live listings with enhanced query and trust scoring
    console.log('🤖 Fetching live market listings via OpenAI web search...');
    
    // Enhanced query with VIN-specific search if available - prioritize VIN matches
    let query = '';
    
    if (input.vin) {
      // VIN-specific search with high priority
      query = `"${input.vin}" OR VIN ${input.vin}`;
      
      // Add brand-specific dealer sites for VIN search
      if (input.make === 'Toyota') {
        query += ` site:rosevilletoyota.com OR site:toyota.com OR "Toyota dealer"`;
      } else if (input.make === 'Honda') {
        query += ` site:honda.com OR "Honda dealer"`;
      }
      
      query += ` "${input.year} ${input.make} ${input.model}" for sale near ${input.zipCode}`;
    } else {
      // Fallback to model-based search
      query = `Find used ${input.year} ${input.make} ${input.model} ${input.trim || ''} vehicles for sale near ZIP ${input.zipCode}`;
      
      // Add specific dealership networks likely to have this vehicle
      if (input.make === 'Toyota') {
        query += ` site:toyota.com OR "Toyota dealer"`;
      } else if (input.make === 'Honda') {
        query += ` site:honda.com OR "Honda dealer"`;
      }
    }
    
    query += `. Include exact prices, mileage, and source websites like Cars.com, AutoTrader, CarGurus, Edmunds, CarMax, CarSense, dealer websites. Focus on listings with ${input.mileage ? `around ${input.mileage.toLocaleString()} miles` : 'similar mileage'}. Show specific dollar amounts, dealer names, and package information.`;
    
    const { data: searchResult, error: searchError } = await supabase.functions.invoke('openai-web-search', {
      body: { 
        query,
        max_tokens: 3000, // Increased for more detailed responses
        saveToDb: true,
        vehicleData: {
          make: input.make,
          model: input.model,
          year: input.year,
          trim: input.trim,
          zipCode: input.zipCode
        }
      }
    });

    if (searchError) {
      console.error('❌ Error calling OpenAI web search:', searchError);
      return {
        listings: [],
        trust: 0.0,
        notes: ['OpenAI search failed'],
        source: 'error'
      };
    }

    const content = searchResult?.content || searchResult?.result || '';
    
    // Use saved listings from database if available
    let marketListings: MarketListing[] = [];
    if (searchResult?.listings && searchResult.listings.length > 0) {
      marketListings = searchResult.listings.map(transformToMarketListing);
      console.log('✅ Using freshly saved market listings from database:', marketListings.length);
    } else {
      // Fallback to parsing from content
      const parsedListings = parseVehicleListingsFromWeb(content);
      marketListings = parsedListings.map(listing => transformParsedToMarketListing(listing, input));
      console.log('⚠️ Fallback to parsed listings from content:', marketListings.length);
    }

    // Calculate trust score based on response quality
    const trustResult = calculateTrustScore(content, [], marketListings);

    console.log('✅ OpenAI market search completed, got', marketListings.length, 'listings with trust score:', trustResult.trust);
    return {
      listings: marketListings,
      trust: trustResult.trust,
      notes: trustResult.notes,
      source: 'openai_web_search'
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