import { calculateFinalValuation } from './calculateFinalValuation';
import { AICondition } from '@/types/photo';

describe('calculateFinalValuation', () => {
  const basePrice = 25000;

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
      photoScore: 0.78,
      zipCode: '90210',
      aiConditionOverride: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: [],
        summary: 'Vehicle appears to be in good condition with no major issues detected.'
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
        issuesDetected: [],
        summary: 'Vehicle appears to be in excellent condition with no major issues detected.'
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
      trim: 'XLE',
      zipCode: '90210',
      aiConditionOverride: {
        condition: 'Good',
        confidenceScore: 80,
        issuesDetected: [],
        summary: 'Vehicle appears to be in good condition with no major issues detected.'
      }
    }, basePrice);

    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeGreaterThan(0);
  });
});
