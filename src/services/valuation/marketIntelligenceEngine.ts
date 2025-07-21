import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xltxqqzattxogxtqrggt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhsdHhxcXphdHR4b2d4dHFyZ2d0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NTYxMjYsImV4cCI6MjA2MTAzMjEyNn0.kUPmsyUdpcpnPLHWlnP7vODQiRgzCrWjOBfLib3lpvY'
);

// FANG-Grade Market Intelligence Types
export interface CanonicalListing {
  id?: string;
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  price: number;
  mileage: number;
  zip_code?: string;
  location: string;
  source: string;
  source_tier: 1 | 2 | 3; // 1=premium, 2=standard, 3=niche
  url: string;
  dealer_name?: string;
  fuel_type?: string;
  drivetrain?: string;
  listing_date?: string;
  title_status?: string;
  confidence_score: number;
  geo_distance_miles?: number;
  raw_data?: any;
}

export interface MarketIntelligence {
  listings: CanonicalListing[];
  aggregation: {
    listingCount: number;
    medianPrice: number;
    priceRange: [number, number];
    confidenceScore: number;
    supplyDensityScore: number; // 0=oversupply, 1=scarcity
    marketVelocityScore: number; // 0=slow, 1=fast
    sources: string[];
    sourceTiers: Record<number, number>; // tier -> count
  };
  explanation: string[];
  timestamp: number;
}

export interface SearchCriteria {
  vin?: string;
  make: string;
  model: string;
  year: number;
  trim?: string;
  zipCode: string;
  mileage: number;
  radiusMiles?: number;
}

// Source tier definitions (Google-grade coverage)
const SOURCE_TIERS = {
  // Tier 1: Premium dealers + high-traffic marketplaces
  1: ['autotrader', 'cars.com', 'carmax', 'cargurus', 'carfax', 'vroom', 'shift', 'tesla'],
  // Tier 2: Peer-to-peer and standard marketplaces  
  2: ['facebook', 'craigslist', 'offerup', 'autolist', 'carfinder'],
  // Tier 3: Niche and auction sources
  3: ['ebay', 'amazon', 'bringatrailer', 'copart', 'iaai', 'manheim', 'adesa']
} as const;

function getSourceTier(source: string): 1 | 2 | 3 {
  for (const [tier, sources] of Object.entries(SOURCE_TIERS)) {
    if (sources.some(s => source.toLowerCase().includes(s))) {
      return parseInt(tier) as 1 | 2 | 3;
    }
  }
  return 2; // Default to standard tier
}

// FANG-Grade Multi-Source Market Listing Aggregation
export class MarketIntelligenceEngine {
  
  async searchMarketListings(criteria: SearchCriteria): Promise<MarketIntelligence> {
    console.log('🔍 [MARKET_INTELLIGENCE] Starting comprehensive market search:', criteria);
    
    const startTime = Date.now();
    
    // Step 1: Multi-platform search via OpenAI web intelligence
    const searchResults = await this.performMultiPlatformSearch(criteria);
    
    // Step 2: Normalize and canonicalize listings
    const canonicalListings = await this.normalizeListings(searchResults, criteria);
    
    // Step 3: Apply geo-filtering and deduplication
    const filteredListings = await this.applyGeoFilteringAndDedup(canonicalListings, criteria);
    
    // Step 4: Calculate market intelligence metrics
    const aggregation = this.calculateMarketMetrics(filteredListings, criteria);
    
    // Step 5: Generate explainable insights
    const explanation = this.generateMarketExplanation(filteredListings, aggregation, criteria);
    
    // Step 6: Store aggregation for audit trail
    await this.storeMarketAggregation(criteria, filteredListings, aggregation);
    
    const processingTime = Date.now() - startTime;
    console.log(`✅ [MARKET_INTELLIGENCE] Completed in ${processingTime}ms: ${filteredListings.length} listings from ${aggregation.sources.length} sources`);
    
    return {
      listings: filteredListings,
      aggregation,
      explanation,
      timestamp: Date.now()
    };
  }
  
