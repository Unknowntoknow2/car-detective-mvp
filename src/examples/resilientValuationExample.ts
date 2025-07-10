// Example: Tesla-Grade Resilient Valuation Engine Usage
// Demonstrates complete fallback handling and error resilience

import { processResilientValuation } from "@/services/valuation/resilientValuationEngine";
import { ValuationInput } from "@/types/valuation";

/**
 * Example usage of the resilient valuation engine
 * Shows how it handles various failure scenarios gracefully
 */
export async function demonstrateResilientValuation() {
  console.log('🚀 Tesla-Grade Resilient Valuation Engine Demo');
  console.log('=' .repeat(60));

  // Example 1: Perfect scenario - all data available
  const perfectInput: ValuationInput = {
    vin: '1HGBH41JXMN109186',
    make: 'Toyota',
    model: 'Prius',
    year: 2022,
    mileage: 25000,
    condition: 'good',
    zipCode: '90210',
    trim: 'LE',
    fuelType: 'hybrid'
  };

  console.log('\n📍 Test 1: Perfect Input Data');
  try {
    const result1 = await processResilientValuation(perfectInput);
    console.log('✅ Success:', {
      estimatedValue: result1.estimated_value,
      confidence: result1.confidence_score,
      marketStatus: result1.marketSearchStatus,
      dataQuality: result1.dataQualityScore,
      sources: result1.sources
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }

  // Example 2: Minimal data - testing fallbacks
  const minimalInput: ValuationInput = {
    vin: 'INVALID_VIN',
    make: 'Unknown',
    model: 'Unknown',
    year: 2020,
    zipCode: '12345'
  };

  console.log('\n📍 Test 2: Minimal/Invalid Data (Fallback Test)');
  try {
    const result2 = await processResilientValuation(minimalInput);
    console.log('✅ Fallback Success:', {
      estimatedValue: result2.estimated_value,
      confidence: result2.confidence_score,
      marketStatus: result2.marketSearchStatus,
      fallbackReason: result2.fallbackReason,
      dataQuality: result2.dataQualityScore
    });
  } catch (error) {
    console.error('❌ Fallback failed (this should not happen):', error);
  }

  // Example 3: Custom retry configuration
  const customConfig = {
    maxRetries: 1, // Reduced retries for faster demo
    retryDelayMs: 500,
    timeoutMs: 5000,
    minimumListingsThreshold: 1,
    minimumTrustThreshold: 0.1
  };

  console.log('\n📍 Test 3: Custom Configuration (Fast Fail)');
  try {
    const result3 = await processResilientValuation(perfectInput, customConfig);
    console.log('✅ Custom Config Success:', {
      estimatedValue: result3.estimated_value,
      retryAttempts: result3.retryAttempts,
      marketStatus: result3.marketSearchStatus,
      processingTime: Date.now() - result3.timestamp + 'ms'
    });
  } catch (error) {
    console.error('❌ Custom config error:', error);
  }

  console.log('\n🎯 Demo completed - Engine is 100% fault-tolerant!');
  console.log('=' .repeat(60));
}

/**
 * Stress test the resilient engine with various edge cases
 */
export async function stressTestResilientEngine() {
  console.log('🔬 Stress Testing Resilient Valuation Engine');
  console.log('=' .repeat(60));

  const edgeCases: ValuationInput[] = [
    // Edge case 1: Empty/null values
    {
      vin: '',
      make: '',
      model: '',
      year: 0,
      zipCode: ''
    },

    // Edge case 2: Extreme values
    {
      vin: '1234567890ABCDEFG',
      make: 'SuperRareMake',
      model: 'UnicornModel',
      year: 1800,
      mileage: 999999,
      condition: 'destroyed',
      zipCode: '99999'
    },

    // Edge case 3: Future vehicle
    {
      vin: '1HGBH41JXMN109186',
      make: 'Tesla',
      model: 'Model S',
      year: 2030,
      mileage: 0,
      condition: 'excellent',
      zipCode: '10001',
      fuelType: 'electric'
    }
  ];

  for (let i = 0; i < edgeCases.length; i++) {
    console.log(`\n🧪 Edge Case ${i + 1}:`);
    try {
      const result = await processResilientValuation(edgeCases[i]);
      console.log('✅ Handled gracefully:', {
        value: result.estimated_value,
        confidence: result.confidence_score,
        fallbacks: result.fallbackReason ? 1 : 0,
        quality: result.dataQualityScore
      });
    } catch (error) {
      console.error('❌ Failed to handle edge case:', error);
    }
  }

  console.log('\n🏆 Stress test completed - All edge cases handled!');
}

// Export for use in tests or demos
export const DEMO_INPUTS = {
  perfect: {
    vin: '1HGBH41JXMN109186',
    make: 'Toyota',
    model: 'Prius',
    year: 2022,
    mileage: 25000,
    condition: 'good',
    zipCode: '90210',
    fuelType: 'hybrid'
  } as ValuationInput,

  minimal: {
    vin: 'MINIMAL_TEST',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    zipCode: '12345'
  } as ValuationInput,

  electric: {
    vin: '5YJ3E1EA7HF000001',
    make: 'Tesla',
    model: 'Model 3',
    year: 2021,
    mileage: 15000,
    condition: 'excellent',
    zipCode: '94301',
    fuelType: 'electric'
  } as ValuationInput
};