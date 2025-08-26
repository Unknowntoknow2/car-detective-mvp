// Canonical MarketListing type — ALL code must import from this file.
// Path: src/types/marketListing.ts

export interface MarketListing {
  id: string;                    // stable unique id (hash(url) or db id)
  vin?: string;

  // vehicle identity
  year: number;
  make: string;
  model: string;
  trim?: string;

  // pricing & vehicle state
  price: number;                 // USD
  mileage?: number;              // miles

  // seller / source
  dealer?: string;               // dealer or seller label if known
  source: 'Cars.com' | 'CarGurus' | 'Carvana' | 'Edmunds' | 'Craigslist' | 'eBay Motors' | 'EchoPark' | 'Other';
  url?: string;                   // canonical listing URL

  // geo & timing
  location?: string;             // "City, ST"
  zip?: string;                  // 5-digit if available
  fetchedAt?: string;            // ISO datetime when fetched
  listedAt?: string;             // ISO date if known

  // quality
  trust_score?: number;          // 0–1
}
