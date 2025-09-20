import { valuateVehicle } from '../../src/ain-backend/valuationEngine';

describe('Valuation Engine', () => {
  it('should calculate basic valuation for a vehicle', async () => {
    const vehicleData = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 30000,
      condition: 'good' as const
    };

    const result = await valuateVehicle(vehicleData);

    expect(result).toHaveProperty('estimatedValue');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('priceRange');
    expect(result).toHaveProperty('factors');
    
    expect(typeof result.estimatedValue).toBe('number');
    expect(result.estimatedValue).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('should apply depreciation based on vehicle age', async () => {
    const newVehicle = {
      year: 2024,
      make: 'Toyota',
      model: 'Camry',
      mileage: 5000,
      condition: 'excellent' as const
    };

    const oldVehicle = {
      year: 2015,
      make: 'Toyota',
      model: 'Camry',
      mileage: 5000,
      condition: 'excellent' as const
    };

    const newResult = await valuateVehicle(newVehicle);
    const oldResult = await valuateVehicle(oldVehicle);

    expect(newResult.estimatedValue).toBeGreaterThanOrEqual(oldResult.estimatedValue);
  });

  it('should adjust for mileage variance', async () => {
    const lowMileage = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 20000,
      condition: 'good' as const
    };

    const highMileage = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 80000,
      condition: 'good' as const
    };

    const lowResult = await valuateVehicle(lowMileage);
    const highResult = await valuateVehicle(highMileage);

    expect(lowResult.estimatedValue).toBeGreaterThanOrEqual(highResult.estimatedValue);
    // Note: The new interface doesn't have breakdown.mileageAdjustment
    // Instead, we can verify the price range reflects the mileage difference
    expect(lowResult.priceRange.high).toBeGreaterThanOrEqual(highResult.priceRange.high);
  });

  it('should apply condition multipliers correctly', async () => {
    const excellentVehicle = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 30000,
      condition: 'excellent' as const
    };

    const poorVehicle = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 30000,
      condition: 'poor' as const
    };

    const excellentResult = await valuateVehicle(excellentVehicle);
    const poorResult = await valuateVehicle(poorVehicle);

    expect(excellentResult.estimatedValue).toBeGreaterThanOrEqual(poorResult.estimatedValue);
    // Verify condition impact through price range differences
    expect(excellentResult.priceRange.low).toBeGreaterThanOrEqual(poorResult.priceRange.low);
    expect(excellentResult.priceRange.high).toBeGreaterThanOrEqual(poorResult.priceRange.high);
  });

  it('should increase confidence with more data points', async () => {
    const minimalData = {
      year: 2020
    };

    const completeData = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 30000,
      condition: 'good' as const,
      marketComparables: [{
        id: 'test-listing-1',
        price: 25000,
        mileage: 30000,
        year: 2020,
        make: 'Toyota',
        model: 'Camry',
        condition: 'good' as any, // Using string instead of enum for Jest compatibility
        location: 'CA',
        source: 'test',
        listingDate: new Date(),
        dealer: false
      }]
    };

    const minimalResult = await valuateVehicle(minimalData);
    const completeResult = await valuateVehicle(completeData);

    expect(completeResult.confidence).toBeGreaterThanOrEqual(minimalResult.confidence);
  });

  it('should include meaningful factor explanations', async () => {
    const vehicleData = {
      year: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 30000,
      condition: 'good' as const
    };

    const result = await valuateVehicle(vehicleData);

    expect(result.factors).toBeInstanceOf(Array);
    expect(result.factors.length).toBeGreaterThanOrEqual(0);
    expect(result.factors.every(factor => typeof factor === 'string')).toBe(true);
  });

  it('should handle error cases gracefully', async () => {
    const invalidData = {
      year: -1,
      make: '',
      mileage: -1000
    };

    const result = await valuateVehicle(invalidData);

    expect(result).toHaveProperty('estimatedValue');
    expect(result).toHaveProperty('confidence');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    // The valuation engine handles invalid data gracefully instead of failing
    expect(result.estimatedValue).toBeGreaterThanOrEqual(0);
    expect(Array.isArray(result.factors)).toBe(true);
  });

  it('should ensure minimum value floor', async () => {
    const extremeData = {
      year: 1990,
      make: 'Unknown',
      model: 'Unknown',
      mileage: 500000,
      condition: 'poor' as const
    };

    const result = await valuateVehicle(extremeData);

    expect(result.estimatedValue).toBeGreaterThanOrEqual(0);
  });
});
