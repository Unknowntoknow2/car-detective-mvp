/**
 * Test file for calculateValuationFromListings function
 * Validates that the function always returns a positive, reasonable value
 */

import { calculateValuationFromListings, type ListingValuationInput } from '@/utils/valuation/unifiedValuationEngine';

describe('calculateValuationFromListings', () => {
  const baseInput: ListingValuationInput = {
    vin: '1HGBH41JXMN109186',
    year: 2021,
    make: 'Honda',
    model: 'Accord',
    trim: 'LX',
    mileage: 35000,
    condition: 'good',
    fuelType: 'gasoline',
    marketListings: [],
    zipCode: '90210'
  };

  it('should return market-based valuation when sufficient listings are available', async () => {
    const inputWithListings: ListingValuationInput = {
      ...baseInput,
      marketListings: [
        { price: 28000, mileage: 30000, condition: 'good' },
        { price: 29500, mileage: 32000, condition: 'excellent' },
        { price: 27000, mileage: 40000, condition: 'fair' },
        { price: 28500, mileage: 35000, condition: 'good' },
        { price: 29000, mileage: 28000, condition: 'very good' }
      ]
    };

    const result = await calculateValuationFromListings(inputWithListings);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.estimated_value).toBeGreaterThan(20000);
    expect(result.estimated_value).toBeLessThan(50000);
    expect(result.confidence_score).toBeGreaterThan(50);
    expect(result.source).toBe('market_listings');
    expect(result.explanation).toContain('market listings');
    expect(result.market_analysis).toBeDefined();
    expect(result.market_analysis?.listing_count).toBe(5);
  });

  it('should return fallback valuation when no listings are available', async () => {
    const inputWithoutListings: ListingValuationInput = {
      ...baseInput,
      marketListings: []
    };

    const result = await calculateValuationFromListings(inputWithoutListings);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.estimated_value).toBeGreaterThan(5000);
    expect(result.confidence_score).toBeGreaterThan(25);
    expect(result.source).toBe('fallback_algorithm');
    expect(result.explanation).toContain('depreciation-based algorithm');
    expect(result.value_breakdown).toBeDefined();
  });

  it('should return fallback valuation when insufficient listings are available', async () => {
    const inputWithFewListings: ListingValuationInput = {
      ...baseInput,
      marketListings: [
        { price: 28000, mileage: 30000, condition: 'good' },
        { price: 29500, mileage: 32000, condition: 'excellent' }
      ]
    };

    const result = await calculateValuationFromListings(inputWithFewListings);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.estimated_value).toBeGreaterThan(5000);
    expect(result.confidence_score).toBeGreaterThan(25);
    expect(result.source).toBe('fallback_algorithm');
    expect(result.explanation).toContain('depreciation-based algorithm');
  });

  it('should filter out invalid listings and use only valid ones', async () => {
    const inputWithMixedListings: ListingValuationInput = {
      ...baseInput,
      marketListings: [
        { price: 28000, mileage: 30000, condition: 'good' },
        { price: null, mileage: 32000, condition: 'excellent' }, // Invalid
        { price: 0, mileage: 40000, condition: 'fair' }, // Invalid
        { price: 28500, mileage: 35000, condition: 'good' },
        { price: 29000, mileage: 28000, condition: 'very good' },
        { price: 1000000, mileage: 50000, condition: 'good' } // Invalid (too high)
      ]
    };

    const result = await calculateValuationFromListings(inputWithMixedListings);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.confidence_score).toBeGreaterThan(25);
    expect(result.source).toBe('market_listings'); // Should use the 3 valid listings
    expect(result.market_analysis?.listing_count).toBe(3);
  });

  it('should handle luxury vehicles correctly', async () => {
    const luxuryInput: ListingValuationInput = {
      ...baseInput,
      make: 'BMW',
      model: '3 Series',
      year: 2020,
      mileage: 25000,
      marketListings: []
    };

    const result = await calculateValuationFromListings(luxuryInput);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.estimated_value).toBeGreaterThan(25000); // Should be higher for luxury
    expect(result.confidence_score).toBeGreaterThan(25);
    expect(result.source).toBe('fallback_algorithm');
  });

  it('should handle older vehicles correctly', async () => {
    const olderInput: ListingValuationInput = {
      ...baseInput,
      year: 2010,
      mileage: 120000,
      condition: 'fair',
      marketListings: []
    };

    const result = await calculateValuationFromListings(olderInput);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.estimated_value).toBeGreaterThan(5000); // Minimum value
    expect(result.estimated_value).toBeLessThan(20000); // Should be lower for older vehicle
    expect(result.confidence_score).toBeGreaterThan(25);
    expect(result.source).toBe('fallback_algorithm');
  });

  it('should handle electric vehicles with bonus', async () => {
    const electricInput: ListingValuationInput = {
      ...baseInput,
      make: 'Tesla',
      model: 'Model 3',
      fuelType: 'electric',
      marketListings: []
    };

    const result = await calculateValuationFromListings(electricInput);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.confidence_score).toBeGreaterThan(25);
    expect(result.source).toBe('fallback_algorithm');
    expect(result.explanation).toContain('electric');
  });

  it('should never throw an error and always return a value', async () => {
    const invalidInput: ListingValuationInput = {
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
    };

    const result = await calculateValuationFromListings(invalidInput);

    expect(result.estimated_value).toBeGreaterThan(0);
    expect(result.estimated_value).toBeGreaterThan(5000); // Emergency minimum
    expect(result.confidence_score).toBeGreaterThan(0);
    expect(result.source).toBeDefined();
    expect(result.explanation).toBeDefined();
    expect(typeof result.explanation).toBe('string');
    expect(result.explanation.length).toBeGreaterThan(0);
  });

  it('should provide detailed explanations for all valuation types', async () => {
    const testCases = [
      { marketListings: [], expectedSource: 'fallback_algorithm' },
      { 
        marketListings: [
          { price: 25000, mileage: 30000 },
          { price: 26000, mileage: 32000 },
          { price: 24000, mileage: 35000 }
        ], 
        expectedSource: 'market_listings' 
      }
    ];

    for (const testCase of testCases) {
      const input: ListingValuationInput = {
        ...baseInput,
        marketListings: testCase.marketListings
      };

      const result = await calculateValuationFromListings(input);

      expect(result.explanation).toBeDefined();
      expect(result.explanation.length).toBeGreaterThan(50);
      expect(result.source).toBe(testCase.expectedSource);
      expect(result.explanation).toContain(input.make);
      expect(result.explanation).toContain(input.model);
      expect(result.explanation).toContain(input.year.toString());
    }
  });

  it('should handle condition adjustments correctly', async () => {
    const conditions = ['excellent', 'good', 'fair', 'poor'];
    
    for (const condition of conditions) {
      const input: ListingValuationInput = {
        ...baseInput,
        condition,
        marketListings: []
      };

      const result = await calculateValuationFromListings(input);

      expect(result.estimated_value).toBeGreaterThan(0);
      expect(result.confidence_score).toBeGreaterThan(25);
      expect(result.explanation).toContain(condition);
    }
  });

  it('should handle mileage variations correctly', async () => {
    const mileageTestCases = [10000, 50000, 100000, 150000];
    
    for (const mileage of mileageTestCases) {
      const input: ListingValuationInput = {
        ...baseInput,
        mileage,
        marketListings: []
      };

      const result = await calculateValuationFromListings(input);

      expect(result.estimated_value).toBeGreaterThan(0);
      expect(result.confidence_score).toBeGreaterThan(25);
      expect(result.explanation).toContain(mileage.toLocaleString());
    }
  });
});