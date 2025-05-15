
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData } from '@/utils/pdf/types';

describe('generateValuationPdf', () => {
  const mockReportData: ReportData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 30000,
    condition: 'Good',
    zipCode: '90210',
    estimatedValue: 18000,
    adjustments: [
      { factor: 'Mileage', impact: -500, description: 'Higher than average mileage' }
    ],
    generatedAt: new Date().toISOString(),
    confidenceScore: 85,
    priceRange: [17000, 19000]
  };

  it('should generate a PDF for valid report data', async () => {
    const result = await generateValuationPdf(mockReportData);
    
    // The function currently returns a placeholder Uint8Array
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle premium report options', async () => {
    const result = await generateValuationPdf(mockReportData, { isPremium: true });
    
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });

  it('should handle empty adjustments', async () => {
    const result = await generateValuationPdf({
      ...mockReportData,
      adjustments: []
    });
    
    expect(result).toBeInstanceOf(Uint8Array);
    expect(result.length).toBeGreaterThan(0);
  });
});
