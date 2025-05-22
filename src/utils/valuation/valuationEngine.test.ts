
import { calculateConfidenceScore } from './valuationEngine';
import { getBaseValueEstimate } from './calculateFinalValuation';
import { AdjustmentBreakdown } from './rules/types';

describe('valuation engine', () => {
  describe('calculateConfidenceScore', () => {
    it('should calculate base confidence score', () => {
      const input = {
        zipCode: '90210'
      };
      
      const adjustments: AdjustmentBreakdown[] = [];
      const score = calculateConfidenceScore(input, adjustments);
      
      expect(score).toBe(85); // Base score
    });
    
    it('should increase confidence score for complete data', () => {
      const input = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'Good',
        zipCode: '90210'
      };
      
      const adjustments: AdjustmentBreakdown[] = [];
      const score = calculateConfidenceScore(input, adjustments);
      
      expect(score).toBe(93); // Base (85) + complete info (5) + condition (3)
    });
    
    it('should increase confidence score for high photo score', () => {
      const input = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'Good',
        photoScore: 0.9,
        zipCode: '90210'
      };
      
      const adjustments: AdjustmentBreakdown[] = [];
      const score = calculateConfidenceScore(input, adjustments);
      
      expect(score).toBe(98); // Base (85) + complete info (5) + condition (3) + photo (5)
    });
    
    it('should increase confidence score for features', () => {
      const input = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000,
        condition: 'Good',
        photoScore: 0.9,
        features: ['Leather', 'Sunroof'],
        zipCode: '90210'
      };
      
      const adjustments: AdjustmentBreakdown[] = [];
      const score = calculateConfidenceScore(input, adjustments);
      
      expect(score).toBe(100); // Would be 100 but capped at 100
    });
  });
  
  describe('getBaseValueEstimate', () => {
    it('should calculate base value for Toyota', () => {
      const input = {
        make: 'Toyota',
        model: 'Camry',
        year: 2020,
        mileage: 30000
      };
      
      const baseValue = getBaseValueEstimate(input);
      
      // Calculate expected value
      const currentYear = new Date().getFullYear();
      const ageDiscount = (currentYear - 2020) * 1500;
      const mileageDiscount = Math.floor(30000 / 10000) * 500;
      const expected = 30000 - ageDiscount - mileageDiscount;
      
      expect(baseValue).toBe(expected);
    });
    
    it('should calculate base value for unknown make', () => {
      const input = {
        make: 'Unknown',
        model: 'Model',
        year: 2020,
        mileage: 30000
      };
      
      const baseValue = getBaseValueEstimate(input);
      
      // Calculate expected value
      const currentYear = new Date().getFullYear();
      const ageDiscount = (currentYear - 2020) * 1500;
      const mileageDiscount = Math.floor(30000 / 10000) * 500;
      const expected = 25000 - ageDiscount - mileageDiscount;
      
      expect(baseValue).toBe(expected);
    });
    
    it('should enforce minimum value', () => {
      const input = {
        make: 'Toyota',
        model: 'Camry',
        year: 2000,
        mileage: 200000
      };
      
      const baseValue = getBaseValueEstimate(input);
      
      expect(baseValue).toBe(5000); // Minimum value
    });
  });
  
  describe('adjustment types', () => {
    it('should have correct type for adjustment items', () => {
      const adjustments: AdjustmentBreakdown[] = [
        {
          factor: 'Mileage',
          impact: -1000,
          description: 'Higher than average mileage'
        },
        {
          factor: 'Condition',
          impact: 1500,
          description: 'Excellent condition'
        },
        {
          factor: 'Market',
          impact: 500,
          description: 'High demand in area'
        }
      ];
      
      // Type check - this should compile without errors
      adjustments.forEach(adj => {
        expect(typeof adj.factor).toBe('string');
        expect(typeof adj.impact).toBe('number');
        expect(typeof adj.description).toBe('string');
      });
    });
  });
});
