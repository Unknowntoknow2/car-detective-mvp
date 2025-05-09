import { calculateFinalValuation } from './calculateFinalValuation';

// Fix 1: Remove incorrect import
// import { ValuationOutput } from './calculateFinalValuation';

// Fix 2: Add basePrice consistently
const basePrice = 25000;

describe('calculateFinalValuation', () => {
  test('should calculate base valuation', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210'
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with mileage adjustment', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 100000,
      condition: 'Good',
      zipCode: '90210'
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with condition adjustment', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Excellent',
      zipCode: '90210'
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with photo score adjustment', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      photoScore: 0.78,
      aiConditionOverride: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: []
      }
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with AI condition override', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      aiConditionOverride: {
        condition: 'Excellent',
        confidenceScore: 95,
        issuesDetected: []
      }
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should handle missing parameters gracefully', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      aiConditionOverride: {
        condition: 'Fair',
        confidenceScore: 60,
        issuesDetected: []
      }
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with trim adjustment', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Good',
      zipCode: '90210',
      trim: 'XLE',
      aiConditionOverride: {
        condition: 'Good',
        confidenceScore: 80,
        issuesDetected: []
      }
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });
});
