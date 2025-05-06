
import { getMarketMultiplier } from './marketData';
import { calculateFinalValuation, ValuationInput } from './calculateFinalValuation';
import { supabase } from '@/integrations/supabase/client';

// Mock the Supabase client
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

describe('marketData module', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return the correct market multiplier for a ZIP code', async () => {
    // Mock the Supabase response for ZIP code 90001 (3.5%)
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { market_multiplier: 3.5 },
            error: null
          })
        })
      })
    });

    const result = await getMarketMultiplier('90001');
    expect(result).toBe(3.5);
    expect(supabase.from).toHaveBeenCalledWith('market_adjustments');
  });

  it('should return 0 for unknown ZIP codes', async () => {
    // Mock the Supabase response for an unknown ZIP code
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'No data found' }
          })
        })
      })
    });

    const result = await getMarketMultiplier('99999');
    expect(result).toBe(0);
  });

  it('should return 0 if the ZIP code is empty', async () => {
    const result = await getMarketMultiplier('');
    expect(result).toBe(0);
    // Supabase should not be called if ZIP is empty
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    // Mock an error response from Supabase
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Database error' }
          })
        })
      })
    });

    const result = await getMarketMultiplier('90001');
    expect(result).toBe(0);
  });
});

describe('calculateFinalValuation with market adjustments', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should apply the correct regional adjustment for ZIP 90001 (+3.5%)', async () => {
    // Mock the Supabase response for ZIP code 90001 (3.5%)
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { market_multiplier: 3.5 },
            error: null
          })
        })
      })
    });

    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '90001',
      features: []
    };

    const result = await calculateFinalValuation(input);
    
    // Expected regional adjustment: 20000 * (3.5 / 100) = 700
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(700, 0);
  });

  it('should apply negative adjustment for ZIP 60601 (-1.5%)', async () => {
    // Mock the Supabase response for ZIP code 60601 (-1.5%)
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { market_multiplier: -1.5 },
            error: null
          })
        })
      })
    });

    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '60601',
      features: []
    };

    const result = await calculateFinalValuation(input);
    
    // Expected regional adjustment: 20000 * (-1.5 / 100) = -300
    expect(result.adjustments.regionalAdjustment).toBeCloseTo(-300, 0);
  });

  it('should apply no adjustment for unknown ZIP codes', async () => {
    // Mock the Supabase response for an unknown ZIP code
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'No data found' }
          })
        })
      })
    });

    const input: ValuationInput = {
      baseMarketValue: 20000,
      vehicleYear: 2020,
      make: 'Toyota',
      model: 'Camry',
      mileage: 50000,
      condition: 'Good',
      zipCode: '99999',
      features: []
    };

    const result = await calculateFinalValuation(input);
    
    // Expected regional adjustment: 0
    expect(result.adjustments.regionalAdjustment).toBe(0);
  });
});
