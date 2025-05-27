
import { testDeduplication } from '../useValuationHistory';
import type { Valuation } from '@/types/valuation-history';

describe('useValuationHistory', () => {
  describe('deduplication logic', () => {
    it('should deduplicate valuations with the same ID, preferring premium ones', () => {
      // Create test data with duplicate IDs
      const commonId = 'test-123';
      const valuations: Valuation[] = [
        // Regular valuation
        {
          id: commonId,
          createdAt: new Date('2023-05-01T12:00:00Z'),
          updatedAt: new Date('2023-05-01T12:00:00Z'),
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          is_premium: false,
          premium_unlocked: false,
        },
        // Premium version of the same valuation
        {
          id: commonId,
          createdAt: new Date('2023-05-02T12:00:00Z'),
          updatedAt: new Date('2023-05-02T12:00:00Z'),
          make: 'Toyota',
          model: 'Camry',
          year: 2020,
          is_premium: true,
          premium_unlocked: true,
        },
        // Different valuation
        {
          id: 'test-456',
          createdAt: new Date('2023-05-03T12:00:00Z'),
          updatedAt: new Date('2023-05-03T12:00:00Z'),
          make: 'Honda',
          model: 'Accord',
          year: 2021,
          is_premium: false,
          premium_unlocked: false,
        }
      ];

      const result = testDeduplication(valuations);

      // Expected: 2 items (deduped) and the premium one is kept
      expect(result.length).toBe(2);
      
      // Find the item with the common ID
      const dedupedItem = result.find(item => item.id === commonId);
      expect(dedupedItem).toBeDefined();
      expect(dedupedItem?.is_premium).toBe(true);
      expect(dedupedItem?.premium_unlocked).toBe(true);
    });

    it('should handle empty arrays and undefined values', () => {
      expect(testDeduplication([])).toEqual([]);
      
      // @ts-ignore - Testing with invalid input
      expect(testDeduplication(null)).toEqual([]);
      
      // @ts-ignore - Testing with invalid input
      expect(testDeduplication(undefined)).toEqual([]);
    });

    it('should prioritize most recent entries when premium status is the same', () => {
      const commonId = 'test-789';
      const valuations: Valuation[] = [
        {
          id: commonId,
          createdAt: new Date('2023-05-01T12:00:00Z'),
          updatedAt: new Date('2023-05-01T12:00:00Z'),
          make: 'Older',
          model: 'Entry',
          year: 2020,
          is_premium: false,
          premium_unlocked: false,
        },
        {
          id: commonId,
          createdAt: new Date('2023-05-10T12:00:00Z'),
          updatedAt: new Date('2023-05-10T12:00:00Z'),
          make: 'Newer',
          model: 'Entry',
          year: 2020,
          is_premium: false,
          premium_unlocked: false,
        }
      ];

      const result = testDeduplication(valuations);
      expect(result.length).toBe(1);
      expect(result[0].make).toBe('Newer');
    });
    
    it('should handle multiple sources with overlapping VINs', () => {
      // Simulate data from different sources for the same vehicle
      const vin = "1HGCM82633A004352";
      const valuations: Valuation[] = [
        // From regular valuations
        {
          id: 'reg-123',
          vin,
          createdAt: new Date('2023-05-01T10:00:00Z'),
          updatedAt: new Date('2023-05-01T10:00:00Z'),
          make: 'Honda',
          model: 'Accord',
          year: 2020,
          estimatedValue: 18000,
          is_premium: false,
          premium_unlocked: false,
        },
        // From saved valuations
        {
          id: 'saved-123',
          vin,
          createdAt: new Date('2023-05-02T12:00:00Z'),
          updatedAt: new Date('2023-05-02T12:00:00Z'),
          make: 'Honda',
          model: 'Accord',
          year: 2020,
          estimatedValue: 18500,
          is_premium: false,
          premium_unlocked: false,
        },
        // From premium valuations
        {
          id: 'premium-123',
          vin,
          createdAt: new Date('2023-05-03T14:00:00Z'),
          updatedAt: new Date('2023-05-03T14:00:00Z'),
          make: 'Honda',
          model: 'Accord',
          year: 2020,
          estimatedValue: 19000,
          is_premium: true,
          premium_unlocked: true,
        }
      ];

      const result = testDeduplication(valuations);
      
      // Should keep all records since they have different IDs
      expect(result.length).toBe(3);
      
      // The premium one should be prioritized if we were filtering by VIN
      // But our current logic works based on ID, so we keep all records with different IDs
      const premiumValuation = result.find(v => v.id === 'premium-123');
      expect(premiumValuation).toBeDefined();
      expect(premiumValuation?.premium_unlocked).toBe(true);
    });
  });
});
