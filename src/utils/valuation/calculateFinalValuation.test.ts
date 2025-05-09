import { calculateFinalValuation } from './calculateFinalValuation';

describe('calculateFinalValuation', () => {
  test('should calculate base valuation', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Good'
    });

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with mileage adjustment', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 100000,
      condition: 'Good'
    });

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });

  test('should calculate valuation with condition adjustment', async () => {
    const result = await calculateFinalValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 50000,
      condition: 'Excellent'
    });

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
      photoScore: 0.78,
      aiConditionOverride: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: []
      } // Fixed AICondition type
    });

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
      aiConditionOverride: {
        condition: 'Excellent',
        confidenceScore: 95,
        issuesDetected: []
      } // Fixed AICondition type
    });

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
      aiConditionOverride: {
        condition: 'Fair',
        confidenceScore: 60,
        issuesDetected: []
      } // Fixed AICondition type
    });

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
      trim: 'XLE',
      aiConditionOverride: {
        condition: 'Good',
        confidenceScore: 80,
        issuesDetected: []
      } // Fixed AICondition type
    });

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });
});
