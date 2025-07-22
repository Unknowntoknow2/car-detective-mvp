// src/agents/marketSearchAgent.ts

import { MarketSearchInput, MarketListing } from "@/types/valuationTypes";

export interface MarketSearchResult {
  listings: MarketListing[];
  totalFound: number;
  searchQuery: string;
  confidence: number;
  trust: number;
  source: string;
  notes: string[];
}

export async function fetchMarketComps(input: MarketSearchInput): Promise<MarketSearchResult> {
  const listings = await searchMarketListings(input);
  const trust = listings.length > 0 ? Math.min(0.85, 0.5 + (listings.length * 0.05)) : 0.35;
  
  return {
    listings,
    totalFound: listings.length,
    searchQuery: `${input.year} ${input.make} ${input.model}`,
    confidence: listings.length > 0 ? Math.min(85, 50 + (listings.length * 5)) : 35,
    trust,
    source: listings.length > 0 ? 'live_market_search' : 'no_data',
    notes: listings.length > 0 
      ? [`Found ${listings.length} live listings`, 'Real-time market data available']
      : ['No live listings found', 'Consider using alternative valuation methods']
  };
}

export async function searchMarketListings(input: MarketSearchInput): Promise<MarketListing[]> {
  const { make, model, year, trim, mileage, condition, zip, zipCode } = input;
  const targetZip = zip || zipCode;

  try {
    // For now, we'll use the Supabase edge function approach instead of direct OpenAI
    // This will call our edge function that uses OpenAI with web browsing
    const response = await fetch('/api/search-market-listings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        make,
        model,
        year,
        trim,
        mileage,
        condition,
        zip: targetZip
      }),
    });

    if (!response.ok) {
      console.error('Failed to fetch market listings:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.listings || [];
  } catch (error) {
    console.error('Error searching market listings:', error);
    return [];
  }
}