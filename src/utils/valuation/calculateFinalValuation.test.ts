import { calculateFinalValuation } from './calculateFinalValuation';
import { ValuationInput, ValuationResult, AdjustmentBreakdown } from '../../types/valuation';
import { expect, test, describe } from 'vitest';

describe('calculateFinalValuation', () => {
  test('applies mileage adjustment correctly', () => {
    // Create input with correct types
    const input: ValuationInput = {
      identifierType: 'manual',
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 30000,
      condition: 'Good',
    };
    
    // Call with the correct arguments
    const baseValue = 15000;
    const options = { includeMock: true };
    const result = calculateFinalValuation(input, baseValue, options);
    
    // Check result properties
    expect(result.estimatedValue).toBeGreaterThan(0);
    
    // Find the mileage adjustment in the array instead of accessing by property name
    const mileageAdjustment = result.adjustments.find(adj => adj.name === 'Mileage');
    expect(mileageAdjustment).toBeDefined();
    
    // Verify the mileage adjustment is reasonable
    if (mileageAdjustment) {
      // Lower mileage should result in positive adjustment
      expect(mileageAdjustment.value).toBeGreaterThan(0);
    }
  });

  test('applies condition adjustment correctly', () => {
    // Create input with correct types
    const input: ValuationInput = {
      identifierType: 'manual',
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      mileage: 45000,
      condition: 'Excellent',
    };
    
    // Call with the correct arguments
    const baseValue = 18000;
    const options = { includeMock: true };
    const result = calculateFinalValuation(input, baseValue, options);
    
    // Check result properties
    expect(result.estimatedValue).toBeGreaterThan(0);
    
    // Find the condition adjustment in the array
    const conditionAdjustment = result.adjustments.find(adj => adj.name === 'Condition');
    expect(conditionAdjustment).toBeDefined();
    
    // Excellent condition should result in positive adjustment
    if (conditionAdjustment) {
      expect(conditionAdjustment.value).toBeGreaterThan(0);
    }
  });

  test('applies regional adjustment for high-demand areas', () => {
    const input: ValuationInput = {
      identifierType: 'manual',
      make: 'Tesla',
      model: 'Model 3',
      year: 2020,
      mileage: 20000,
      condition: 'Good',
      zipCode: '94105', // San Francisco - high demand area
    };
    
    const baseValue = 35000;
    const options = { includeMock: true };
    const result = calculateFinalValuation(input, baseValue, options);
    
    // Find the regional adjustment in the array
    const regionalAdjustment = result.adjustments.find(adj => adj.name === 'Location');
    expect(regionalAdjustment).toBeDefined();
    
    // High-demand area should have positive adjustment
    if (regionalAdjustment) {
      expect(regionalAdjustment.value).toBeGreaterThanOrEqual(0);
    }
  });

  test('applies regional adjustment for low-demand areas', () => {
    const input: ValuationInput = {
      identifierType: 'manual',
      make: 'Ford',
      model: 'F-150',
      year: 2017,
      mileage: 60000,
      condition: 'Fair',
      zipCode: '12345', // Mock low-demand area
    };
    
    const baseValue = 22000;
    const options = { includeMock: true };
    const result = calculateFinalValuation(input, baseValue, options);
    
    // Find the regional adjustment in the array
    const regionalAdjustment = result.adjustments.find(adj => adj.name === 'Location');
    expect(regionalAdjustment).toBeDefined();
  });

  test('calculates confidence score based on available data', () => {
    const input: ValuationInput = {
      identifierType: 'manual',
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2016,
      mileage: 70000,
      condition: 'Good',
      zipCode: '60601', // Chicago
      fuelType: 'Gasoline',
      transmission: 'Automatic',
    };
    
    const baseValue = 12000;
    const options = { includeMock: true };
    const result = calculateFinalValuation(input, baseValue, options);
    
    // More complete data should result in higher confidence
    expect(result.confidenceScore).toBeGreaterThan(70);
    
    // Price range should be narrower with higher confidence
    const rangeDifference = result.priceRange[1] - result.priceRange[0];
    expect(rangeDifference).toBeLessThan(baseValue * 0.3); // Less than 30% range
  });

  test('includes all required properties in the result', () => {
    const input: ValuationInput = {
      identifierType: 'manual',
      make: 'Subaru',
      model: 'Outback',
      year: 2019,
      mileage: 35000,
      condition: 'Good',
    };
    
    const baseValue = 24000;
    const options = { includeMock: true };
    const result = calculateFinalValuation(input, baseValue, options);
    
    // Check that all required properties exist
    expect(result).toHaveProperty('estimatedValue');
    expect(result).toHaveProperty('basePrice');
    expect(result).toHaveProperty('adjustments');
    expect(result).toHaveProperty('priceRange');
    expect(result).toHaveProperty('confidenceScore');
    
    // Verify the result structure
    expect(Array.isArray(result.adjustments)).toBe(true);
    expect(Array.isArray(result.priceRange)).toBe(true);
    expect(result.priceRange.length).toBe(2);
    expect(result.priceRange[0]).toBeLessThan(result.priceRange[1]);
  });
});
