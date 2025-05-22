
// Import necessary modules
import { generateValuationPdf } from '../utils/pdf/generateValuationPdf';
import { ReportData } from '../utils/pdf/types';

describe('generateValuationPdf', () => {
  // Mock data for tests
  const mockReportData: ReportData = {
    make: 'Toyota',
    model: 'Camry',
    year: 2020,
    mileage: 35000,
    estimatedValue: 22500,
    condition: 'Good',
    confidenceScore: 85,
    zipCode: '90210',
    aiCondition: {
      condition: 'Good',
      confidenceScore: 85,
      issuesDetected: [],
      summary: 'The vehicle is in good condition overall.'
    },
    generatedAt: new Date().toISOString(),
    // Add required adjustments property
    adjustments: [
      { factor: 'Mileage', impact: -500 },
      { factor: 'Condition', impact: 300 }
    ]
  };

  // Test case: PDF generation function returns a Uint8Array
  test('returns a Uint8Array', async () => {
    const result = await generateValuationPdf(mockReportData);
    expect(result).toBeInstanceOf(Uint8Array);
  });

  // Test case: PDF generation handles premium options
  test('handles premium options', async () => {
    const result = await generateValuationPdf(mockReportData, {
      isPremium: true,
      includeExplanation: true
    });
    expect(result).toBeInstanceOf(Uint8Array);
  });

  // Test case: Handles missing optional fields
  test('handles missing optional fields', async () => {
    const minimalData: ReportData = {
      make: 'Honda',
      model: 'Civic',
      year: 2018,
      mileage: 45000,
      estimatedValue: 18000,
      condition: 'Fair',
      confidenceScore: 75,
      zipCode: '60601',
      aiCondition: {
        condition: 'Fair',
        confidenceScore: 75,
        issuesDetected: [],
        summary: 'The vehicle is in fair condition.'
      },
      generatedAt: new Date().toISOString(),
      // Add required adjustments property
      adjustments: []
    };

    const result = await generateValuationPdf(minimalData);
    expect(result).toBeInstanceOf(Uint8Array);
  });
});
