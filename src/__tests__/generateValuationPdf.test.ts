
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';

// Mock jsPDF
vi.mock('jspdf', () => ({
  default: vi.fn().mockImplementation(() => ({
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    text: vi.fn(),
    addImage: vi.fn(),
    addPage: vi.fn(),
    save: vi.fn(),
    line: vi.fn(),
    // Add other methods as needed
  })),
}));

describe('generateValuationPdf', () => {
  const mockValuation = {
    id: '123',
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    vin: 'ABC123',
    mileage: 50000,
    estimated_value: 15000,
    condition: 'Good',
    adjustments: [
      { factor: 'Mileage', impact: -500, description: 'Higher than average mileage' },
      { factor: 'Condition', impact: 200, description: 'Good overall condition' },
      { factor: 'Market Demand', impact: 300, description: 'High demand in your area' }
    ],
    confidence_score: 85,
    created_at: '2023-01-01T00:00:00Z',
  };

  it('should generate a PDF document', () => {
    const result = generateValuationPdf(mockValuation);
    expect(result).toBeDefined();
  });
});
