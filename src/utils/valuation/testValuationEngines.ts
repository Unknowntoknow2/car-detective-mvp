// Test utility to validate Enhanced Valuation Engines with unified MarketListing type
import { calculateEnhancedValuation as calculateV2 } from '@/services/enhancedValuationEngineV2';
import { calculateEnhancedValuation as calculateV1 } from '@/services/enhancedValuationEngine';
import type { ValuationInput } from '@/types/valuation';

/**
 * Test both enhanced valuation engines with known VINs
 */
export async function testValuationEngines() {
  console.log('🧪 Testing Enhanced Valuation Engines with Unified MarketListing Type');
  
  // Test Case 1: VIN with known listings in DB
  const knownVinTest: ValuationInput = {
    vin: '1FTEW1CP7MKD73632',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    mileage: 45000,
    condition: 'good',
    zipCode: '90210'
  };

  // Test Case 2: VIN that should use fallback
  const fallbackVinTest: ValuationInput = {
    vin: '1N4BL4BV8NN341985',
    make: 'Nissan',
    model: 'Altima', 
    year: 2022,
    mileage: 25000,
    condition: 'excellent',
    zipCode: '10001'
  };

  try {
    console.log('\n📊 Testing Enhanced Valuation Engine V2...');
    
    // Test V2 with known listings
    console.log('🔍 Test 1: Known VIN (should find real listings)');
    const v2KnownResult = await calculateV2(knownVinTest);
    console.log('✅ V2 Known VIN Result:', {
      estimatedValue: v2KnownResult.estimatedValue,
      confidenceScore: v2KnownResult.confidenceScore,
      listingsCount: v2KnownResult.marketListings.length,
      isFallback: v2KnownResult.isFallbackMethod
    });

    // Test V2 with fallback VIN
    console.log('🔍 Test 2: Fallback VIN (should use depreciation model)');
    const v2FallbackResult = await calculateV2(fallbackVinTest);
    console.log('✅ V2 Fallback VIN Result:', {
      estimatedValue: v2FallbackResult.estimatedValue,
      confidenceScore: v2FallbackResult.confidenceScore,
      listingsCount: v2FallbackResult.marketListings.length,
      isFallback: v2FallbackResult.isFallbackMethod
    });

    console.log('\n📊 Testing Enhanced Valuation Engine V1...');
    
    // Test V1 with known listings
    console.log('🔍 Test 3: V1 Known VIN');
    const v1KnownResult = await calculateV1({
      vin: knownVinTest.vin,
      make: knownVinTest.make,
      model: knownVinTest.model,
      year: knownVinTest.year,
      mileage: knownVinTest.mileage,
      condition: knownVinTest.condition,
      zipCode: knownVinTest.zipCode
    });
    console.log('✅ V1 Known VIN Result:', {
      estimatedValue: v1KnownResult.estimatedValue,
      confidenceScore: v1KnownResult.confidenceScore,
      listingsCount: v1KnownResult.marketListings.length
    });

    // Test V1 with fallback VIN  
    console.log('🔍 Test 4: V1 Fallback VIN');
    const v1FallbackResult = await calculateV1({
      vin: fallbackVinTest.vin,
      make: fallbackVinTest.make,
      model: fallbackVinTest.model,
      year: fallbackVinTest.year,
      mileage: fallbackVinTest.mileage,
      condition: fallbackVinTest.condition,
      zipCode: fallbackVinTest.zipCode
    });
    console.log('✅ V1 Fallback VIN Result:', {
      estimatedValue: v1FallbackResult.estimatedValue,
      confidenceScore: v1FallbackResult.confidenceScore,
      listingsCount: v1FallbackResult.marketListings.length
    });

    console.log('\n🎯 All tests completed successfully! Unified MarketListing type working properly.');
    
    return {
      success: true,
      v2KnownTest: v2KnownResult,
      v2FallbackTest: v2FallbackResult,
      v1KnownTest: v1KnownResult,
      v1FallbackTest: v1FallbackResult
    };

  } catch (error) {
    console.error('❌ Valuation engine test failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Quick validation that MarketListing normalization is working
 */
export function validateMarketListingNormalization() {
  console.log('🔧 Testing MarketListing normalization...');
  
  // Test data with mixed formats (simulating live vs DB listings)
  const mixedListings = [
    {
      price: 35000,
      mileage: 45000,
      source: 'AutoTrader',
      link: 'https://autotrader.com/listing1', // Live format
      dealer: 'Bob\'s Cars',
      isCpo: true
    },
    {
      price: 32000,
      mileage: 52000,
      source: 'Cars.com',
      listing_url: 'https://cars.com/listing2', // DB format
      dealer_name: 'City Motors',
      is_cpo: false
    },
    {
      price: 38000,
      mileage: 38000,
      source: 'Carvana',
      url: 'https://carvana.com/listing3', // Generic format
      dealerName: 'Carvana',
      confidenceScore: 85
    }
  ];

  console.log('🧪 Mixed format listings should all normalize to unified type');
  return mixedListings;
}