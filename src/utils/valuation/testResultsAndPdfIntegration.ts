// Integration test for ResultsPage and PDF Export with unified MarketListing type
import { MarketListing, normalizeListing, getNormalizedUrl, getNormalizedSourceType } from '@/types/marketListing';
import { EnhancedValuationResult } from '@/components/valuation/result/EnhancedValuationResult';
import { convertVehicleInfoToReportData } from '@/utils/pdfService';

/**
 * Test that ResultsPage displays and PDF export handles unified MarketListing correctly
 */
export function testResultsPageAndPdfIntegration() {
  console.log('🧪 Testing ResultsPage and PDF Export Integration');

  // Mock enhanced valuation result with mixed MarketListing formats
  const mockEnhancedResult: EnhancedValuationResult = {
    estimatedValue: 35000,
    confidenceScore: 88,
    zipCode: '90210',
    valuationMethod: 'market_based',
    isUsingFallbackMethod: false,
    marketSearchStatus: 'success',
    adjustments: [],
    baseValue: 32000,
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    condition: 'good',
    marketListings: [
      // Live format listing
      {
        price: 34500,
        mileage: 45000,
        source: 'AutoTrader',
        link: 'https://autotrader.com/listing1',
        dealerName: 'Bob\'s Cars',
        isCpo: true,
        sourceType: 'live',
        confidenceScore: 90
      },
      // Database format listing
      {
        price: 35500,
        mileage: 42000,
        source: 'Cars.com',
        listing_url: 'https://cars.com/listing2',
        dealer_name: 'City Motors',
        is_cpo: false,
        source_type: 'database',
        confidence_score: 85
      },
      // Mixed format listing
      {
        price: 36000,
        mileage: 40000,
        source: 'CarGurus',
        url: 'https://cargurus.com/listing3',
        dealer: 'Auto World',
        confidenceScore: 87
      }
    ] as MarketListing[],
    sources: ['enhanced_valuation_engine', 'market_search'],
    explanation: 'Enhanced valuation based on 3 market listings with 88% confidence.'
  };

  try {
    // Test 1: Validate normalization for ResultsPage display
    console.log('\n📊 Testing ResultsPage listing normalization...');
    
    const normalizedForDisplay = mockEnhancedResult.marketListings?.map(normalizeListing) || [];
    
    console.log('✅ Normalized listings for display:', normalizedForDisplay.map(listing => ({
      price: listing.price,
      source: listing.source,
      url: getNormalizedUrl(listing),
      sourceType: getNormalizedSourceType(listing),
      dealer: listing.dealerName || listing.dealer_name || listing.dealer,
      cpo: listing.isCpo || listing.is_cpo
    })));

    // Test 2: Validate all listings have required fields for UI display
    const displayValidation = normalizedForDisplay.every(listing => {
      return (
        typeof listing.price === 'number' &&
        listing.price > 0 &&
        typeof listing.source === 'string' &&
        listing.source.length > 0 &&
        getNormalizedUrl(listing) // Has some form of URL
      );
    });

    console.log('📱 UI Display Validation:', displayValidation ? 'PASSED' : 'FAILED');

    // Test 3: Test PDF export data preparation
    console.log('\n📄 Testing PDF Export data preparation...');
    
    const mockVehicleInfo = {
      id: 'test-123',
      make: 'Ford',
      model: 'F-150',
      year: 2021,
      vin: '1FTEW1CP7MKD73632'
    };

    const mockValuationData = {
      estimatedValue: mockEnhancedResult.estimatedValue,
      confidenceScore: mockEnhancedResult.confidenceScore,
      zipCode: mockEnhancedResult.zipCode,
      mileage: 45000,
      condition: 'good',
      adjustments: [],
      priceRange: [30000, 40000] as [number, number],
      isPremium: false
    };

    const pdfReportData = convertVehicleInfoToReportData(mockVehicleInfo, {
      ...mockValuationData,
      marketplaceListings: normalizedForDisplay
    });

    console.log('✅ PDF Report Data prepared:', {
      make: pdfReportData.make,
      model: pdfReportData.model,
      year: pdfReportData.year,
      estimatedValue: pdfReportData.estimatedValue,
      listingsCount: pdfReportData.marketplaceListings?.length || 0
    });

    // Test 4: Validate PDF listings are properly typed
    const pdfListingsValid = pdfReportData.marketplaceListings?.every(listing => {
      const normalized = normalizeListing(listing);
      return (
        typeof normalized.price === 'number' &&
        normalized.price > 0 &&
        typeof normalized.source === 'string' &&
        (getNormalizedSourceType(normalized) === 'live' || 
         getNormalizedSourceType(normalized) === 'database' ||
         getNormalizedSourceType(normalized) === 'unknown')
      );
    }) ?? true;

    console.log('📄 PDF Listings Validation:', pdfListingsValid ? 'PASSED' : 'FAILED');

    // Test 5: Validate field access patterns work correctly
    console.log('\n🔍 Testing field access patterns...');
    
    normalizedForDisplay.forEach((listing, index) => {
      const dealerName = listing.dealerName || listing.dealer_name || listing.dealer || 'Unknown';
      const url = getNormalizedUrl(listing);
      const sourceType = getNormalizedSourceType(listing);
      const isCpo = listing.isCpo || listing.is_cpo || false;
      
      console.log(`Listing ${index + 1}: ${dealerName} - $${listing.price.toLocaleString()} [${sourceType}] CPO: ${isCpo}`);
    });

    // Final validation
    const allTestsPassed = displayValidation && pdfListingsValid;
    
    console.log('\n🎯 Integration Test Results:', {
      displayValidation,
      pdfListingsValid,
      allTestsPassed,
      totalListings: normalizedForDisplay.length
    });

    if (allTestsPassed) {
      console.log('✅ ResultsPage and PDF Export integration with unified MarketListing type: SUCCESS');
      return { success: true, normalizedListings: normalizedForDisplay, pdfReportData };
    } else {
      console.log('❌ ResultsPage and PDF Export integration: FAILED');
      return { success: false, error: 'Validation tests failed' };
    }

  } catch (error) {
    console.error('❌ Integration test error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Test specific field mappings for UI components
 */
export function testUIFieldMappings() {
  console.log('🎨 Testing UI Field Mappings...');

  const testListings: MarketListing[] = [
    {
      price: 35000,
      source: 'AutoTrader',
      link: 'https://autotrader.com/listing1',
      dealerName: 'Bob\'s Cars',
      isCpo: true,
      sourceType: 'live'
    },
    {
      price: 33000,
      source: 'Database',
      listing_url: 'https://db.com/listing2',
      dealer_name: 'City Motors',
      is_cpo: false,
      source_type: 'database'
    }
  ];

  // Test MarketDataStatus props
  console.log('📊 MarketDataStatus props test:', {
    marketListings: testListings.map(normalizeListing),
    allNormalized: testListings.every(listing => normalizeListing(listing).price > 0)
  });

  // Test GoogleStyleListings props  
  console.log('🔍 GoogleStyleListings props test:', {
    listings: testListings.map(normalizeListing),
    urlsAccessible: testListings.every(listing => !!getNormalizedUrl(listing))
  });

  console.log('✅ UI Field Mappings validation completed');
  return testListings;
}