// Validation test for normalized marketSearchAgent output
import { fetchMarketComps, searchMarketListings } from '@/agents/marketSearchAgent';
import { MarketListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';

/**
 * Test the unified market search agent output normalization
 */
export async function testMarketSearchAgentNormalization() {

  // Test Case 1: Ford F-150 (likely to have database listings)
  const fordTest = {
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    zipCode: '90210'
  };

  // Test Case 2: Nissan Altima (may use fallback)
  const nissanTest = {
    make: 'Nissan',
    model: 'Altima',
    year: 2022,
    zipCode: '10001'
  };

  try {
    // Test fetchMarketComps function
    
    const fordComps = await fetchMarketComps(fordTest);
      totalFound: fordComps.totalFound,
      confidence: fordComps.confidence,
      trust: fordComps.trust,
      source: fordComps.source,
      notes: fordComps.notes
    });

    // Validate listing format
    if (fordComps.listings.length > 0) {
      const firstListing = fordComps.listings[0];
        hasPrice: typeof firstListing.price === 'number' && firstListing.price > 0,
        hasSource: typeof firstListing.source === 'string' && firstListing.source.length > 0,
        hasUrl: !!getNormalizedUrl(firstListing),
        sourceType: getNormalizedSourceType(firstListing),
        confidenceScore: firstListing.confidenceScore || firstListing.confidence_score
      });
    }

    // Test direct searchMarketListings function
    
    const nissanListings = await searchMarketListings(nissanTest);
      listingsFound: nissanListings.length,
      sources: nissanListings.map(l => l.source),
      sourceTypes: nissanListings.map(l => getNormalizedSourceType(l))
    });

    // Validate all listings conform to MarketListing interface
    const allListingsValid = [...fordComps.listings, ...nissanListings].every(listing => {
      return (
        typeof listing.price === 'number' &&
        listing.price > 0 &&
        typeof listing.source === 'string' &&
        listing.source.length > 0
      );
    });

      allListingsValid,
      fordListingsCount: fordComps.listings.length,
      nissanListingsCount: nissanListings.length,
      totalTestListings: fordComps.listings.length + nissanListings.length
    });

    if (allListingsValid) {
      return { success: true, fordComps, nissanListings };
    } else {
      return { success: false, error: 'Listing validation failed' };
    }

  } catch (error) {
    console.error('❌ Market search agent test failed:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Validate specific field mappings work correctly
 */
export function validateFieldMappings() {

  // Mock listings with different format variations
  const testListings: MarketListing[] = [
    {
      price: 35000,
      source: 'AutoTrader',
      link: 'https://autotrader.com/listing1', // Live format
      dealerName: 'Bob\'s Cars', // Live format
      isCpo: true, // Live format
      sourceType: 'live'
    },
    {
      price: 32000,
      source: 'Database',
      listing_url: 'https://db.com/listing2', // DB format
      dealer_name: 'City Motors', // DB format
      is_cpo: false, // DB format
      source_type: 'database'
    }
  ];

  // Test field access using helper functions
  testListings.forEach((listing, index) => {
    const url = getNormalizedUrl(listing);
    const sourceType = getNormalizedSourceType(listing);
    
      price: listing.price,
      url,
      sourceType,
      dealer: listing.dealerName || listing.dealer_name,
      cpo: listing.isCpo || listing.is_cpo
    });
  });

  return testListings;
}