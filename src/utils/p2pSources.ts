// Private-Party Marketplace Sources for AIN Market Intelligence
// P2P sources capture ground-truth individual buyer/seller pricing

export const PrivateMarketplaces = {
  Tier1: ["Facebook Marketplace", "Craigslist", "OfferUp"],
  Tier2: ["eBay Motors", "Nextdoor", "KSL Classifieds", "Letgo"],
  Tier3: ["Oodle", "Recycler", "Wallapop", "CarSoup"]
} as const;

export const p2pTierWeights = {
  Tier1: 0.8,
  Tier2: 0.75,
  Tier3: 0.7
} as const;

export const p2pDomainMap: Record<string, string> = {
  // Tier 1 - Major P2P Platforms
  "Facebook Marketplace": "facebook.com/marketplace",
  "Craigslist": "craigslist.org",
  "OfferUp": "offerup.com",
  
  // Tier 2 - Secondary P2P Platforms
  "eBay Motors": "ebay.com/motors",
  "Nextdoor": "nextdoor.com",
  "KSL Classifieds": "ksl.com/classifieds",
  "Letgo": "letgo.com",
  
  // Tier 3 - Regional P2P Platforms
  "Oodle": "oodle.com",
  "Recycler": "recycler.com",
  "Wallapop": "wallapop.com",
  "CarSoup": "carsoup.com"
};

export interface P2PSourceResult {
  source: string;
  tier: 'Tier1' | 'Tier2' | 'Tier3';
  trustWeight: number;
  listingsUsed: number;
  avgPrice: number;
  domain: string;
  sellerType: 'private';
}

export interface P2PListing {
  price: number;
  mileage: number;
  location?: string;
  source: string;
  tier: 'Tier1' | 'Tier2' | 'Tier3';
  trustWeight: number;
  url?: string;
  title?: string;
  sellerType: 'private';
  askingPrice: number; // Often higher than final sale price
}

// Helper function to get P2P tier for a source
export function getP2PTier(sourceName: string): 'Tier1' | 'Tier2' | 'Tier3' {
  if (PrivateMarketplaces.Tier1.includes(sourceName as any)) {
    return 'Tier1';
  }
  if (PrivateMarketplaces.Tier2.includes(sourceName as any)) {
    return 'Tier2';
  }
  if (PrivateMarketplaces.Tier3.includes(sourceName as any)) {
    return 'Tier3';
  }
  return 'Tier3'; // Default fallback
}

// Helper function to get P2P trust weight for a source
export function getP2PTrustWeight(sourceName: string): number {
  const tier = getP2PTier(sourceName);
  return p2pTierWeights[tier];
}

// Helper function to get P2P domain for a source
export function getP2PDomain(sourceName: string): string {
  return p2pDomainMap[sourceName] || 'unknown-marketplace.com';
}

// All P2P sources flattened for easy iteration
export const AllP2PSources = [
  ...PrivateMarketplaces.Tier1,
  ...PrivateMarketplaces.Tier2,
  ...PrivateMarketplaces.Tier3
] as const;