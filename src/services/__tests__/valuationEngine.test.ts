import { calculateUnifiedValuation } from '../valuationEngine';
import { lookupTitleStatus, lookupOpenRecalls } from '../historyCheckService';

// Mock the history check services
jest.mock('../historyCheckService');
jest.mock('../valuation/marketSearchService');
jest.mock('../valuation/marketListingService');

const mockLookupTitleStatus = lookupTitleStatus as any;
const mockLookupOpenRecalls = lookupOpenRecalls as any;

// Mock fetch for market search
global.fetch = jest.fn() as any;

describe('Valuation Engine - Title and Recall Intelligence', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock market search to return basic data
    (fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        listings: [
          { price: 15000, mileage: 50000, source: 'CarGurus' },
          { price: 16000, mileage: 45000, source: 'AutoTrader' },
          { price: 14500, mileage: 55000, source: 'Cars.com' }
        ],
        trust: 0.85,
        notes: 'Found 3 real listings'
      })
    });
  });

  describe('Salvage Title Penalties', () => {
    it('should apply 50% penalty for salvage title', async () => {
      // Mock salvage title
      mockLookupTitleStatus.mockResolvedValue({
        status: 'salvage',
        confidence: 0.9,
        source: 'nicb',
        lastChecked: '2025-01-21T00:00:00Z'
      });
      
      mockLookupOpenRecalls.mockResolvedValue({
        recalls: [],
        unresolved: [],
        totalRecalls: 0,
        unresolvedCount: 0,
        lastChecked: '2025-01-21T00:00:00Z',
        source: 'nhtsa'
      });

      const result = await calculateUnifiedValuation({
        vin: '1FTEW1CG6HKD46234',
        year: 2017,
        make: 'Ford',
        model: 'F-150',
        mileage: 50000,
        condition: 'good',
        zipCode: '90210'
      });

      // Expect 50% reduction from base value
      const baseValue = 15000; // Median from mock listings
      const expectedFinalValue = Math.round(baseValue * 0.5); // 50% penalty
      
      expect(result.finalValue).toBeLessThan(baseValue);
      expect(result.titleStatus).toBe('salvage');
      expect(result.notes).toContainEqual(
        expect.stringContaining('Title status "salvage" detected: -50% value adjustment')
      );
      expect(result.adjustments).toContainEqual(
        expect.objectContaining({
          label: 'Salvage Title',
          amount: expect.any(Number),
          reason: expect.stringContaining('50% value reduction')
        })
      );
    });

    it('should apply 30% penalty for rebuilt title', async () => {
      mockLookupTitleStatus.mockResolvedValue({
        status: 'rebuilt',
        confidence: 0.85,
        source: 'nicb',
        lastChecked: '2025-01-21T00:00:00Z'
      });
      
      mockLookupOpenRecalls.mockResolvedValue({
        recalls: [],
        unresolved: [],
        totalRecalls: 0,
        unresolvedCount: 0,
        lastChecked: '2025-01-21T00:00:00Z',
        source: 'nhtsa'
      });

      const result = await calculateUnifiedValuation({
        vin: '1FTMF1C89HKC08157',
        year: 2017,
        make: 'Ford',
        model: 'F-150',
        mileage: 45000,
        condition: 'good',
        zipCode: '90210'
      });

      expect(result.titleStatus).toBe('rebuilt');
      expect(result.adjustments).toContainEqual(
        expect.objectContaining({
          label: 'Rebuilt Title',
          reason: expect.stringContaining('30% value reduction')
        })
      );
    });
  });

  describe('Recall Impact on Confidence Score', () => {
    it('should reduce confidence score for unresolved recalls', async () => {
      mockLookupTitleStatus.mockResolvedValue({
        status: 'clean',
        confidence: 0.9,
        source: 'nicb',
        lastChecked: '2025-01-21T00:00:00Z'
      });
      
      mockLookupOpenRecalls.mockResolvedValue({
        recalls: [
          {
            id: 'recall_1',
            description: 'Airbag deployment issue',
            riskLevel: 'high',
            issuedDate: '2023-06-15T00:00:00Z',
            isResolved: false,
            component: 'Airbag System'
          }
        ],
        unresolved: [
          {
            id: 'recall_1',
            description: 'Airbag deployment issue',
            riskLevel: 'high',
            issuedDate: '2023-06-15T00:00:00Z',
            isResolved: false,
            component: 'Airbag System'
          }
        ],
        totalRecalls: 1,
        unresolvedCount: 1,
        lastChecked: '2025-01-21T00:00:00Z',
        source: 'nhtsa'
      });

      const result = await calculateUnifiedValuation({
        vin: '1FTEW1CG6HKD46234',
        year: 2017,
        make: 'Ford',
        model: 'F-150',
        mileage: 50000,
        condition: 'good',
        zipCode: '90210'
      });

      expect(result.openRecalls).toHaveLength(1);
      expect(result.notes).toContainEqual(
        expect.stringContaining('1 unresolved recall(s) found. Confidence score adjusted')
      );
      
      // Should have safety recall adjustment for high-risk recall
      expect(result.adjustments).toContainEqual(
        expect.objectContaining({
          label: 'Safety Recalls',
          amount: expect.any(Number),
          reason: expect.stringContaining('unresolved high-risk recall')
        })
      );
    });
  });

  describe('Clean Title Vehicle', () => {
    it('should not apply penalties for clean title', async () => {
      mockLookupTitleStatus.mockResolvedValue({
        status: 'clean',
        confidence: 0.9,
        source: 'nicb',
        lastChecked: '2025-01-21T00:00:00Z'
      });
      
      mockLookupOpenRecalls.mockResolvedValue({
        recalls: [],
        unresolved: [],
        totalRecalls: 0,
        unresolvedCount: 0,
        lastChecked: '2025-01-21T00:00:00Z',
        source: 'nhtsa'
      });

      const result = await calculateUnifiedValuation({
        vin: '1FTEW1CG6HKD46234',
        year: 2017,
        make: 'Ford',
        model: 'F-150',
        mileage: 50000,
        condition: 'good',
        zipCode: '90210'
      });

      expect(result.titleStatus).toBe('clean');
      expect(result.openRecalls).toHaveLength(0);
      
      // Should not have title-related adjustments
      const titleAdjustments = result.adjustments.filter(adj => 
        adj.label.toLowerCase().includes('title') || 
        adj.label.toLowerCase().includes('salvage') ||
        adj.label.toLowerCase().includes('rebuilt')
      );
      expect(titleAdjustments).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle title lookup failures gracefully', async () => {
      mockLookupTitleStatus.mockResolvedValue(null);
      mockLookupOpenRecalls.mockResolvedValue(null);

      const result = await calculateUnifiedValuation({
        vin: 'INVALID_VIN',
        year: 2017,
        make: 'Ford',
        model: 'F-150',
        mileage: 50000,
        condition: 'good',
        zipCode: '90210'
      });

      expect(result.titleStatus).toBeNull();
      expect(result.openRecalls).toEqual([]);
      expect(result.finalValue).toBeGreaterThan(0);
    });
  });
});