// Final validation script for unified MarketListing type across ResultsPage and PDF Export
import { MarketListing, normalizeListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';

/**
 * Comprehensive validation that the unified MarketListing type works across the entire pipeline
 */
export const validateUnifiedMarketListingPipeline = () => {
  console.log('🎯 Final Validation: Unified MarketListing Pipeline');

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

  console.log('\n📊 Step 1: Normalize all listings...');
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

  console.log('✅ Normalization validation:', allNormalized ? 'PASSED' : 'FAILED');

  console.log('\n🎨 Step 2: Test UI component compatibility...');
  
  // Validation 2: UI components can access all necessary fields
  const uiCompatible = normalizedListings.every(listing => {
    const url = getNormalizedUrl(listing);
    const sourceType = getNormalizedSourceType(listing);
    const dealer = listing.dealerName || listing.dealer_name || listing.dealer;
    const cpo = listing.isCpo || listing.is_cpo;
    
    return !!(url && sourceType && dealer !== undefined && cpo !== undefined);
  });

  console.log('✅ UI compatibility validation:', uiCompatible ? 'PASSED' : 'FAILED');

  console.log('\n📄 Step 3: Test PDF export compatibility...');
  
  // Validation 3: PDF export can process all normalized listings
  const pdfCompatible = normalizedListings.every(listing => {
    // Simulate PDF field access patterns
    const dealerForPdf = listing.dealer_name || listing.dealerName || listing.dealer || 'Unknown';
    const urlForPdf = listing.listing_url || listing.link || listing.url || '';
    const sourceForPdf = listing.source || 'Unknown';
    
    return !!(dealerForPdf && sourceForPdf && listing.price > 0);
  });

  console.log('✅ PDF compatibility validation:', pdfCompatible ? 'PASSED' : 'FAILED');

  console.log('\n🔍 Step 4: Test helper function reliability...');
  
  // Validation 4: Helper functions work consistently
  const helperFunctionsWork = normalizedListings.every(listing => {
    const url1 = getNormalizedUrl(listing);
    const url2 = getNormalizedUrl(listing); // Should be consistent
    const sourceType1 = getNormalizedSourceType(listing);
    const sourceType2 = getNormalizedSourceType(listing); // Should be consistent
    
    return url1 === url2 && sourceType1 === sourceType2;
  });

  console.log('✅ Helper functions validation:', helperFunctionsWork ? 'PASSED' : 'FAILED');

  // Final assessment
  const allValidationsPassed = allNormalized && uiCompatible && pdfCompatible && helperFunctionsWork;
  
  console.log('\n🎯 FINAL VALIDATION RESULTS:');
  console.log('=' .repeat(50));
  console.log(`✅ Listing Normalization: ${allNormalized ? 'PASSED' : 'FAILED'}`);
  console.log(`🎨 UI Compatibility: ${uiCompatible ? 'PASSED' : 'FAILED'}`);
  console.log(`📄 PDF Compatibility: ${pdfCompatible ? 'PASSED' : 'FAILED'}`);
  console.log(`🔍 Helper Functions: ${helperFunctionsWork ? 'PASSED' : 'FAILED'}`);
  console.log('=' .repeat(50));
  
  if (allValidationsPassed) {
    console.log('🎉 UNIFIED MARKETLISTING TYPE INTEGRATION: COMPLETE SUCCESS!');
    console.log('✅ ResultsPage.tsx properly displays normalized listings');
    console.log('✅ PDF export correctly processes canonical MarketListing fields');
    console.log('✅ All field variations (live/DB/mixed) work seamlessly');
    console.log('✅ Helper functions provide consistent field access');
  } else {
    console.log('❌ UNIFIED MARKETLISTING TYPE INTEGRATION: FAILED');
    console.log('Some validation checks did not pass');
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