
import { describe, it, expect, vi } from 'vitest';
import { generateValuationPdf } from '../utils/pdf/generateValuationPdf';
import { ReportData } from '../utils/pdf/types';

// Mock the PDF generation dependencies
vi.mock('@react-pdf/renderer', () => ({
  pdf: {
    create: vi.fn().mockReturnValue({
      toBlob: vi.fn().mockResolvedValue(new Blob(['mock pdf content'], { type: 'application/pdf' })),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from('mock pdf content')),
    }),
  },
  Document: vi.fn(({ children }) => children),
  Page: vi.fn(({ children }) => children),
  Text: vi.fn(({ children }) => children),
  View: vi.fn(({ children }) => children),
  StyleSheet: {
    create: vi.fn().mockReturnValue({}),
  },
  Font: {
    register: vi.fn(),
  },
  Image: vi.fn(() => 'Image'),
}));

describe('generateValuationPdf', () => {
  it('generates a PDF with the correct data', async () => {
    // Sample test data
    const testData: ReportData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      vin: 'ABC123456DEF78901',
      mileage: 15000,
      zipCode: '90210',
      estimatedValue: 25000,
      condition: 'Good',
      adjustments: [
        {
          factor: 'Mileage',
          impact: -500,
          description: 'Lower than average mileage'
        },
        {
          factor: 'Condition',
          impact: 1000,
          description: 'Excellent condition'
        }
      ],
      confidenceScore: 85,
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: [],
        summary: 'Vehicle is in good condition.'
      },
      generatedAt: new Date().toISOString(),
    };

    // Generate the PDF
    const pdfBuffer = await generateValuationPdf(testData);
    
    // Verify the PDF was generated
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer instanceof Uint8Array).toBe(true);
  });

  it('handles missing optional fields gracefully', async () => {
    // Minimal test data with only required fields
    const minimalData: ReportData = {
      make: 'Honda',
      model: 'Civic',
      year: 2019,
      mileage: 20000,
      estimatedValue: 18000,
      condition: 'Fair',
      confidenceScore: 80,
      zipCode: '10001',
      aiCondition: {
        condition: 'Fair',
        confidenceScore: 75,
        issuesDetected: [],
        summary: 'Vehicle is in fair condition.'
      },
      generatedAt: new Date().toISOString(),
    };

    // Generate the PDF with minimal data
    const pdfBuffer = await generateValuationPdf(minimalData);
    
    // Verify the PDF was generated even with minimal data
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer instanceof Uint8Array).toBe(true);
  });
});
