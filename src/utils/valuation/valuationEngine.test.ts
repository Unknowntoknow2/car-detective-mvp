
import { calculateValuation } from './valuationEngine';
import { getMileageAdjustment } from '../adjustments/mileageAdjustments';
import { getConditionAdjustment } from '../adjustments/conditionAdjustments';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    maybeSingle: jest.fn()
  }
}));

// Mock adjustment functions
jest.mock('../adjustments/mileageAdjustments', () => ({
  getMileageAdjustment: jest.fn()
}));

jest.mock('../adjustments/conditionAdjustments', () => ({
  getConditionAdjustment: jest.fn()
}));

describe('valuationEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Default mock implementation for adjustment functions
    (getMileageAdjustment as jest.Mock).mockReturnValue(-1000);
    (getConditionAdjustment as jest.Mock).mockReturnValue(500);
    
    // Mock Supabase response for zip code lookup
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: { market_multiplier: 2.5 },
            error: null
          })
        })
      })
    });
  });

  it('should calculate a basic valuation with minimal parameters', async () => {
    const result = await calculateValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 30000,
      condition: 'good'
    });

    expect(result).toBeDefined();
    expect(result.estimatedValue).toBeGreaterThan(0);
    expect(result.basePrice).toBe(20000); // default base price in our simplified example
    expect(result.adjustments.length).toBeGreaterThanOrEqual(2); // at least mileage and condition
    expect(result.priceRange).toHaveLength(2);
    expect(result.confidenceScore).toBeGreaterThan(0);
    expect(result.confidenceScore).toBeLessThanOrEqual(100);
  });

  it('should apply all available adjustments when parameters are provided', async () => {
    const result = await calculateValuation({
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 30000,
      condition: 'excellent',
      zip: '90210',
      trim: 'XSE',
      accidentCount: 1,
      premiumFeatures: ['leather', 'sunroof'],
      titleStatus: 'clean',
      mpg: 32
    });

    expect(result.adjustments.length).toBeGreaterThanOrEqual(5);
    
    // Check that specific adjustments are included
    const adjustmentNames = result.adjustments.map(adj => adj.name);
    expect(adjustmentNames).toContain('Mileage');
    expect(adjustmentNames).toContain('Condition');
    expect(adjustmentNames).toContain('Location');
  });

  it('should handle missing optional parameters gracefully', async () => {
    const result = await calculateValuation({
      make: 'Honda',
      model: 'Accord',
      year: 2018,
      mileage: 40000,
      condition: 'fair'
    });

    expect(result).toBeDefined();
    expect(result.estimatedValue).toBeGreaterThan(0);
  });

  it('should apply market multiplier from zip code correctly', async () => {
    // Mock a specific market multiplier
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: { market_multiplier: 5.0 },
            error: null
          })
        })
      })
    });

    const result = await calculateValuation({
      make: 'BMW',
      model: '3 Series',
      year: 2021,
      mileage: 15000,
      condition: 'excellent',
      zip: '94105'
    });

    // Find the location adjustment
    const locationAdjustment = result.adjustments.find(adj => adj.name === 'Location');
    expect(locationAdjustment).toBeDefined();
    
    // With a 5% market multiplier on a $20000 base price, we expect a $1000 adjustment
    expect(locationAdjustment?.percentAdjustment).toBe(5.0);
    expect(locationAdjustment?.value).toBe(1000);
  });

  it('should handle Supabase errors gracefully', async () => {
    // Mock a Supabase error
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          maybeSingle: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      })
    });

    const result = await calculateValuation({
      make: 'Ford',
      model: 'Mustang',
      year: 2019,
      mileage: 25000,
      condition: 'good',
      zip: '33101'
    });

    // Should still return a valid result despite the error
    expect(result).toBeDefined();
    expect(result.estimatedValue).toBeGreaterThan(0);
    
    // Should not include a location adjustment due to the error
    const locationAdjustment = result.adjustments.find(adj => adj.name === 'Location');
    expect(locationAdjustment).toBeUndefined();
  });
});
