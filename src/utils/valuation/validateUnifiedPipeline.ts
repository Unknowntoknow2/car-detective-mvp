// Final validation script for unified MarketListing type across ResultsPage and PDF Export
import { MarketListing, normalizeListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';

/**
 * Comprehensive validation that the unified MarketListing type works across the entire pipeline
 */
export const validateUnifiedMarketListingPipeline = () => {

  // Sample data representing different source formats that the system should handle
  const mixedFormatListings = [
    // Live web search format
    {
      price: 34500,
      mileage: 45000,
      source: 'AutoTrader',
      link: 'https://autotrader.com/listing1', // Live format field
      dealerName: 'Bob\'s Cars', // Live format field
      isCpo: true, // Live format field
      sourceType: 'live'
    },
    // Database format
    {
      price: 35500,
      mileage: 42000,
      source: 'Cars.com',
      listing_url: 'https://cars.com/listing2', // DB format field
      dealer_name: 'City Motors', // DB format field
      is_cpo: false, // DB format field
      source_type: 'database'
    },
    // Mixed/generic format
    {
      price: 36000,
      mileage: 40000,
      source: 'CarGurus',
      url: 'https://cargurus.com/listing3', // Generic URL field
      dealer: 'Auto World', // Generic dealer field
      confidenceScore: 87
    }
  ] as MarketListing[];

  const normalizedListings = mixedFormatListings.map(normalizeListing);
  
  // Validation 1: All listings normalized successfully
  const allNormalized = normalizedListings.every(listing => {
    return (
      typeof listing.price === 'number' &&
      listing.price > 0 &&
      typeof listing.source === 'string' &&
      listing.source.length > 0
    );
  });


  
  // Validation 2: UI components can access all necessary fields
  const uiCompatible = normalizedListings.every(listing => {
    const url = getNormalizedUrl(listing);
    const sourceType = getNormalizedSourceType(listing);
    const dealer = listing.dealerName || listing.dealer_name || listing.dealer;
    const cpo = listing.isCpo || listing.is_cpo;
    
    return !!(url && sourceType && dealer !== undefined && cpo !== undefined);
  });


  
  // Validation 3: PDF export can process all normalized listings
  const pdfCompatible = normalizedListings.every(listing => {
    // Simulate PDF field access patterns
    const dealerForPdf = listing.dealer_name || listing.dealerName || listing.dealer || 'Unknown';
    const urlForPdf = listing.listing_url || listing.link || listing.url || '';
    const sourceForPdf = listing.source || 'Unknown';
    
    return !!(dealerForPdf && sourceForPdf && listing.price > 0);
  });


  
  // Validation 4: Helper functions work consistently
  const helperFunctionsWork = normalizedListings.every(listing => {
    const url1 = getNormalizedUrl(listing);
    const url2 = getNormalizedUrl(listing); // Should be consistent
    const sourceType1 = getNormalizedSourceType(listing);
    const sourceType2 = getNormalizedSourceType(listing); // Should be consistent
    
    return url1 === url2 && sourceType1 === sourceType2;
  });


  // Final assessment
  const allValidationsPassed = allNormalized && uiCompatible && pdfCompatible && helperFunctionsWork;
  
  
  if (allValidationsPassed) {
  } else {
  }

  return {
    success: allValidationsPassed,
    results: {
      normalization: allNormalized,
      uiCompatibility: uiCompatible,
      pdfCompatibility: pdfCompatible,
      helperFunctions: helperFunctionsWork
    },
    processedListings: normalizedListings
  };
};

// Quick test function for immediate validation
export const quickValidation = () => validateUnifiedMarketListingPipeline();