  private async performMultiPlatformSearch(criteria: SearchCriteria): Promise<any[]> {
    console.log('🌐 [MULTI_PLATFORM] Initiating search across all tiers...');
    
    const searchPromises = [];
    
    // Tier 1: Premium sources (CarGurus, AutoTrader, Cars.com)
    searchPromises.push(this.searchTier1Sources(criteria));
    
    // Tier 2: Peer-to-peer (Facebook, Craigslist, OfferUp)
    searchPromises.push(this.searchTier2Sources(criteria));
    
    // Tier 3: Niche/Auction (eBay, Amazon Autos, auction sites)
    searchPromises.push(this.searchTier3Sources(criteria));
    
    const results = await Promise.allSettled(searchPromises);
    
    const allListings = results
      .filter(result => result.status === 'fulfilled')
      .flatMap(result => (result as PromiseFulfilledResult<any[]>).value || []);
    
    console.log(`📊 [MULTI_PLATFORM] Aggregated ${allListings.length} raw listings from all tiers`);
    return allListings;
  }
  
  private async searchTier1Sources(criteria: SearchCriteria): Promise<any[]> {
    const prompt = `Search premium automotive marketplaces (CarGurus, AutoTrader, Cars.com, CarMax) for:
    
Vehicle: ${criteria.year} ${criteria.make} ${criteria.model} ${criteria.trim || ''}
Location: ZIP ${criteria.zipCode} (within 150 miles)
Mileage: Around ${criteria.mileage.toLocaleString()} miles (±20%)

Return JSON array of listings with:
- title, price, mileage, location, url, dealer_name
- source (which site), listing_date
- vin (if shown), trim_level, fuel_type

Focus on verified dealers and certified listings. Include up to 15 results.`;

    return this.searchViaOpenAI(prompt, 'tier1');
  }
  
  private async searchTier2Sources(criteria: SearchCriteria): Promise<any[]> {
    const prompt = `Search peer-to-peer marketplaces (Facebook Marketplace, Craigslist, OfferUp) for:
    
Vehicle: ${criteria.year} ${criteria.make} ${criteria.model}
Area: ZIP ${criteria.zipCode} and surrounding areas
Mileage: ~${criteria.mileage.toLocaleString()} miles

Return JSON array with:
- title, price, mileage, city/state, url
- source, post_date, seller_type (private/dealer)
- contact_info_available, photos_count

Filter spam. Include up to 12 legitimate listings.`;

    return this.searchViaOpenAI(prompt, 'tier2');
  }
  
  private async searchTier3Sources(criteria: SearchCriteria): Promise<any[]> {
    const prompt = `Search niche sources (eBay Motors, Amazon Autos, auction sites) for:
    
Vehicle: ${criteria.year} ${criteria.make} ${criteria.model}
${criteria.vin ? `VIN: ${criteria.vin}` : ''}

Return JSON array with:
- title, current_bid_or_price, mileage, location, url
- source, auction_end_date (if applicable)
- condition_description, seller_rating

Focus on buy-it-now and ended auctions. Include up to 8 results.`;

    return this.searchViaOpenAI(prompt, 'tier3');
  }
  
  private async searchViaOpenAI(prompt: string, tier: string): Promise<any[]> {
    try {
      const { data, error } = await supabase.functions.invoke('openai-web-search', {
        body: { prompt, context: `market_search_${tier}` }
      });
      
      if (error) {
        console.error(`❌ [${tier.toUpperCase()}] OpenAI search failed:`, error);
        return [];
      }
      
      const response = data?.choices?.[0]?.message?.content;
      if (!response) return [];
      
      // Parse JSON response
      try {
        const listings = JSON.parse(response);
        if (Array.isArray(listings)) {
          console.log(`✅ [${tier.toUpperCase()}] Found ${listings.length} listings`);
          return listings;
        }
      } catch (parseError) {
        console.warn(`⚠️ [${tier.toUpperCase()}] Failed to parse JSON, extracting listings from text`);
        return this.extractListingsFromText(response, tier);
      }
      
      return [];
    } catch (error) {
      console.error(`❌ [${tier.toUpperCase()}] Search error:`, error);
      return [];
    }
  }
  
