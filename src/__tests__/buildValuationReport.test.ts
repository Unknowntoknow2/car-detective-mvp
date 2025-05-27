
import { buildValuationReport } from '@/utils/pdf/buildValuationReport';

describe('buildValuationReport', () => {
  it('should return a default report data object when valuation data is null', () => {
    const result = buildValuationReport(null);

    expect(result).toEqual({
      id: 'N/A',
      make: 'N/A',
      model: 'N/A',
      year: 0,
      mileage: 0,
      condition: 'N/A',
      price: 0,
      zipCode: 'N/A',
      vin: 'N/A',
      fuelType: 'N/A',
      transmission: 'N/A',
      color: 'N/A',
      bodyType: 'N/A',
      confidenceScore: 0,
      isPremium: false,
      priceRange: [0, 0],
      adjustments: [],
      generatedAt: expect.any(String),
      explanation: 'N/A',
      userId: 'N/A',
    });
  });

  it('should correctly map valuation data to report data', () => {
    const valuationData = {
      id: '123',
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 60000,
      condition: 'Good',
      estimatedValue: 15000,
      zipCode: '90210',
      vin: '12345ABCDE',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Silver',
      bodyType: 'Sedan',
      confidenceScore: 85,
      isPremium: true,
      priceRange: [14000, 16000] as [number, number],
      adjustments: [{ factor: 'Mileage', impact: -500, description: 'High mileage' }],
      explanation: 'Vehicle is in good condition.',
      userId: 'user123',
      created_at: '2023-01-01T00:00:00Z'
    };

    const result = buildValuationReport(valuationData);

    expect(result).toEqual({
      id: '123',
      make: 'Toyota',
      model: 'Camry',
      year: 2018,
      mileage: 60000,
      condition: 'Good',
      price: 15000,
      zipCode: '90210',
      vin: '12345ABCDE',
      fuelType: 'Gasoline',
      transmission: 'Automatic',
      color: 'Silver',
      bodyType: 'Sedan',
      confidenceScore: 85,
      isPremium: true,
      priceRange: [14000, 16000],
      adjustments: [{ factor: 'Mileage', impact: -500, description: 'High mileage' }],
      generatedAt: expect.any(String),
      explanation: 'Vehicle is in good condition.',
      userId: 'user123',
    });
  });

  it('should handle missing fields in valuation data', () => {
    const valuationData = {
      id: '456',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      mileage: 40000,
      condition: 'Excellent',
      estimatedValue: 18000,
      created_at: '2023-01-01T00:00:00Z'
    };

    const result = buildValuationReport(valuationData as any);

    expect(result).toEqual({
      id: '456',
      make: 'Honda',
      model: 'Civic',
      year: 2020,
      mileage: 40000,
      condition: 'Excellent',
      price: 18000,
      zipCode: 'N/A',
      vin: 'N/A',
      fuelType: 'N/A',
      transmission: 'N/A',
      color: 'N/A',
      bodyType: 'N/A',
      confidenceScore: 0,
      isPremium: false,
      priceRange: [0, 0],
      adjustments: [],
      generatedAt: expect.any(String),
      explanation: 'N/A',
      userId: 'N/A',
    });
  });

  it('should handle empty adjustments array', () => {
    const valuationData = {
      id: '789',
      make: 'Ford',
      model: 'F-150',
      year: 2015,
      mileage: 80000,
      condition: 'Fair',
      estimatedValue: 12000,
      adjustments: [],
    };

    const result = buildValuationReport(valuationData as any);

    expect(result.adjustments).toEqual([]);
  });

  it('should handle undefined adjustments array', () => {
    const valuationData = {
      id: '789',
      make: 'Ford',
      model: 'F-150',
      year: 2015,
      mileage: 80000,
      condition: 'Fair',
      estimatedValue: 12000,
    } as any;

    const result = buildValuationReport(valuationData);

    expect(result.adjustments).toEqual([]);
  });

  it('should handle adjustments with missing fields', () => {
    const valuationData = {
      id: '012',
      make: 'Chevrolet',
      model: 'Malibu',
      year: 2019,
      mileage: 50000,
      condition: 'Good',
      estimatedValue: 16000,
      adjustments: [{ factor: 'Color' }],
    } as any;

    const result = buildValuationReport(valuationData);

    expect(result.adjustments).toEqual([{ factor: 'Color', impact: 0, description: '' }]);
  });

  it('should handle undefined userId', () => {
    const valuationData = {
      id: '345',
      make: 'BMW',
      model: 'X5',
      year: 2021,
      mileage: 25000,
      condition: 'Excellent',
      estimatedValue: 45000,
    } as any;

    const result = buildValuationReport(valuationData);

    expect(result.userId).toBe('N/A');
  });
});
