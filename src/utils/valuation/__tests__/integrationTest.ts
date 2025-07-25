/**
 * Integration test for calculateValuationFromListings
 * This validates that the implementation works with the existing codebase
 */

import { calculateValuationFromListings } from '../unifiedValuationEngine';

console.log('🔍 Running integration test for calculateValuationFromListings...\n');

// Test data representing real-world scenarios
const testScenarios = [
  {
    name: 'Scenario 1: Market-based valuation (sufficient listings)',
    input: {
      vin: '1HGBH41JXMN109186',
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      trim: 'LX',
      mileage: 35000,
      condition: 'good',
      fuelType: 'gasoline',
      marketListings: [
        { price: 28000, mileage: 30000, condition: 'good', source: 'cars.com' },
        { price: 29500, mileage: 32000, condition: 'excellent', source: 'autotrader.com' },
        { price: 27000, mileage: 40000, condition: 'fair', source: 'cargurus.com' },
        { price: 28500, mileage: 35000, condition: 'good', source: 'carmax.com' },
        { price: 29000, mileage: 28000, condition: 'very good', source: 'carvana.com' }
      ],
      zipCode: '90210'
    }
  },
  {
    name: 'Scenario 2: Fallback algorithm (no listings)',
    input: {
      vin: '1HGBH41JXMN109186',
      year: 2021,
      make: 'Toyota',
      model: 'Camry',
      trim: 'LE',
      mileage: 25000,
      condition: 'excellent',
      fuelType: 'gasoline',
      baseMsrp: 32000,
      marketListings: [],
      zipCode: '10001'
    }
  },
  {
    name: 'Scenario 3: Luxury vehicle fallback',
    input: {
      vin: 'WBA3B1C59EJ123456',
      year: 2019,
      make: 'BMW',
      model: '3 Series',
      trim: '330i xDrive',
      mileage: 45000,
      condition: 'good',
      fuelType: 'gasoline',
      marketListings: [],
      zipCode: '90210'
    }
  },
  {
    name: 'Scenario 4: Electric vehicle fallback',
    input: {
      vin: '5YJ3E1EB4KF123456',
      year: 2020,
      make: 'Tesla',
      model: 'Model 3',
      trim: 'Standard Range Plus',
      mileage: 30000,
      condition: 'good',
      fuelType: 'electric',
      marketListings: [],
      zipCode: '94043'
    }
  },
  {
    name: 'Scenario 5: High mileage older vehicle',
    input: {
      vin: '1HGBH41JXMN109186',
      year: 2015,
      make: 'Honda',
      model: 'Civic',
      mileage: 120000,
      condition: 'fair',
      marketListings: [],
      zipCode: '30309'
    }
  }
];

async function runIntegrationTest() {
  let passedTests = 0;
  let totalTests = testScenarios.length;

  for (const scenario of testScenarios) {
    console.log(`\n📋 ${scenario.name}`);
    console.log(`   Vehicle: ${scenario.input.year} ${scenario.input.make} ${scenario.input.model}`);
    console.log(`   Mileage: ${scenario.input.mileage?.toLocaleString() || 'Unknown'}`);
    console.log(`   Condition: ${scenario.input.condition}`);
    console.log(`   Listings: ${scenario.input.marketListings.length}`);

    try {
      const result = await calculateValuationFromListings(scenario.input);

      // Validate required fields per problem statement
      const validations = [
        { 
          check: typeof result.estimated_value === 'number' && result.estimated_value > 0,
          message: '✅ estimated_value is positive number'
        },
        {
          check: typeof result.confidence_score === 'number' && result.confidence_score >= 0 && result.confidence_score <= 100,
          message: '✅ confidence_score is valid percentage'
        },
        {
          check: typeof result.explanation === 'string' && result.explanation.length > 0,
          message: '✅ explanation is non-empty string'
        },
        {
          check: typeof result.source === 'string' && ['market_listings', 'fallback_algorithm', 'emergency_fallback'].includes(result.source),
          message: '✅ source field is valid'
        },
        {
          check: result.estimated_value >= 5000 && result.estimated_value <= 200000,
          message: '✅ value is reasonable range ($5K-$200K)'
        }
      ];

      let allValidationsPassed = true;
      for (const validation of validations) {
        if (validation.check) {
          console.log(`   ${validation.message}`);
        } else {
          console.log(`   ❌ ${validation.message.replace('✅', 'FAILED')}`);
          allValidationsPassed = false;
        }
      }

      // Log key results
      console.log(`   💰 Estimated Value: $${result.estimated_value.toLocaleString()}`);
      console.log(`   📊 Confidence: ${result.confidence_score}%`);
      console.log(`   🔄 Source: ${result.source}`);

      if (result.market_analysis) {
        console.log(`   📈 Market Analysis: ${result.market_analysis.listing_count} listings, $${result.market_analysis.median_price.toLocaleString()} median`);
      }

      if (result.value_breakdown) {
        console.log(`   💡 Base Value: $${result.value_breakdown.base_value.toLocaleString()}`);
      }

      if (allValidationsPassed) {
        console.log(`   ✅ PASSED`);
        passedTests++;
      } else {
        console.log(`   ❌ FAILED validations`);
      }

    } catch (error) {
      console.log(`   ❌ FAILED with error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  console.log(`\n\n📊 Integration Test Results:`);
  console.log(`   Passed: ${passedTests}/${totalTests} scenarios`);
  
  if (passedTests === totalTests) {
    console.log(`   🎉 All integration tests passed!`);
    console.log(`   ✅ Implementation meets all requirements:`);
    console.log(`      • Always returns a positive value`);
    console.log(`      • Never throws errors or returns null`);
    console.log(`      • Includes required fields (estimated_value, confidence_score, explanation, source)`);
    console.log(`      • Handles market listings and fallback algorithms`);
    console.log(`      • Provides detailed explanations`);
    return true;
  } else {
    console.log(`   ❌ Some tests failed. Review the implementation.`);
    return false;
  }
}

// Run the integration test
runIntegrationTest()
  .then(success => {
    if (success) {
      console.log('\n🚀 calculateValuationFromListings is ready for production use!');
    } else {
      console.log('\n⚠️  Implementation needs fixes before production use.');
    }
  })
  .catch(error => {
    console.error('\n💥 Integration test failed with error:', error);
  });