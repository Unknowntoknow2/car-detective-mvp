
import { testDeduplication } from '../useValuationHistory';
import type { Valuation } from '@/types/valuation-history';

describe('useValuationHistory', () => {
  describe('deduplication logic', () => {
    it('should deduplicate valuations with the same ID, preferring premium ones', () => {
      const commonId = 'test-123';
      const valuations: Valuation[] = [
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

      expect(result.length).toBe(2);
      
      const dedupedItem = result.find(item => item.id === commonId);
      expect(dedupedItem).toBeDefined();
      expect(dedupedItem?.is_premium).toBe(true);
      expect(dedupedItem?.premium_unlocked).toBe(true);
    });

    it('should handle empty arrays and undefined values', () => {
      expect(testDeduplication([])).toEqual([]);
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
      const vin = "1HGCM82633A004352";
      const valuations: Valuation[] = [
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
      
      expect(result.length).toBe(3);
      
      const premiumValuation = result.find(v => v.id === 'premium-123');
      expect(premiumValuation).toBeDefined();
      expect(premiumValuation?.premium_unlocked).toBe(true);
    });
  });
});
