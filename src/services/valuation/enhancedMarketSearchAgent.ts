// Enhanced Market Search Agent - Facebook & Craigslist via OpenAI Web Search
import { supabase } from "@/integrations/supabase/client";
import type { UnifiedValuationResult, MarketListing } from "@/types/valuation";

export interface EnhancedMarketListing {
  title: string;
  price: number;
  mileage?: number;
  city?: string;
  state?: string;
  postDate?: string;
  url: string;
  vin?: string;
  dealer?: boolean;
  source: 'facebook' | 'craigslist' | 'offerup' | 'ebay' | 'amazon' | 'autotrader' | 'cars' | 'other';
  sellerType?: 'dealer' | 'private';
}

export interface FacebookCraigslistSearchInput {
  vin: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  zipCode: string;
  mileage: number;
}

export interface EnhancedMarketSearchResult {
  enrichedListings: EnhancedMarketListing[];
  listingSources: string[];
  platformBreakdown: Record<string, number>;
  listingCount: number;
  anchoredValue?: number;
  confidenceBoost: number;
  searchQueries: string[];
  notes: string[];
}

export async function fetchFacebookCraigslistEnrichment(
  input: FacebookCraigslistSearchInput
): Promise<EnhancedMarketSearchResult> {
  console.log('🔍 [ENHANCED_MARKET_SEARCH] Starting Facebook & Craigslist enrichment:', input);

  const searchQueries: string[] = [];
  const notes: string[] = [];
  let enrichedListings: EnhancedMarketListing[] = [];
  const platformBreakdown: Record<string, number> = {};

  try {
    // Generate search queries for all platforms
    const facebookQuery = generateFacebookMarketplaceQuery(input);
    const craigslistQuery = generateCraigslistQuery(input);
    const offerUpQuery = generateOfferUpQuery(input);
    const ebayQuery = generateEbayMotorsQuery(input);
    const amazonQuery = generateAmazonAutosQuery(input);

    searchQueries.push(facebookQuery, craigslistQuery, offerUpQuery, ebayQuery, amazonQuery);

    // Execute searches in parallel for maximum efficiency
    console.log('🔍 Executing multi-platform enhanced search...');
    const [facebookListings, craigslistListings, offerUpListings, ebayListings, amazonListings] = await Promise.all([
      executeOpenAIWebSearch(facebookQuery, 'facebook'),
      executeOpenAIWebSearch(craigslistQuery, 'craigslist'),
      executeOpenAIWebSearch(offerUpQuery, 'offerup'),
      executeOpenAIWebSearch(ebayQuery, 'ebay'),
      executeOpenAIWebSearch(amazonQuery, 'amazon')
    ]);

    // Combine all listings
    enrichedListings.push(...facebookListings, ...craigslistListings, ...offerUpListings, ...ebayListings, ...amazonListings);

    // Track platform breakdown
    platformBreakdown.facebook = facebookListings.length;
    platformBreakdown.craigslist = craigslistListings.length;
    platformBreakdown.offerup = offerUpListings.length;
    platformBreakdown.ebay = ebayListings.length;
    platformBreakdown.amazon = amazonListings.length;

    notes.push(`Found ${facebookListings.length} Facebook, ${craigslistListings.length} Craigslist, ${offerUpListings.length} OfferUp, ${ebayListings.length} eBay, ${amazonListings.length} Amazon listings`);

    // Filter and validate listings
    enrichedListings = filterAndValidateListings(enrichedListings, input);

    // Calculate anchored value if we have sufficient listings
    let anchoredValue: number | undefined;
    let confidenceBoost = 0;

    if (enrichedListings.length >= 3) {
      const prices = enrichedListings.map(l => l.price);
      anchoredValue = prices.reduce((sum, price) => sum + price, 0) / prices.length;
      confidenceBoost = Math.min(15, enrichedListings.length * 2); // Up to 15 point boost
      notes.push(`Calculated anchored value: $${Math.round(anchoredValue).toLocaleString()}`);
    } else {
      notes.push('Insufficient listings for value anchoring');
    }

    // Store listings in database for future reference
    await storeBatchListings(enrichedListings, input);

    const result: EnhancedMarketSearchResult = {
      enrichedListings,
      listingSources: ['Facebook', 'Craigslist', 'OfferUp', 'eBay', 'Amazon'],
      platformBreakdown,
      listingCount: enrichedListings.length,
      anchoredValue,
      confidenceBoost,
      searchQueries,
      notes
    };

    console.log('✅ Enhanced market search completed:', {
      totalListings: enrichedListings.length,
      anchoredValue,
      confidenceBoost,
      sources: result.listingSources
    });

    return result;

  } catch (error) {
    console.error('❌ Enhanced market search failed:', error);
    return {
      enrichedListings: [],
      listingSources: [],
      platformBreakdown: {},
      listingCount: 0,
      confidenceBoost: 0,
      searchQueries,
      notes: [`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`]
    };
  }
}

