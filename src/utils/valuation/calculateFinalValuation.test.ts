
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

  it('should calculate mileage adjustment correctly', async () => {
    // Test different mileage thresholds
    const testCases = [
      { mileage: 5000, expectedAdjustment: 0.03 }, // <= 10000
      { mileage: 20000, expectedAdjustment: 0.015 }, // <= 30000
      { mileage: 40000, expectedAdjustment: 0 }, // <= 50000
      { mileage: 60000, expectedAdjustment: -0.05 }, // <= 75000
      { mileage: 90000, expectedAdjustment: -0.10 }, // <= 100000
      { mileage: 110000, expectedAdjustment: -0.15 }, // <= 125000
      { mileage: 140000, expectedAdjustment: -0.20 }, // <= 150000
      { mileage: 160000, expectedAdjustment: -0.25 }, // > 150000
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

  it('should calculate condition adjustment correctly', async () => {
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

  it('should apply regional market adjustment correctly', async () => {
    // Arrange
    (getMarketMultiplier as jest.Mock).mockResolvedValue(5); // 5% adjustment
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: [],
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(getMarketMultiplier).toHaveBeenCalledWith('12345');
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(1000, 0); // 5% of 20000
  });

  it('should calculate feature adjustments correctly', async () => {
    // Arrange
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: ['Leather Seats', 'Navigation System', 'Sunroof'],
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.featureAdjustments['Leather Seats']).toBe(300);
    expect(result.adjustments.featureAdjustments['Navigation System']).toBe(250);
    expect(result.adjustments.featureAdjustments['Sunroof']).toBe(350);
    
    // Calculate total feature adjustments
    const totalFeatureAdjustments = Object.values(result.adjustments.featureAdjustments).reduce((sum, val) => sum + val, 0);
    expect(totalFeatureAdjustments).toBe(900);
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
        confidenceScore: 75,
      },
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.conditionSource).toBe('ai');
    // Should use 'Excellent' condition adjustment (5%)
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(1000, 0); // 5% of 20000
  });

  it('should not use AI condition when confidence score is too low', async () => {
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

  it('should calculate the final valuation correctly', async () => {
    // Arrange
    (getMarketMultiplier as jest.Mock).mockResolvedValue(3); // 3% adjustment
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 80000, // -10% adjustment
      condition: 'Excellent', // +5% adjustment
      zipCode: '12345', // +3% adjustment
      features: ['Leather Seats', 'Navigation System'], // $300 + $250 = $550
    };

    // Expected adjustments:
    // Mileage: 20000 * -0.10 = -2000
    // Condition: 20000 * 0.05 = 1000
    // Regional: 20000 * 0.03 = 600
    // Features: 300 + 250 = 550
    // Total: -2000 + 1000 + 600 + 550 = 150
    // Final: 20000 + 150 = 20150

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.mileageAdjustment).toBeCloseTo(-2000, 0);
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(1000, 0);
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(600, 0);
    expect(result.totalAdjustments).toBeCloseTo(150, 0);
    expect(result.finalValuation).toBeCloseTo(20150, 0);
  });
});
