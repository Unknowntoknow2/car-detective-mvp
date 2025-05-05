
import { generateValuationExplanation } from '../utils/generateValuationExplanation';
import { supabase } from '@/integrations/supabase/client';
import { calculateFinalValuation } from '../utils/valuation/calculateFinalValuation';

// Mock the Supabase client and calculateFinalValuation function
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    functions: {
      invoke: jest.fn(),
    },
  },
}));

jest.mock('../utils/valuation/calculateFinalValuation', () => ({
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
    (calculateFinalValuation as jest.Mock).mockResolvedValue({
      adjustments: [
        { name: 'Mileage', impact: -5, description: 'High mileage' },
        { name: 'Condition', impact: 3, description: 'Good condition' },
        { name: 'Regional Market', impact: 2, description: 'High demand area' },
        { name: 'Premium Features', impact: 1, description: 'Some premium features' },
      ],
      finalValue: 25000,
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 25000,
    };

    // Act
    const result = await generateValuationExplanation(params);

    // Assert
    expect(result).toBe(mockExplanation);
    expect(supabase.functions.invoke).toHaveBeenCalledWith('generate-explanation', {
      body: expect.objectContaining({
        make: 'Honda',
        model: 'Civic',
        year: 2018,
        mileage: 45000,
        condition: 'Good',
        location: '90210',
        valuation: 25000,
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
    
    (calculateFinalValuation as jest.Mock).mockResolvedValue({
      adjustments: [],
      finalValue: 25000,
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 25000,
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
    
    (calculateFinalValuation as jest.Mock).mockResolvedValue({
      adjustments: [],
      finalValue: 25000,
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 25000,
    };

    // Act & Assert
    await expect(generateValuationExplanation(params)).rejects.toThrow('No explanation received from server');
  });

  it('should handle network errors gracefully', async () => {
    // Arrange
    (supabase.functions.invoke as jest.Mock).mockRejectedValue(new Error('Network error'));
    
    (calculateFinalValuation as jest.Mock).mockResolvedValue({
      adjustments: [],
      finalValue: 25000,
    });
    
    const params = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      condition: 'Good',
      location: '90210',
      valuation: 25000,
    };

    // Act & Assert
    await expect(generateValuationExplanation(params)).rejects.toThrow('Failed to generate explanation: Network error');
  });
});
