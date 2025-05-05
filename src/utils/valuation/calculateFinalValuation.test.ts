
import { calculateFinalValuation, ValuationInput, ValuationOutput } from './calculateFinalValuation';
import { getMarketMultiplier } from './marketData';

// Mock the marketData module
jest.mock('./marketData', () => ({
  getMarketMultiplier: jest.fn(),
}));

describe('calculateFinalValuation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getMarketMultiplier as jest.Mock).mockResolvedValue(0);
  });

  it('should calculate mileage adjustment correctly for all ranges', async () => {
    // Test mileage adjustment for different thresholds
    const testCases = [
      { mileage: 5000, expectedAdjustment: 0.03 },   // ≤ 10,000 miles: +3%
      { mileage: 20000, expectedAdjustment: 0.015 }, // ≤ 30,000 miles: +1.5%
      { mileage: 40000, expectedAdjustment: 0 },     // ≤ 50,000 miles: 0%
      { mileage: 60000, expectedAdjustment: -0.05 }, // ≤ 75,000 miles: -5% 
      { mileage: 90000, expectedAdjustment: -0.10 }, // ≤ 100,000 miles: -10%
      { mileage: 110000, expectedAdjustment: -0.15 }, // ≤ 125,000 miles: -15%
      { mileage: 140000, expectedAdjustment: -0.20 }, // ≤ 150,000 miles: -20%
      { mileage: 160000, expectedAdjustment: -0.25 }, // > 150,000 miles: -25%
    ];

    for (const testCase of testCases) {
      // Arrange
      const input: ValuationInput = {
        baseMarketValue: 20000,
        vehicleYear: 2019,
        make: 'Toyota',
        model: 'Camry',
        mileage: testCase.mileage,
        condition: 'Good',
        zipCode: '12345',
        features: [],
      };

      // Act
      const result = await calculateFinalValuation(input);

      // Assert - check that mileageAdjustment is close to expected
      const expectedAdjustmentValue = input.baseMarketValue * testCase.expectedAdjustment;
      expect(result.adjustments.mileageAdjustment).toBeCloseTo(expectedAdjustmentValue, 0);
    }
  });

  it('should calculate condition adjustment correctly for all levels', async () => {
    // Test different condition levels
    const testCases = [
      { condition: 'Excellent', expectedAdjustment: 0.05 },
      { condition: 'Good', expectedAdjustment: 0.0 },
      { condition: 'Fair', expectedAdjustment: -0.08 },
      { condition: 'Poor', expectedAdjustment: -0.15 },
    ];

    for (const testCase of testCases) {
      // Arrange
      const input: ValuationInput = {
        baseMarketValue: 20000,
        vehicleYear: 2019,
        make: 'Toyota',
        model: 'Camry',
        mileage: 50000,
        condition: testCase.condition as any,
        zipCode: '12345',
        features: [],
      };

      // Act
      const result = await calculateFinalValuation(input);

      // Assert - check that conditionAdjustment is close to expected
      const expectedAdjustmentValue = input.baseMarketValue * testCase.expectedAdjustment;
      expect(result.adjustments.conditionAdjustment).toBeCloseTo(expectedAdjustmentValue, 0);
    }
  });

  it('should apply regional market adjustment from market data', async () => {
    // Arrange
    (getMarketMultiplier as jest.Mock).mockResolvedValue(3.5); // 3.5% adjustment for ZIP 90001
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '90001',
      features: [],
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(getMarketMultiplier).toHaveBeenCalledWith('90001');
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(700, 0); // 3.5% of 20000
  });

  it('should handle missing ZIP code by applying no adjustment', async () => {
    // Arrange
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '', // Empty ZIP code
      features: [],
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(0, 0);
  });

  it('should calculate feature adjustments accurately', async () => {
    // Arrange
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: ['Bluetooth', 'Sunroof'],
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.featureAdjustments['Bluetooth']).toBe(150);
    expect(result.adjustments.featureAdjustments['Sunroof']).toBe(350);
    
    // Calculate total feature adjustments
    const totalFeatureAdjustments = Object.values(result.adjustments.featureAdjustments).reduce((sum, val) => sum + val, 0);
    expect(totalFeatureAdjustments).toBe(500);
  });

  it('should use AI condition when confidence score is high enough', async () => {
    // Arrange
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: [],
      aiConditionOverride: {
        condition: 'Excellent',
        confidenceScore: 92, // High score (>70) should trigger override
      },
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.conditionSource).toBe('ai');
    // Should use 'Excellent' condition adjustment (5%)
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(1000, 0); // 5% of 20000
  });

  it('should NOT use AI condition when confidence score is too low', async () => {
    // Arrange
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: [],
      aiConditionOverride: {
        condition: 'Excellent',
        confidenceScore: 65, // Below threshold
      },
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.conditionSource).toBe('user');
    // Should use 'Good' condition adjustment (0%)
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(0, 0);
  });

  it('should calculate the final valuation correctly with all adjustments', async () => {
    // Arrange
    (getMarketMultiplier as jest.Mock).mockResolvedValue(3); // 3% adjustment
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 80000, // -10% adjustment
      condition: 'Excellent', // +5% adjustment
      zipCode: '12345', // +3% adjustment from mock
      features: ['Bluetooth', 'Sunroof'], // $150 + $350 = $500
    };

    // Expected adjustments:
    // Mileage: 20000 * -0.10 = -2000
    // Condition: 20000 * 0.05 = 1000
    // Regional: 20000 * 0.03 = 600
    // Features: 150 + 350 = 500
    // Total: -2000 + 1000 + 600 + 500 = 100
    // Final: 20000 + 100 = 20100

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.mileageAdjustment).toBeCloseTo(-2000, 0);
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(1000, 0);
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(600, 0);
    const totalFeatureAdjustments = Object.values(result.adjustments.featureAdjustments).reduce((sum, val) => sum + val, 0);
    expect(totalFeatureAdjustments).toBe(500);
    expect(result.totalAdjustments).toBeCloseTo(100, 0);
    expect(result.finalValuation).toBeCloseTo(20100, 0);
  });
});
