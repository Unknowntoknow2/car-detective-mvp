// Integration test to validate MarketListing type unification
import { MarketListing, normalizeListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';

/**
 * Validates that the unified MarketListing interface works correctly
 * with both live and database format listings
 */
export function validateMarketListingIntegration(): boolean {
  
  // Test 1: Live format listing (from web scraping/API)
  const liveListing = {
    price: 35000,
    mileage: 45000,
    source: 'AutoTrader',
    link: 'https://autotrader.com/listing1',
    dealer: 'Bob\'s Cars',
    isCpo: true,
    photos: ['photo1.jpg', 'photo2.jpg']
  } as MarketListing;

  // Test 2: Database format listing (from Supabase)
  const dbListing = {
    price: 32000,
    mileage: 52000,
    source: 'Cars.com',
    listing_url: 'https://cars.com/listing2',
    dealer_name: 'City Motors',
    is_cpo: false,
    fetched_at: '2024-01-15T10:30:00Z'
  } as MarketListing;

  // Test 3: Mixed format listing
  const mixedListing = {
    price: 38000,
    mileage: 38000,
    source: 'Carvana',
    url: 'https://carvana.com/listing3',
    dealerName: 'Carvana Online',
    confidenceScore: 85,
    titleStatus: 'clean'
  } as MarketListing;

  try {
    // Test normalization
    const normalizedLive = normalizeListing(liveListing);
    const normalizedDb = normalizeListing(dbListing);
    const normalizedMixed = normalizeListing(mixedListing);

    // Test helper functions
    const liveUrl = getNormalizedUrl(liveListing);
    const dbUrl = getNormalizedUrl(dbListing);
    const mixedUrl = getNormalizedUrl(mixedListing);

    const liveSourceType = getNormalizedSourceType(liveListing);
    const dbSourceType = getNormalizedSourceType(dbListing);

      price: normalizedLive.price,
      url: liveUrl,
      sourceType: liveSourceType,
      dealer: normalizedLive.dealerName || normalizedLive.dealer_name || normalizedLive.dealer
    });

      price: normalizedDb.price,
      url: dbUrl,
      sourceType: dbSourceType,
      dealer: normalizedDb.dealerName || normalizedDb.dealer_name || normalizedDb.dealer
    });

      price: normalizedMixed.price,
      url: mixedUrl,
      dealer: normalizedMixed.dealerName || normalizedMixed.dealer_name || normalizedMixed.dealer
    });

    // Validate that all listings can be processed in a unified way
    const allListings: MarketListing[] = [liveListing, dbListing, mixedListing];
    
    const pricesValid = allListings.every(listing => typeof listing.price === 'number' && listing.price > 0);
    const sourcesValid = allListings.every(listing => typeof listing.source === 'string' && listing.source.length > 0);
    const urlsAccessible = allListings.every(listing => {
      const url = getNormalizedUrl(listing);
      return typeof url === 'string' && url.length > 0;
    });

    if (pricesValid && sourcesValid && urlsAccessible) {
      return true;
    } else {
      console.error('❌ MarketListing integration validation FAILED');
      return false;
    }

  } catch (error) {
    console.error('❌ MarketListing validation error:', error);
    return false;
  }
}

/**
 * Test confidence calculation with unified listings
 */
export function testConfidenceCalculation(): void {
  
  const testListings: MarketListing[] = [
    {
      price: 35000,
      mileage: 45000,
      source: 'AutoTrader',
      link: 'https://autotrader.com/listing1',
      confidenceScore: 90,
      vin: '1FTEW1CP7MKD73632'
    },
    {
      price: 33000,
      mileage: 48000,
      source: 'Cars.com',
      listing_url: 'https://cars.com/listing2',
      confidence_score: 85,
      vin: '1FTEW1CP7MKD73632'
    },
    {
      price: 36500,
      mileage: 42000,
      source: 'CarGurus',
      url: 'https://cargurus.com/listing3',
      confidenceScore: 88
    }
  ];

  // Test exact VIN matches
  const exactMatches = testListings.filter(l => l.vin === '1FTEW1CP7MKD73632');

  // Test price range calculation
  const prices = testListings.map(l => l.price);
  const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

    average: avgPrice,
    range: [minPrice, maxPrice],
    variance: maxPrice - minPrice
  });

  // Test confidence score access
  const confidenceScores = testListings.map(l => l.confidenceScore || l.confidence_score || 50);
  const avgConfidence = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;

    scores: confidenceScores,
    average: avgConfidence
  });

}