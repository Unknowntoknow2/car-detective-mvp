
import { generateValuationExplanation } from './generateValuationExplanation';
import { supabase } from '@/integrations/supabase/client';
import { calculateFinalValuation } from './valuationCalculator';

// Mock the Supabase client and calculateFinalValuation function
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

jest.mock('./valuationCalculator', () => ({
  calculateFinalValuation: jest.fn(),
}));

describe('generateValuationExplanation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully generate an explanation when Supabase function returns data', async () => {
    // Arrange
    const mockExplanation = 'This is a detailed explanation of your vehicle valuation...';
    
    // Mock the Supabase function invoke to return a successful response
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { explanation: mockExplanation },
      error: null,
    });
    
    // Mock calculateFinalValuation to return some valuation details
    (calculateFinalValuation as jest.Mock).mockReturnValue({
      adjustments: [
        { name: 'Mileage', impact: -2000, description: 'High mileage', percentage: -10 },
        { name: 'Condition', impact: 1000, description: 'Excellent condition', percentage: 5 },
        { name: 'Regional Market', impact: 600, description: 'High demand area', percentage: 3 },
        { name: 'Premium Features', impact: 650, description: 'Premium features including Leather Seats, Sunroof', percentage: 3.25 },
      ],
      finalValue: 20250,
      baseValue: 20000
    });
    
    const params = {
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 80000,
      condition: 'Excellent',
      location: '12345',
      valuation: 20250,
    };

    // Act
    const result = await generateValuationExplanation(params);

    // Assert
    expect(result).toBe(mockExplanation);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-explanation', {
      body: expect.objectContaining({
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        mileage: 80000,
        condition: 'Excellent',
        location: '12345',
        valuation: 20250,
        baseMarketValue: expect.any(Number),
        adjustments: expect.any(Array)
      }),
    });
  });

  it('should verify correct formatting of the request data to the edge function', async () => {
    // Arrange
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { explanation: 'Explanation text' },
      error: null,
    });
    
    (calculateFinalValuation as jest.Mock).mockReturnValue({
      adjustments: [
        { name: 'Mileage', impact: -2000, description: 'High mileage', percentage: -10 },
        { name: 'Condition', impact: 1000, description: 'Excellent condition', percentage: 5 },
      ],
      finalValue: 19000,
      baseValue: 20000
    });
    
    const params = {
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 80000,
      condition: 'Excellent',
      location: '12345',
      valuation: 19000,
    };

    // Act
    await generateValuationExplanation(params);

    // Assert - check that the request body is formatted correctly with all required fields
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-explanation', {
      body: expect.objectContaining({
        make: 'Toyota',
        model: 'Camry',
        year: 2019,
        mileage: 80000,
        condition: 'Excellent',
        location: '12345',
        valuation: 19000,
        baseMarketValue: expect.any(Number),
        mileageAdj: expect.any(Number),
        conditionAdj: expect.any(Number),
        adjustments: expect.arrayContaining([
          expect.objectContaining({
            factor: expect.any(String),
            impact: expect.any(Number),
            description: expect.any(String)
          })
        ])
      }),
    });
  });

  it('should throw an error if the Supabase function returns an error', async () => {
    // Arrange
    const errorMessage = 'Failed to generate explanation';
    
    // Mock the Supabase function invoke to return an error
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: null,
      error: { message: errorMessage },
    });
    
    (calculateFinalValuation as jest.Mock).mockReturnValue({
      adjustments: [],
      finalValue: 20000,
      baseValue: 20000
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 18500,
    };

    // Act & Assert
    await expect(generateValuationExplanation(params)).rejects.toThrow(`Failed to generate explanation: ${errorMessage}`);
  });

  it('should throw an error if no explanation is returned', async () => {
    // Arrange
    // Mock the Supabase function invoke to return success but no explanation
    (supabase.functions.invoke as jest.Mock).mockResolvedValue({
      data: { someOtherData: 'but no explanation' },
      error: null,
    });
    
    (calculateFinalValuation as jest.Mock).mockReturnValue({
      adjustments: [],
      finalValue: 20000,
      baseValue: 20000
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 18500,
    };

    // Act & Assert
    await expect(generateValuationExplanation(params)).rejects.toThrow('No explanation received from server');
  });

  it('should handle network errors gracefully', async () => {
    // Arrange
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    (calculateFinalValuation as jest.Mock).mockReturnValue({
      adjustments: [],
      finalValue: 20000,
      baseValue: 20000
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 18500,
    };

    // Act & Assert
    await expect(generateValuationExplanation(params)).rejects.toThrow('Failed to generate explanation: Network error');
  });
});