function generateFacebookMarketplaceQuery(input: FacebookCraigslistSearchInput): string {
  const mileageRange = `${Math.round(input.mileage * 0.8)}-${Math.round(input.mileage * 1.2)}`;
  
  return `Search Facebook Marketplace for real listings matching:
- Year: ${input.year}
- Make: ${input.make}
- Model: ${input.model}
- Location: ZIP ${input.zipCode}
- Mileage range: ${mileageRange} miles
${input.trim ? `- Trim: ${input.trim}` : ''}

Return JSON list of up to 10 REAL listings with:
- title
- price (USD, numbers only)
- mileage (numbers only)
- city/state
- listing URL
- post date
- dealer vs private
- VIN (if shown)

Filter spam. Only include listings with clear year ${input.year} and valid mileage.
Use site:facebook.com/marketplace search syntax.`;
}

function generateCraigslistQuery(input: FacebookCraigslistSearchInput): string {
  // Determine Craigslist region based on ZIP code (simplified mapping)
  const craigslistRegion = getCraigslistRegion(input.zipCode);
  const mileageRange = `${Math.round(input.mileage * 0.8)}-${Math.round(input.mileage * 1.2)}`;

  return `Search Craigslist ${craigslistRegion} for listings matching:
- Year: ${input.year}
- Make: ${input.make}  
- Model: ${input.model}
- Location: ZIP ${input.zipCode} area
- Mileage: ~${input.mileage} miles (±20%)
${input.trim ? `- Trim: ${input.trim}` : ''}

Return structured JSON list of up to 10 real listings with:
- title
- price (USD)
- mileage
- location
- posting date
- listing URL

Avoid spam posts. Prioritize dealer/private clarity.
Use site:${craigslistRegion}.craigslist.org search syntax.`;
}

function generateOfferUpQuery(input: FacebookCraigslistSearchInput): string {
  const mileageRange = `${Math.round(input.mileage * 0.8)}-${Math.round(input.mileage * 1.2)}`;
  
  return `Search OfferUp for used ${input.year} ${input.make} ${input.model} listings near ZIP code ${input.zipCode}, with mileage around ${input.mileage} miles.

Return a JSON array with:
- title
- price (USD, numbers only)
- mileage (numbers only) 
- location (city/state)
- post date
- listing URL
- seller type (dealer/private)
${input.trim ? `- trim: ${input.trim}` : ''}

Filter out irrelevant or vague results. Focus on accurate, detailed vehicle listings with mileage range ${mileageRange}.
Use site:offerup.com search syntax.`;
}

function generateEbayMotorsQuery(input: FacebookCraigslistSearchInput): string {
  const mileageRange = `${Math.round(input.mileage * 0.8)}-${Math.round(input.mileage * 1.2)}`;
  
  return `Search eBay Motors for used ${input.year} ${input.make} ${input.model} listings with mileage around ${input.mileage}, located near ZIP ${input.zipCode} (within 100 miles).

Return a structured JSON list with:
- title
- BIN price or current bid (USD, numbers only)
- mileage (numbers only)
- city/state
- post/sale date
- listing URL
- seller type (dealer/private)
${input.trim ? `- trim: ${input.trim}` : ''}

Only return clearly identified vehicle listings, no parts/accessories. Mileage range ${mileageRange} preferred.
Use site:ebay.com/motors search syntax.`;
}

function generateAmazonAutosQuery(input: FacebookCraigslistSearchInput): string {
  return `Search Amazon for listings under "Amazon Autos" for a ${input.year} ${input.make} ${input.model}, ZIP ${input.zipCode}.

Return any vehicle matches with:
- title
- price (USD, numbers only)
- mileage (if available, numbers only)
- location or delivery region
- URL
${input.trim ? `- trim: ${input.trim}` : ''}

If no listings found, return empty array. Use site:amazon.com search syntax.`;
}

function getCraigslistRegion(zipCode: string): string {
  // Simplified ZIP to Craigslist region mapping
  const zip = parseInt(zipCode);
  
  if (zip >= 94000 && zip <= 95000) return 'sfbay';
  if (zip >= 90000 && zip <= 93000) return 'losangeles';
  if (zip >= 10000 && zip <= 14000) return 'newyork';
  if (zip >= 60000 && zip <= 61000) return 'chicago';
  if (zip >= 77000 && zip <= 78000) return 'houston';
  if (zip >= 85000 && zip <= 86000) return 'phoenix';
  if (zip >= 19000 && zip <= 20000) return 'philadelphia';
  if (zip >= 78000 && zip <= 79000) return 'sanantonio';
  if (zip >= 92000 && zip <= 93000) return 'sandiego';
  if (zip >= 75000 && zip <= 76000) return 'dallas';
  
  // Default to most populous region
  return 'sfbay';
}

