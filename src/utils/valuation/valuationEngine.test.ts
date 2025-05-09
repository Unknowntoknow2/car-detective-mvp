
import { calculateValuation, getBaseValue } from './valuationEngine';
import { EnhancedValuationParams } from './types';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn()
  }
}));

describe('valuationEngine', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getBaseValue', () => {
    it('should return the base value from database', async () => {
      // Mock Supabase response
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { base_price: 25000 },
                error: null
              })
            })
          })
        })
      });
      
      const result = await getBaseValue({
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        zipCode: '90210'
      });
      
      expect(result).toBe(25000);
    });
    
    it('should return default value if database error', async () => {
      // Mock Supabase error
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'DB Error' }
              })
            })
          })
        })
      });
      
      const result = await getBaseValue({
        make: 'Unknown',
        model: 'Model',
        year: 2022,
        zipCode: '12345'
      });
      
      expect(result).toBe(15000); // Default value
    });
  });
  
  describe('calculateValuation', () => {
    it('should calculate valuation with all adjustments', async () => {
      // Mock getBaseValue
      jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({ baseValue: 25000 })
      } as unknown as Response);
      
      const params: EnhancedValuationParams = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'excellent',
        zipCode: '90210', // Add zipCode parameter
        fuelType: 'hybrid',
        bodyType: 'sedan',
        baseMarketValue: 25000 // Add required baseMarketValue
      };
      
      const result = await calculateValuation(params);
      
      expect(result.estimatedValue).toBeGreaterThan(0);
      expect(result.adjustments.length).toBeGreaterThan(0);
      expect(result.confidenceScore).toBeGreaterThan(0);
      expect(result.priceRange).toHaveLength(2);
    });
    
    it('should account for accident history', async () => {
      const params: EnhancedValuationParams = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'good',
        zipCode: '90210', // Add zipCode parameter
        accidentCount: 2,
        titleStatus: 'clean', // Keep this for backward compatibility
        baseMarketValue: 25000 // Add required baseMarketValue
      };
      
      const result = await calculateValuation(params);
      
      // Check for accident adjustment
      const accidentAdjustment = result.adjustments.find(
        adj => adj.name === 'Accident History' || adj.factor === 'Accident History'
      );
      
      expect(accidentAdjustment).toBeDefined();
      expect(accidentAdjustment!.value).toBeLessThan(0); // Negative impact
    });
    
    it('should handle missing optional parameters', async () => {
      const params: EnhancedValuationParams = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'good',
        zipCode: '90210', // Add zipCode parameter
        baseMarketValue: 25000 // Add required baseMarketValue
      };
      
      const result = await calculateValuation(params);
      
      expect(result.estimatedValue).toBeGreaterThan(0);
      expect(result.confidenceScore).toBeGreaterThan(0);
    });
    
    it('should apply regional adjustments based on ZIP code', async () => {
      // Mock the market multiplier data
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
      
      const params: EnhancedValuationParams = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'good',
        zipCode: '90210', // Add zipCode parameter
        baseMarketValue: 25000 // Add required baseMarketValue
      };
      
      const result = await calculateValuation(params);
      
      // Check for location adjustment
      const locationAdjustment = result.adjustments.find(
        adj => adj.name === 'Location Impact' || adj.factor === 'Location Impact'
      );
      
      expect(locationAdjustment).toBeDefined();
    });
    
    it('should handle premium features', async () => {
      const params: EnhancedValuationParams = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'good',
        zipCode: '90210', // Add zipCode parameter
        premiumFeatures: ['leather_seats', 'navigation', 'sunroof'],
        baseMarketValue: 25000 // Add required baseMarketValue
      };
      
      const result = await calculateValuation(params);
      
      // Check for features adjustment
      const featuresAdjustment = result.adjustments.find(
        adj => adj.name === 'Premium Features' || adj.factor === 'Premium Features'
      );
      
      expect(featuresAdjustment).toBeDefined();
      expect(featuresAdjustment!.value).toBeGreaterThan(0); // Positive impact
    });
  });
});
