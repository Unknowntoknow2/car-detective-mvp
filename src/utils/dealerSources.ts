// FANG-Grade Retail Dealer Sources for AIN Market Intelligence
// Organized by trust tier for weighted valuation accuracy

export const RetailDealerSources = {
  Tier1: [
    "AutoTrader", "Cars.com", "Edmunds", "CarGurus", "KBB Used", "Carfax Listings",
    "TrueCar", "Autobytel", "iSeeCars", "AutoTempest"
  ],
  Tier2: [
    "AutoNation", "EchoPark", "Enterprise Car Sales", "Sonic Automotive",
    "Hertz Car Sales", "Lithia Motors", "Penske", "Koons", "Priority Auto Group"
  ],
  Tier3: [
    "Napleton", "Fred Beans", "OffLeaseOnly", "DGDG", "Galpin", "Texas Direct Auto",
    "Greenway Automotive", "Holman Automotive", "Sheehy Auto"
  ]
} as const;

export const dealerTierWeights = {
  Tier1: 0.95,
  Tier2: 0.9,
  Tier3: 0.85
} as const;

export const dealerDomainMap: Record<string, string> = {
  // Tier 1 - Premium National Aggregators
  "AutoTrader": "autotrader.com",
  "Cars.com": "cars.com", 
  "Edmunds": "edmunds.com",
  "CarGurus": "cargurus.com",
  "KBB Used": "kbb.com",
  "Carfax Listings": "carfax.com",
  "TrueCar": "truecar.com",
  "Autobytel": "autobytel.com",
  "iSeeCars": "iseecars.com",
  "AutoTempest": "autotempest.com",
  
  // Tier 2 - Verified Dealer Networks  
  "AutoNation": "autonation.com",
  "EchoPark": "echopark.com",
  "Enterprise Car Sales": "enterprisecarsales.com",
  "Sonic Automotive": "sonicautomotive.com",
  "Hertz Car Sales": "hertzcarsales.com",
  "Lithia Motors": "lithia.com",
  "Penske": "penske.com",
  "Koons": "koons.com",
  "Priority Auto Group": "priorityauto.com",
  
  // Tier 3 - Regional Dealer Groups
  "Napleton": "napleton.com",
  "Fred Beans": "fredbeans.com", 
  "OffLeaseOnly": "offleaseonly.com",
  "DGDG": "dgdg.com",
  "Galpin": "galpin.com",
  "Texas Direct Auto": "texasdirectauto.com",
  "Greenway Automotive": "greenwayautomotive.com",
  "Holman Automotive": "holmanauto.com",
  "Sheehy Auto": "sheehy.com"
};

export interface DealerSourceResult {
  source: string;
  tier: 'Tier1' | 'Tier2' | 'Tier3';
  trustWeight: number;
  listingsUsed: number;
  avgPrice: number;
  domain: string;
}

export interface WeightedListing {
  price: number;
  mileage: number;
  location?: string;
  source: string;
  tier: 'Tier1' | 'Tier2' | 'Tier3';
  trustWeight: number;
  url?: string;
  title?: string;
  dealer?: string;
}

// Helper function to get tier for a source
export function getDealerTier(sourceName: string): 'Tier1' | 'Tier2' | 'Tier3' {
  if (RetailDealerSources.Tier1.includes(sourceName as any)) {
    return 'Tier1';
  }
  if (RetailDealerSources.Tier2.includes(sourceName as any)) {
    return 'Tier2';
  }
  if (RetailDealerSources.Tier3.includes(sourceName as any)) {
    return 'Tier3';
  }
  return 'Tier3'; // Default fallback
}

// Helper function to get trust weight for a source
export function getDealerTrustWeight(sourceName: string): number {
  const tier = getDealerTier(sourceName);
  return dealerTierWeights[tier];
}

// Helper function to get domain for a source
export function getDealerDomain(sourceName: string): string {
  return dealerDomainMap[sourceName] || 'unknown-dealer.com';
}

// All dealer sources flattened for easy iteration
export const AllDealerSources = [
  ...RetailDealerSources.Tier1,
  ...RetailDealerSources.Tier2, 
  ...RetailDealerSources.Tier3
] as const;