async function executeOpenAIWebSearch(
  query: string, 
  source: 'facebook' | 'craigslist' | 'offerup' | 'ebay' | 'amazon'
): Promise<EnhancedMarketListing[]> {
  try {
    console.log(`🔍 Executing ${source} search with OpenAI...`);
    
    const { data: searchResult, error } = await supabase.functions.invoke('openai-web-search', {
      body: {
        query,
        max_tokens: 4000,
        temperature: 0.1,
        extractListings: true,
        source: source
      }
    });

    if (error) {
      console.error(`❌ ${source} search failed:`, error);
      return [];
    }

    if (!searchResult?.listings) {
      console.warn(`⚠️ No listings returned from ${source} search`);
      return [];
    }

    // Transform to EnhancedMarketListing format
    const listings: EnhancedMarketListing[] = searchResult.listings
      .filter((listing: { price?: number }) => listing.price && listing.price > 1000) // Filter obvious junk
      .map((listing: {
        title?: string;
        year?: number;
        make?: string;
        model?: string;
        price?: number;
        mileage?: number;
        city?: string;
        location?: string;
        state?: string;
        postDate?: string;
        date?: string;
        url?: string;
        vin?: string;
        dealer?: boolean | string;
      }) => ({
        title: listing.title || `${listing.year || ''} ${listing.make || ''} ${listing.model || ''}`.trim(),
        price: parseFloat(String(listing.price)) || 0,
        mileage: listing.mileage ? parseInt(String(listing.mileage)) : undefined,
        city: listing.city || listing.location,
        state: listing.state,
        postDate: listing.postDate || listing.date,
        url: listing.url || '#',
        vin: listing.vin,
        dealer: listing.dealer === true || listing.dealer === 'true',
        sellerType: listing.dealer === true || listing.dealer === 'true' ? 'dealer' : 'private',
        source: source
      }))
      .filter((listing: EnhancedMarketListing) => listing.price > 0); // Final price validation

    console.log(`✅ ${source} search completed: ${listings.length} valid listings`);
    return listings;

  } catch (error) {
    console.error(`❌ ${source} search exception:`, error);
    return [];
  }
}

function filterAndValidateListings(
  listings: EnhancedMarketListing[], 
  input: FacebookCraigslistSearchInput
): EnhancedMarketListing[] {
  return listings.filter(listing => {
    // Price validation (reasonable range)
    if (listing.price < 2000 || listing.price > 200000) return false;
    
    // Mileage validation (if available)
    if (listing.mileage && (listing.mileage < 1000 || listing.mileage > 500000)) return false;
    
    // Title relevance check
    const titleLower = listing.title.toLowerCase();
    const makeLower = input.make.toLowerCase();
    const modelLower = input.model.toLowerCase();
    
    if (!titleLower.includes(makeLower) && !titleLower.includes(modelLower)) return false;
    
    // Year validation (if extractable from title)
    const yearInTitle = listing.title.match(/\b(19|20)\d{2}\b/);
    if (yearInTitle && Math.abs(parseInt(yearInTitle[0]) - input.year) > 2) return false;
    
    return true;
  });
}

async function storeBatchListings(
  listings: EnhancedMarketListing[], 
  input: FacebookCraigslistSearchInput
): Promise<void> {
  if (listings.length === 0) return;
  
  try {
    const dbListings = listings.map(listing => ({
      source: listing.source,
      source_type: 'marketplace',
      price: listing.price,
      year: input.year,
      make: input.make,
      model: input.model,
      trim: input.trim,
      vin: listing.vin,
      mileage: listing.mileage,
      dealer_name: listing.dealer ? 'Dealer' : 'Private',
      location: listing.city ? `${listing.city}, ${listing.state || ''}` : input.zipCode,
      listing_url: listing.url,
      is_cpo: false,
      confidence_score: 80,
      zip_code: input.zipCode,
      geo_distance_miles: null,
      valuation_request_id: null
    }));

    const { error } = await supabase
      .from('enhanced_market_listings')
      .insert(dbListings);
      
    if (error) {
      console.warn('⚠️ Failed to store enhanced listings:', error);
    } else {
      console.log(`✅ Stored ${dbListings.length} enhanced listings to database`);
    }
  } catch (error) {
    console.warn('⚠️ Error storing enhanced listings:', error);
  }
}

// Transform enhanced listings to standard MarketListing format for compatibility
export function transformToMarketListings(
  enrichedListings: EnhancedMarketListing[], 
  input: FacebookCraigslistSearchInput
): MarketListing[] {
  return enrichedListings.map(listing => ({
    id: `enhanced-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: listing.source,
    source_type: 'marketplace',
    price: listing.price,
    year: input.year,
    make: input.make,
    model: input.model,
    trim: input.trim,
    vin: listing.vin,
    mileage: listing.mileage,
    condition: undefined,
    dealer_name: listing.dealer ? 'Dealer' : 'Private',
    location: listing.city ? `${listing.city}, ${listing.state || ''}` : input.zipCode,
    listing_url: listing.url,
    is_cpo: false,
    fetched_at: new Date().toISOString(),
    confidence_score: 85 // High confidence for Facebook/Craigslist listings
  }));
}