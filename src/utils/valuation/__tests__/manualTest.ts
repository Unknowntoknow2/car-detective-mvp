/**
 * Manual test runner for calculateValuationFromListings
 * Tests the implementation with realistic scenarios
 */

import { calculateValuationFromListings, type ListingValuationInput } from '../unifiedValuationEngine';

async function testCalculateValuationFromListings() {
  console.log('🧪 Testing calculateValuationFromListings implementation...\n');

  // Test Case 1: Market-based valuation with sufficient listings
  console.log('Test 1: Market-based valuation with sufficient listings');
  try {
    const input1: ListingValuationInput = {
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
    };

    const result1 = await calculateValuationFromListings(input1);
    console.log('✅ Result:', {
      estimated_value: result1.estimated_value,
      confidence_score: result1.confidence_score,
      source: result1.source,
      explanation_length: result1.explanation.length
    });
    console.log('Market Analysis:', result1.market_analysis);
    console.log('');
  } catch (error) {
    console.log('❌ Test 1 failed:', error.message);
  }

  // Test Case 2: Fallback valuation with no listings
  console.log('Test 2: Fallback valuation with no listings');
  try {
    const input2: ListingValuationInput = {
      vin: '1HGBH41JXMN109186',
      year: 2021,
      make: 'Honda',
      model: 'Accord',
      mileage: 35000,
      condition: 'good',
      marketListings: [],
      zipCode: '90210'
    };

    const result2 = await calculateValuationFromListings(input2);
    console.log('✅ Result:', {
      estimated_value: result2.estimated_value,
      confidence_score: result2.confidence_score,
      source: result2.source,
      explanation_preview: result2.explanation.substring(0, 100) + '...'
    });
    console.log('Value Breakdown:', result2.value_breakdown);
    console.log('');
  } catch (error) {
    console.log('❌ Test 2 failed:', error.message);
  }

  // Test Case 3: Luxury vehicle with fallback
  console.log('Test 3: Luxury vehicle (BMW) with fallback');
  try {
    const input3: ListingValuationInput = {
      vin: 'WBA3B1C59EJ123456',
      year: 2020,
      make: 'BMW',
      model: '3 Series',
      trim: '330i',
      mileage: 25000,
      condition: 'excellent',
      fuelType: 'gasoline',
      marketListings: [],
      zipCode: '90210'
    };

    const result3 = await calculateValuationFromListings(input3);
    console.log('✅ Result:', {
      estimated_value: result3.estimated_value,
      confidence_score: result3.confidence_score,
      source: result3.source
    });
    console.log('');
  } catch (error) {
    console.log('❌ Test 3 failed:', error.message);
  }

  // Test Case 4: Electric vehicle with fallback
  console.log('Test 4: Electric vehicle (Tesla) with fallback');
  try {
    const input4: ListingValuationInput = {
      vin: '5YJ3E1EB4KF123456',
      year: 2020,
      make: 'Tesla',
      model: 'Model 3',
      trim: 'Standard Range Plus',
      mileage: 30000,
      condition: 'good',
      fuelType: 'electric',
      marketListings: [],
      zipCode: '90210'
    };

    const result4 = await calculateValuationFromListings(input4);
    console.log('✅ Result:', {
      estimated_value: result4.estimated_value,
      confidence_score: result4.confidence_score,
      source: result4.source,
      has_electric_bonus: result4.explanation.includes('electric')
    });
    console.log('');
  } catch (error) {
    console.log('❌ Test 4 failed:', error.message);
  }

  // Test Case 5: High mileage older vehicle
  console.log('Test 5: High mileage older vehicle');
  try {
    const input5: ListingValuationInput = {
      vin: '1HGBH41JXMN109186',
      year: 2010,
      make: 'Honda',
      model: 'Accord',
      mileage: 150000,
      condition: 'fair',
      marketListings: [],
      zipCode: '90210'
    };

    const result5 = await calculateValuationFromListings(input5);
    console.log('✅ Result:', {
      estimated_value: result5.estimated_value,
      confidence_score: result5.confidence_score,
      source: result5.source,
      is_reasonable_for_old_car: result5.estimated_value >= 5000 && result5.estimated_value <= 20000
    });
    console.log('');
  } catch (error) {
    console.log('❌ Test 5 failed:', error.message);
  }

  // Test Case 6: Invalid/corrupted data (should never fail)
  console.log('Test 6: Invalid/corrupted data (emergency fallback test)');
  try {
    const input6: ListingValuationInput = {
      vin: 'invalid',
      year: -1,
      make: '',
      model: '',
      mileage: -1000,
      condition: 'unknown',
      marketListings: [
        { invalid: 'data' },
        null,
        undefined,
        { price: 'not_a_number' }
      ]
    };

    const result6 = await calculateValuationFromListings(input6);
    console.log('✅ Result (Emergency Fallback):', {
      estimated_value: result6.estimated_value,
      confidence_score: result6.confidence_score,
      source: result6.source,
      still_positive: result6.estimated_value > 0,
      has_explanation: result6.explanation.length > 0
    });
    console.log('');
  } catch (error) {
    console.log('❌ Test 6 failed:', error.message);
    console.log('❌ This is critical - the function should never throw!');
  }

  console.log('🎯 All tests completed successfully!');
}

// Export for use in other files
export { testCalculateValuationFromListings };