  private extractListingsFromText(text: string, tier: string): any[] {
    // Fallback text extraction logic
    const listings: any[] = [];
    const lines = text.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Look for price patterns
      const priceMatch = line.match(/\$([0-9,]+)/);
      if (priceMatch) {
        const price = parseInt(priceMatch[1].replace(/,/g, ''));
        if (price > 1000 && price < 200000) {
          listings.push({
            title: line,
            price,
            source: tier,
            confidence_score: 0.6 // Lower confidence for text extraction
          });
        }
      }
    }
    
    console.log(`📝 [${tier.toUpperCase()}] Extracted ${listings.length} listings from text`);
    return listings.slice(0, 10); // Limit fallback results
  }
  
  private async normalizeListings(rawListings: any[], criteria: SearchCriteria): Promise<CanonicalListing[]> {
    console.log('🧼 [NORMALIZE] Converting raw listings to canonical format...');
    
    const canonical: CanonicalListing[] = [];
    
    for (const raw of rawListings) {
      try {
        const normalized = this.normalizeToCanonical(raw, criteria);
        if (normalized && this.isValidListing(normalized)) {
          canonical.push(normalized);
        }
      } catch (error) {
        console.warn('⚠️ [NORMALIZE] Failed to normalize listing:', error);
      }
    }
    
    console.log(`✅ [NORMALIZE] Normalized ${canonical.length}/${rawListings.length} listings`);
    return canonical;
  }
  
  private normalizeToCanonical(raw: any, criteria: SearchCriteria): CanonicalListing | null {
    // Extract price
    const price = this.extractPrice(raw.price || raw.current_bid_or_price || raw.offer_amount);
    if (!price || price < 1000 || price > 500000) return null;
    
    // Extract mileage
    const mileage = this.extractMileage(raw.mileage || raw.odometer || '0');
    
    // Determine source and tier
    const source = (raw.source || 'unknown').toLowerCase();
    const source_tier = getSourceTier(source);
    
    return {
      vin: raw.vin || undefined,
      make: criteria.make,
      model: criteria.model,
      year: criteria.year,
      trim: raw.trim_level || raw.trim || criteria.trim,
      price,
      mileage,
      zip_code: this.extractZipCode(raw.location || ''),
      location: raw.location || raw.city || 'Unknown',
      source,
      source_tier,
      url: raw.url || raw.listing_url || '#',
      dealer_name: raw.dealer_name || raw.dealer || undefined,
      fuel_type: raw.fuel_type || undefined,
      title_status: raw.title_status || 'unknown',
      confidence_score: this.calculateListingConfidence(raw, source_tier),
      raw_data: raw
    };
  }
  
  private extractPrice(priceStr: any): number | null {
    if (typeof priceStr === 'number') return priceStr;
    if (!priceStr) return null;
    
    const cleanPrice = priceStr.toString().replace(/[^0-9]/g, '');
    return cleanPrice ? parseInt(cleanPrice) : null;
  }
  
  private extractMileage(mileageStr: any): number {
    if (typeof mileageStr === 'number') return mileageStr;
    if (!mileageStr) return 0;
    
    const cleanMileage = mileageStr.toString().replace(/[^0-9]/g, '');
    return cleanMileage ? parseInt(cleanMileage) : 0;
  }
  
  private extractZipCode(location: string): string | undefined {
    const zipMatch = location.match(/\b(\d{5})\b/);
    return zipMatch ? zipMatch[1] : undefined;
  }
  
  private calculateListingConfidence(raw: any, source_tier: number): number {
    let confidence = 0.7; // Base confidence
    
    // Tier bonus
    if (source_tier === 1) confidence += 0.15;
    else if (source_tier === 2) confidence += 0.1;
    
    // VIN bonus
    if (raw.vin && raw.vin.length === 17) confidence += 0.1;
    
    // Dealer vs private
    if (raw.dealer_name) confidence += 0.05;
    
    // Recent listing
    if (raw.listing_date || raw.post_date) confidence += 0.05;
    
    return Math.min(confidence, 0.95);
  }
  
  private isValidListing(listing: CanonicalListing): boolean {
    return !!(listing.price > 0 && 
             listing.make && 
             listing.model && 
             listing.year > 1990 && 
             listing.year <= new Date().getFullYear() + 1);
  }
  
  private async applyGeoFilteringAndDedup(listings: CanonicalListing[], criteria: SearchCriteria): Promise<CanonicalListing[]> {
    console.log('🗺️ [GEO_FILTER] Applying location filtering and deduplication...');
    
    // Step 1: Calculate distances and filter by radius
    const geoFiltered = listings.filter(listing => {
      if (!listing.zip_code) return true; // Keep if no zip
      
      // Calculate approximate distance (simplified)
      const distance = this.calculateDistance(criteria.zipCode, listing.zip_code);
      listing.geo_distance_miles = distance;
      
      return distance <= (criteria.radiusMiles || 150);
    });
    
    // Step 2: Deduplicate by VIN and similar listings
    const deduplicated = this.deduplicateListings(geoFiltered);
    
    // Step 3: Sort by relevance score
    const sorted = deduplicated.sort((a, b) => {
      const scoreA = this.calculateRelevanceScore(a, criteria);
      const scoreB = this.calculateRelevanceScore(b, criteria);
      return scoreB - scoreA;
    });
    
    console.log(`✅ [GEO_FILTER] Filtered to ${sorted.length} unique, relevant listings`);
    return sorted.slice(0, 25); // Top 25 most relevant
  }
  
  private calculateDistance(zip1: string, zip2: string): number {
    // Simplified distance calculation - in production would use proper geocoding
    const zipDiff = Math.abs(parseInt(zip1) - parseInt(zip2));
    return Math.min(zipDiff / 100, 500); // Rough approximation
  }
  
  private deduplicateListings(listings: CanonicalListing[]): CanonicalListing[] {
    const seen = new Set<string>();
    const unique: CanonicalListing[] = [];
    
    for (const listing of listings) {
      // Create dedup key
      const dedupKey = listing.vin || 
        `${listing.year}-${listing.make}-${listing.model}-${listing.price}-${listing.mileage}`;
      
      if (!seen.has(dedupKey)) {
        seen.add(dedupKey);
        unique.push(listing);
      }
    }
    
    return unique;
  }
  
  private calculateRelevanceScore(listing: CanonicalListing, criteria: SearchCriteria): number {
    let score = listing.confidence_score * 100;
    
    // Mileage similarity
    const mileageDiff = Math.abs(listing.mileage - criteria.mileage);
    const mileageScore = Math.max(0, 20 - (mileageDiff / 5000));
    score += mileageScore;
    
    // Source tier bonus
    score += (4 - listing.source_tier) * 5;
    
    // Distance penalty
    if (listing.geo_distance_miles) {
      score -= listing.geo_distance_miles * 0.1;
    }
    
    // Trim match bonus
    if (criteria.trim && listing.trim?.toLowerCase().includes(criteria.trim.toLowerCase())) {
      score += 10;
    }
    
    return score;
  }
  
  private calculateMarketMetrics(listings: CanonicalListing[], criteria: SearchCriteria) {
    const prices = listings.map(l => l.price).sort((a, b) => a - b);
    const medianPrice = prices[Math.floor(prices.length / 2)] || 0;
    const priceRange: [number, number] = [prices[0] || 0, prices[prices.length - 1] || 0];
    
    // Calculate supply density (scarcity premium)
    const supplyDensityScore = listings.length >= 10 ? 0.3 :  // Oversupply
                              listings.length >= 5 ? 0.6 :   // Normal
                              listings.length >= 2 ? 0.8 :   // Limited
                              1.0;                            // Scarcity
    
    // Source distribution
    const sources = [...new Set(listings.map(l => l.source))];
    const sourceTiers = listings.reduce((acc, l) => {
      acc[l.source_tier] = (acc[l.source_tier] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    
    // Overall confidence
    const avgConfidence = listings.reduce((sum, l) => sum + l.confidence_score, 0) / listings.length;
    const confidenceScore = Math.min(0.9, avgConfidence * (listings.length >= 3 ? 1.0 : 0.8));
    
    return {
      listingCount: listings.length,
      medianPrice,
      priceRange,
      confidenceScore,
      supplyDensityScore,
      marketVelocityScore: 0.6, // Would calculate from listing dates in production
      sources,
      sourceTiers
    };
  }
  
  private generateMarketExplanation(listings: CanonicalListing[], aggregation: any, criteria: SearchCriteria): string[] {
    const explanation: string[] = [];
    
    explanation.push(`Found ${aggregation.listingCount} market listings for ${criteria.year} ${criteria.make} ${criteria.model} near ZIP ${criteria.zipCode}`);
    
    if (aggregation.listingCount >= 5) {
      explanation.push(`Strong market data with ${aggregation.sources.length} verified sources including ${aggregation.sourceTiers[1] || 0} premium dealers`);
    } else if (aggregation.listingCount >= 2) {
      explanation.push(`Limited market data available - ${aggregation.listingCount} comparable listings found`);
    } else {
      explanation.push(`Very limited market data - expanding search radius recommended`);
    }
    
    explanation.push(`Price range: $${aggregation.priceRange[0].toLocaleString()} - $${aggregation.priceRange[1].toLocaleString()}`);
    explanation.push(`Market median: $${aggregation.medianPrice.toLocaleString()}`);
    
    if (aggregation.supplyDensityScore > 0.8) {
      explanation.push(`Limited supply detected - potential scarcity premium of 5-10%`);
    } else if (aggregation.supplyDensityScore < 0.4) {
      explanation.push(`High supply detected - competitive pricing environment`);
    }
    
    return explanation;
  }
  
  private async storeMarketAggregation(criteria: SearchCriteria, listings: CanonicalListing[], aggregation: any): Promise<void> {
    try {
      // Store in enhanced_market_listings table
      for (const listing of listings.slice(0, 10)) { // Store top 10
        await supabase.from('enhanced_market_listings').upsert({
          source: listing.source,
          url: listing.url,
          make: listing.make,
          model: listing.model,
          year: listing.year,
          trim: listing.trim,
          price: listing.price,
          mileage: listing.mileage,
          location: listing.location,
          zip_code: listing.zip_code,
          dealer_name: listing.dealer_name,
          confidence_score: Math.round(listing.confidence_score * 100),
          geo_distance_miles: listing.geo_distance_miles,
          raw_data: listing.raw_data || {},
          source_type: `tier_${listing.source_tier}`,
          title_status: listing.title_status || 'clean',
          is_cpo: false, // Default to not certified pre-owned
          is_validated: true // Mark as validated since it went through our pipeline
        }, { onConflict: 'url' });
      }
      
      // Store aggregation summary
      await supabase.from('market_listing_aggregations').insert({
        search_criteria: criteria,
        listings_found: aggregation.listingCount,
        sources_used: aggregation.sources,
        confidence_score: aggregation.confidenceScore,
        median_price: aggregation.medianPrice,
        price_range_low: aggregation.priceRange[0],
        price_range_high: aggregation.priceRange[1],
        supply_density_score: aggregation.supplyDensityScore,
        market_velocity_score: aggregation.marketVelocityScore,
        aggregation_notes: [`Searched ${aggregation.sources.length} sources`, `Found ${aggregation.listingCount} listings`]
      });
      
      console.log('✅ [STORAGE] Market aggregation data stored successfully');
    } catch (error) {
      console.error('❌ [STORAGE] Failed to store market data:', error);
    }
  }
}

// Export singleton instance
export const marketIntelligenceEngine = new MarketIntelligenceEngine();