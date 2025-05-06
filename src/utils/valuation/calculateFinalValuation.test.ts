
import { calculateFinalValuation, ValuationInput } from './calculateFinalValuation';
import { getMarketMultiplier } from './marketData';
import { getBestPhotoAssessment } from '../valuationService';
import { supabase } from '@/integrations/supabase/client';

// Mock the marketData and valuationService modules
jest.mock('./marketData', () => ({
  getMarketMultiplier: jest.fn(),
}));

jest.mock('../valuationService', () => ({
  getBestPhotoAssessment: jest.fn(),
}));

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
    update: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
  }
}));

describe('calculateFinalValuation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getMarketMultiplier as jest.Mock).mockResolvedValue(0);
    (getBestPhotoAssessment as jest.Mock).mockResolvedValue({ aiCondition: null, photoScores: [] });
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

  it('should apply regional market adjustment from Supabase for ZIP 90001 (+3.5%)', async () => {
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

  it('should handle database errors when fetching market multiplier', async () => {
    // Arrange
    (getMarketMultiplier as jest.Mock).mockRejectedValue(new Error('Database error'));
    
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

    // Assert - should default to 0% adjustment on error
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(0, 0);
  });

  it('should calculate feature adjustments accurately for Leather and Sunroof', async () => {
    // Arrange
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: ['Leather Seats', 'Sunroof'],
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.featureAdjustments['Leather Seats']).toBe(300);
    expect(result.adjustments.featureAdjustments['Sunroof']).toBe(350);
    
    // Calculate total feature adjustments
    const totalFeatureAdjustments = Object.values(result.adjustments.featureAdjustments).reduce((sum, val) => sum + val, 0);
    expect(totalFeatureAdjustments).toBe(650);
  });

  it('should use AI condition when photo assessment exists with confidence score >= 70%', async () => {
    // Arrange
    (getBestPhotoAssessment as jest.Mock).mockResolvedValue({
      aiCondition: {
        condition: 'Fair',
        confidenceScore: 85,
        issuesDetected: ['Minor scratches', 'Worn interior'],
        aiSummary: 'Vehicle shows signs of wear and tear'
      },
      photoScores: [
        { url: 'http://example.com/photo1.jpg', score: 0.6 },
        { url: 'http://example.com/photo2.jpg', score: 0.5 }
      ]
    });
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good', // User input says Good
      zipCode: '12345',
      features: [],
      valuationId: '123e4567-e89b-12d3-a456-426614174000' // Include a valuation ID to trigger photo assessment
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(getBestPhotoAssessment).toHaveBeenCalledWith('123e4567-e89b-12d3-a456-426614174000');
    expect(result.conditionSource).toBe('ai');
    // Should use 'Fair' condition adjustment (-8%) instead of 'Good' (0%)
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(-1600, 0); // -8% of 20000
    expect(result.aiSummary).toBe('Vehicle shows signs of wear and tear');
  });

  it('should NOT use AI condition when photo assessment confidence score is below 70%', async () => {
    // Arrange
    (getBestPhotoAssessment as jest.Mock).mockResolvedValue({
      aiCondition: {
        condition: 'Fair',
        confidenceScore: 65, // Below 70% threshold
        issuesDetected: ['Minor scratches'],
        aiSummary: 'Vehicle shows some signs of wear'
      },
      photoScores: [
        { url: 'http://example.com/photo1.jpg', score: 0.5 }
      ]
    });
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: [],
      valuationId: '123e4567-e89b-12d3-a456-426614174000'
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.conditionSource).toBe('user');
    // Should use 'Good' condition adjustment (0%) since AI score confidence is too low
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(0, 0);
    expect(result.aiSummary).toBeUndefined();
  });

  it('should handle errors when fetching photo assessment', async () => {
    // Arrange
    (getBestPhotoAssessment as jest.Mock).mockRejectedValue(new Error('Failed to fetch photo assessment'));
    
    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2019,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '12345',
      features: [],
      valuationId: '123e4567-e89b-12d3-a456-426614174000'
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert - should fall back to user-provided condition
    expect(result.conditionSource).toBe('user');
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(0, 0); // 'Good' = 0%
  });

  it('should use provided aiConditionOverride when specified', async () => {
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
        condition: 'Poor',
        confidenceScore: 90,
        issuesDetected: ['Significant body damage', 'Interior stains'],
        aiSummary: 'Vehicle is in poor condition with significant issues'
      }
    };

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.conditionSource).toBe('ai');
    // Should use 'Poor' condition adjustment (-15%)
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(-3000, 0); // -15% of 20000
    expect(result.aiSummary).toBe('Vehicle is in poor condition with significant issues');
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
      features: ['Leather Seats', 'Sunroof'], // $300 + $350 = $650
    };

    // Expected adjustments:
    // Mileage: 20000 * -0.10 = -2000
    // Condition: 20000 * 0.05 = 1000
    // Regional: 20000 * 0.03 = 600
    // Features: 300 + 350 = 650
    // Total: -2000 + 1000 + 600 + 650 = 250
    // Final: 20000 + 250 = 20250

    // Act
    const result = await calculateFinalValuation(input);

    // Assert
    expect(result.adjustments.mileageAdjustment).toBeCloseTo(-2000, 0);
    expect(result.adjustments.conditionAdjustment).toBeCloseTo(1000, 0);
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(600, 0);
    
    const totalFeatureAdjustments = Object.values(result.adjustments.featureAdjustments).reduce((sum, val) => sum + val, 0);
    expect(totalFeatureAdjustments).toBe(650);
    
    expect(result.totalAdjustments).toBeCloseTo(250, 0);
    expect(result.finalValuation).toBeCloseTo(20250, 0);
  });
});
