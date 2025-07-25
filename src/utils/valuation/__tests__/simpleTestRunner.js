#!/usr/bin/env node

/**
 * Simple test runner to validate calculateValuationFromListings functionality
 * This tests the core requirements without needing a full test framework
 */

const { calculateValuationFromListings } = require('../unifiedValuationEngine.ts');

async function runTests() {
  console.log('🧪 Testing calculateValuationFromListings functionality...\n');

  const tests = [
    {
      name: 'Test 1: Market-based valuation with sufficient listings',
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
          { price: 28000, mileage: 30000, condition: 'good' },
          { price: 29500, mileage: 32000, condition: 'excellent' },
          { price: 27000, mileage: 40000, condition: 'fair' },
          { price: 28500, mileage: 35000, condition: 'good' },
          { price: 29000, mileage: 28000, condition: 'very good' }
        ],
        zipCode: '90210'
      },
      expectations: {
        minValue: 20000,
        maxValue: 50000,
        minConfidence: 50,
        expectedSource: 'market_listings'
      }
    },
    {
      name: 'Test 2: Fallback valuation with no listings',
      input: {
        vin: '1HGBH41JXMN109186',
        year: 2021,
        make: 'Honda',
        model: 'Accord',
        mileage: 35000,
        condition: 'good',
        marketListings: [],
        zipCode: '90210'
      },
      expectations: {
        minValue: 5000,
        maxValue: 100000,
        minConfidence: 25,
        expectedSource: 'fallback_algorithm'
      }
    },
    {
      name: 'Test 3: Luxury vehicle fallback',
      input: {
        vin: '1HGBH41JXMN109186',
        year: 2020,
        make: 'BMW',
        model: '3 Series',
        mileage: 25000,
        condition: 'good',
        marketListings: [],
        zipCode: '90210'
      },
      expectations: {
        minValue: 25000,
        maxValue: 100000,
        minConfidence: 25,
        expectedSource: 'fallback_algorithm'
      }
    },
    {
      name: 'Test 4: Invalid data handling (emergency fallback)',
      input: {
        vin: 'invalid',
        year: -1,
        make: '',
        model: '',
        mileage: -1000,
        condition: 'unknown',
        marketListings: [
          { invalid: 'data' },
          null,
          undefined
        ]
      },
      expectations: {
        minValue: 5000,
        maxValue: 100000,
        minConfidence: 0,
        expectedSource: 'emergency_fallback'
      }
    }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      console.log(`Running ${test.name}...`);
      
      const result = await calculateValuationFromListings(test.input);
      
      // Validate basic requirements
      const checks = [
        { condition: result.estimated_value > 0, message: 'Estimated value must be positive' },
        { condition: result.estimated_value >= test.expectations.minValue, message: `Value must be >= ${test.expectations.minValue}` },
        { condition: result.estimated_value <= test.expectations.maxValue, message: `Value must be <= ${test.expectations.maxValue}` },
        { condition: result.confidence_score >= test.expectations.minConfidence, message: `Confidence must be >= ${test.expectations.minConfidence}` },
        { condition: result.source === test.expectations.expectedSource, message: `Source must be ${test.expectations.expectedSource}` },
        { condition: typeof result.explanation === 'string' && result.explanation.length > 0, message: 'Must have explanation' },
        { condition: result.value_breakdown !== undefined, message: 'Must have value breakdown' }
      ];

      let testPassed = true;
      for (const check of checks) {
        if (!check.condition) {
          console.log(`  ❌ ${check.message}`);
          testPassed = false;
        }
      }

      if (testPassed) {
        console.log(`  ✅ PASSED`);
        console.log(`     Value: $${result.estimated_value.toLocaleString()}`);
        console.log(`     Confidence: ${result.confidence_score}%`);
        console.log(`     Source: ${result.source}`);
        passedTests++;
      } else {
        console.log(`  ❌ FAILED`);
        console.log(`     Result:`, JSON.stringify(result, null, 2));
      }
      
    } catch (error) {
      console.log(`  ❌ FAILED with error: ${error.message}`);
    }
    
    console.log('');
  }

  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! The implementation meets the requirements.');
    return true;
  } else {
    console.log('❌ Some tests failed. Please review the implementation.');
    return false;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = { runTests };