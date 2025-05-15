
// Import needed test utilities and the function to test
import { describe, it, expect } from 'vitest';
import { generateReport } from './pdfGeneratorService';
import { ReportData } from './types';

describe('PDF Generator', () => {
  it('should generate a PDF document', async () => {
    const testData: ReportData = {
      id: 'test-123',
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      price: 25000,
      estimatedValue: 24500, // Adding the required field
      mileage: 15000,
      condition: 'Good',
      zipCode: '90210',
      adjustments: [
        { factor: 'Mileage', impact: -500, description: 'Lower than average' }
      ],
      confidenceScore: 90,
      priceRange: [23000, 26000],
      generatedAt: new Date().toISOString()
    };

    const pdfBytes = await generateReport(testData);
    
    // Verify the PDF was generated
    expect(pdfBytes).toBeInstanceOf(Uint8Array);
    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
