/**
 * Validation Test for Prompt 2.3: Listing Anchoring + Confidence Score Logic
 * This validates that the enhanced valuation engine properly uses real market listings
 * for price anchoring and confidence scoring.
 */

import { calculateEnhancedValuation } from '@/services/enhancedValuationEngine';
import { searchMarketListings } from '@/services/valuation/marketSearchAgent';

interface ValidationResult {
  testCase: string;
  passed: boolean;
  details: {
    listingsFound: number;
    isUsingFallbackMethod: boolean;
    confidenceScore: number;
    basePriceAnchor: any;
    estimatedValue: number;
    valuationMethod: string;
    marketListings: any[];
    adjustments: any[];
    issues: string[];
    logs: string[];
  };
}

export async function validateListingAnchoringLogic(): Promise<ValidationResult[]> {
  console.log('🧪 Starting Listing Anchoring + Confidence Score Validation (Prompt 2.3)');
  console.log('=' .repeat(70));
  
  const testCases = [
    {
      name: 'Ford F-150 with Expected Listings',
      input: {
        vin: '1FTEW1CP7MKD73632',
        make: 'Ford',
        model: 'F-150',
        year: 2021,
        mileage: 84000,
        condition: 'good',
        zipCode: '95821'
      },
      expectations: {
        shouldHaveListings: true,
        minListings: 2,
        maxConfidence: 95,
        minConfidence: 75,
        shouldUseFallback: false,
        valuationMethod: 'marketListings'
      }
    },
    {
      name: 'Nissan Altima with Few/No Listings',
      input: {
        vin: '1N4BL4BV8NN341985',
        make: 'Nissan',
        model: 'Altima',
        year: 2022,
        mileage: 25000,
        condition: 'excellent',
        zipCode: '10001'
      },
      expectations: {
        shouldHaveListings: false,
        minListings: 0,
        maxConfidence: 60,
        minConfidence: 45,
        shouldUseFallback: true,
        valuationMethod: 'fallbackMSRP'
      }
    }
  ];

  const results: ValidationResult[] = [];

  for (const testCase of testCases) {
    console.log(`\n🔍 Testing: ${testCase.name}`);
    console.log('-'.repeat(50));
    
    const logs: string[] = [];
    const issues: string[] = [];
    
    try {
      // Capture original console.log
      const originalLog = console.log;
      console.log = (...args) => {
        logs.push(args.join(' '));
        originalLog(...args);
      };

      // Step 1: Test market search first
      console.log('📊 Step 1: Testing market search agent...');
      const marketListings = await searchMarketListings({
        vin: testCase.input.vin,
        make: testCase.input.make,
        model: testCase.input.model,
        year: testCase.input.year,
        zipCode: testCase.input.zipCode
      });

      console.log(`Market Search Results: ${marketListings.length} listings found`);

      // Step 2: Test enhanced valuation engine
      console.log('🚀 Step 2: Testing enhanced valuation engine...');
      const valuationResult = await calculateEnhancedValuation(testCase.input);

      // Restore console.log
      console.log = originalLog;

      // Step 3: Validate Results
      console.log('✅ Step 3: Validating results...');

      // Validation 1: Listing Usage
      if (testCase.expectations.shouldHaveListings) {
        if (valuationResult.marketListings.length < testCase.expectations.minListings) {
          issues.push(`Expected at least ${testCase.expectations.minListings} listings, got ${valuationResult.marketListings.length}`);
        }
      }

      // Validation 2: Price Anchoring Logic
      if (valuationResult.marketListings.length >= 2) {
        if (valuationResult.basePriceAnchor.source !== 'market_listings') {
          issues.push(`Expected market_listings anchor, got ${valuationResult.basePriceAnchor.source}`);
        }
        if (valuationResult.basePriceAnchor.listingsUsed !== valuationResult.marketListings.length) {
          issues.push(`Anchor listings count mismatch: expected ${valuationResult.marketListings.length}, got ${valuationResult.basePriceAnchor.listingsUsed}`);
        }
        
        // Validate median calculation
        if (valuationResult.marketListings.length > 0) {
          const prices = valuationResult.marketListings.map(l => l.price);
          const sortedPrices = prices.sort((a, b) => a - b);
          const expectedMedian = sortedPrices.length % 2 === 0
            ? (sortedPrices[sortedPrices.length / 2 - 1] + sortedPrices[sortedPrices.length / 2]) / 2
            : sortedPrices[Math.floor(sortedPrices.length / 2)];
          
          const priceDifference = Math.abs(valuationResult.basePriceAnchor.price - expectedMedian);
          if (priceDifference > expectedMedian * 0.1) { // Allow 10% variance for outlier filtering
            issues.push(`Median price calculation issue: expected ~${expectedMedian}, got ${valuationResult.basePriceAnchor.price}`);
          }
        }
      }

      // Validation 3: Confidence Scoring
      if (valuationResult.confidenceScore > testCase.expectations.maxConfidence) {
        issues.push(`Confidence too high: ${valuationResult.confidenceScore}% > ${testCase.expectations.maxConfidence}%`);
      }
      if (valuationResult.confidenceScore < testCase.expectations.minConfidence) {
        issues.push(`Confidence too low: ${valuationResult.confidenceScore}% < ${testCase.expectations.minConfidence}%`);
      }

      // Validation 4: Fallback Status
      if (valuationResult.isUsingFallbackMethod !== testCase.expectations.shouldUseFallback) {
        issues.push(`Fallback status incorrect: expected ${testCase.expectations.shouldUseFallback}, got ${valuationResult.isUsingFallbackMethod}`);
      }

      // Validation 5: Valuation Method
      if (valuationResult.valuationMethod !== testCase.expectations.valuationMethod) {
        issues.push(`Valuation method incorrect: expected ${testCase.expectations.valuationMethod}, got ${valuationResult.valuationMethod}`);
      }

      // Validation 6: Return Payload Structure
      const requiredFields = ['estimatedValue', 'confidenceScore', 'basePriceAnchor', 'isUsingFallbackMethod', 'marketListings', 'confidenceBreakdown', 'adjustments'];
      for (const field of requiredFields) {
        if (!(field in valuationResult)) {
          issues.push(`Missing required field: ${field}`);
        }
      }

      // Validation 7: Base Price Anchor Structure
      if (valuationResult.basePriceAnchor) {
        const anchorFields = ['price', 'source', 'confidence', 'listingsUsed'];
        for (const field of anchorFields) {
          if (!(field in valuationResult.basePriceAnchor)) {
            issues.push(`Missing basePriceAnchor field: ${field}`);
          }
        }
      }

      const result: ValidationResult = {
        testCase: testCase.name,
        passed: issues.length === 0,
        details: {
          listingsFound: valuationResult.marketListings.length,
          isUsingFallbackMethod: valuationResult.isUsingFallbackMethod,
          confidenceScore: valuationResult.confidenceScore,
          basePriceAnchor: valuationResult.basePriceAnchor,
          estimatedValue: valuationResult.estimatedValue,
          valuationMethod: valuationResult.valuationMethod,
          marketListings: valuationResult.marketListings,
          adjustments: valuationResult.adjustments,
          issues,
          logs
        }
      };

      results.push(result);

      // Log test results
      console.log(`📊 Test Results for ${testCase.name}:`);
      console.log(`   Status: ${result.passed ? 'PASS' : 'FAIL'}`);
      console.log(`   Listings Found: ${result.details.listingsFound}`);
      console.log(`   Confidence Score: ${result.details.confidenceScore}%`);
      console.log(`   Using Fallback: ${result.details.isUsingFallbackMethod}`);
      console.log(`   Valuation Method: ${result.details.valuationMethod}`);
      console.log(`   Estimated Value: $${result.details.estimatedValue.toLocaleString()}`);
      console.log(`   Base Price: $${result.details.basePriceAnchor.price.toLocaleString()} (${result.details.basePriceAnchor.source})`);
      
      if (result.details.issues.length > 0) {
        console.log(`   Issues Found: ${result.details.issues.length}`);
        result.details.issues.forEach((issue, i) => {
          console.log(`     ${i + 1}. ${issue}`);
        });
      }

    } catch (error) {
      console.error(`❌ Test failed for ${testCase.name}:`, error);
      
      results.push({
        testCase: testCase.name,
        passed: false,
        details: {
          listingsFound: 0,
          isUsingFallbackMethod: true,
          confidenceScore: 0,
          basePriceAnchor: null,
          estimatedValue: 0,
          valuationMethod: 'error',
          marketListings: [],
          adjustments: [],
          issues: [`Test execution failed: ${error instanceof Error ? error.message : String(error)}`],
          logs
        }
      });
    }
  }

  // Final Summary
  console.log('\n📊 Prompt 2.3 Validation Summary:');
  console.log('=' .repeat(70));
  
  const passedTests = results.filter(r => r.passed).length;
  const totalTests = results.length;
  
  console.log(`✅ Tests Passed: ${passedTests}/${totalTests}`);
  
  // Detailed validation criteria check
  console.log('\n🎯 Prompt 2.3 Success Criteria Validation:');
  console.log('-'.repeat(50));
  
  const criteriaChecks = [
    {
      name: 'Listings used in valuation logic',
      passed: results.some(r => r.details.listingsFound > 0 && !r.details.isUsingFallbackMethod)
    },
    {
      name: 'Real median used for base value',
      passed: results.some(r => r.details.basePriceAnchor?.source === 'market_listings')
    },
    {
      name: 'Confidence dynamically scored',
      passed: results.every(r => r.details.confidenceScore >= 45 && r.details.confidenceScore <= 95)
    },
    {
      name: 'Fallback only triggered if needed',
      passed: results.every(r => 
        (r.details.listingsFound >= 2 && !r.details.isUsingFallbackMethod) ||
        (r.details.listingsFound < 2 && r.details.isUsingFallbackMethod)
      )
    },
    {
      name: 'All required fields present',
      passed: results.every(r => r.details.issues.filter(i => i.includes('Missing')).length === 0)
    }
  ];

  criteriaChecks.forEach(check => {
    console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
  });

  const allCriteriaPassed = criteriaChecks.every(c => c.passed);
  console.log(`\n🏆 Overall Status: ${allCriteriaPassed ? 'SUCCESS' : 'NEEDS ATTENTION'}`);

  return results;
}

// Export individual test functions for debugging
export async function testFordF150Listings() {
  const listings = await searchMarketListings({
    vin: '1FTEW1CP7MKD73632',
    make: 'Ford',
    model: 'F-150',
    year: 2021,
    zipCode: '95821'
  });
  
  console.log('Ford F-150 Market Listings:', listings);
  return listings;
}

export async function testNissanAltimaListings() {
  const listings = await searchMarketListings({
    vin: '1N4BL4BV8NN341985',
    make: 'Nissan',
    model: 'Altima',
    year: 2022,
    zipCode: '10001'
  });
  
  console.log('Nissan Altima Market Listings:', listings);
  return listings;
}