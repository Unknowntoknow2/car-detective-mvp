
// Canonical MarketListing type - single source of truth for ALL market listing data
export interface MarketListing {
  // Core identifying fields
  id?: string;
  price: number;
  mileage?: number;
  year?: number;
  make?: string;
  model?: string;
  trim?: string;
  condition?: string;
  vin?: string;
  zip?: string;
  zipCode?: string;
  location?: string;
  source: string; // e.g., 'Cars.com', 'AutoTrader', 'Enhanced DB', 'OpenAI Search'
  
  // Support both live search and database formats
  link?: string;        // Live search version
  listingUrl?: string;  // Database version
  listing_url?: string; // Alternative database field name
  url?: string;         // Generic URL field (for compatibility)
  
  // Legacy compatibility fields
  valuationId?: string; // From old marketListings.ts
  listingDate?: string; // From old marketListings.ts
  
  // Dealer and source information
  dealer?: string;       // Generic dealer field
  dealerName?: string;
  dealer_name?: string;  // Database version
  sourceType?: string;   // 'live' | 'database' | 'dealer' | 'auction' | 'classified'
  source_type?: string;  // Database version
  
  // Vehicle details and features
  photos?: string[];
  titleStatus?: string;
  isCpo?: boolean;
  is_cpo?: boolean;      // Database version
  distance?: number;     // Distance from search location
  
  // Extended properties for Google-style listings
  days_on_market?: number;
  dealer_rating?: number;
  exterior_color?: string;
  interior_color?: string;
  fuel_economy_city?: number;
  fuel_economy_highway?: number;
  drivetrain?: string;
  transmission_type?: string;
  engine_description?: string;
  features?: string[];
  stock_number?: string;
  
  // Timestamps
  fetchedAt?: string;
  fetched_at?: string;   // Database version
  updatedAt?: string;
  updated_at?: string;   // Database version
  createdAt?: string;
  created_at?: string;   // Database version
  
  // Confidence and validation
  confidenceScore?: number;
  confidence_score?: number; // Database version
}

// Type guard to check if listing is from database
export function isDatabaseListing(listing: MarketListing): boolean {
  return !!(listing.listing_url || listing.source_type || listing.dealer_name || listing.fetched_at);
}

// Type guard to check if listing is from live search
export function isLiveSearchListing(listing: MarketListing): boolean {
  return !!(listing.link && listing.sourceType === 'live');
}

// Helper to get normalized URL from either format
export function getNormalizedUrl(listing: MarketListing): string | undefined {
  return listing.link || listing.listingUrl || listing.listing_url;
}

// Helper to get normalized source type
export function getNormalizedSourceType(listing: MarketListing): string {
  return listing.sourceType || listing.source_type || 'unknown';
}

// Helper to get normalized dealer name
export function getNormalizedDealerName(listing: MarketListing): string | undefined {
  return listing.dealerName || listing.dealer_name;
}

// Helper to get normalized timestamp
export function getNormalizedTimestamp(listing: MarketListing): string | undefined {
  return listing.fetchedAt || listing.fetched_at || listing.updatedAt || listing.updated_at || listing.createdAt || listing.created_at;
}

// Helper to normalize a listing to ensure consistent field access
export function normalizeListing(listing: MarketListing): MarketListing {
  return {
    ...listing,
    // Ensure primary fields are available
    link: getNormalizedUrl(listing),
    sourceType: getNormalizedSourceType(listing),
    dealerName: getNormalizedDealerName(listing),
    fetchedAt: getNormalizedTimestamp(listing),
    isCpo: listing.isCpo || listing.is_cpo || false,
    confidenceScore: listing.confidenceScore || listing.confidence_score || 0
  };
}
