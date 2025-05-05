
import { generateValuationPdf } from './pdfGenerator';
import { generateValuationPdf as generatePdf } from './pdfGeneratorService';
import { ReportData } from './types';

// Mock the pdfGeneratorService
jest.mock('./pdfGeneratorService', () => ({
  generateValuationPdf: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3])),
}));

describe('pdfGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should process data correctly', async () => {
    // Arrange
    const mockData: ReportData = {
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      mileage: '35000',
      condition: 'Good',
      estimatedValue: 20000,
      vin: 'TESTVIN12345678901',
      zipCode: '90210',
      confidenceScore: 90,
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratches on rear bumper'],
        aiSummary: 'Vehicle appears to be in good condition with minor cosmetic issues'
      }
    };

    // Act
    await generateValuationPdf(mockData);

    // Assert
    expect(generatePdf).toHaveBeenCalledWith({
      ...mockData,
      year: 2020, // Should be converted to number
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratches on rear bumper'],
        aiSummary: 'Vehicle appears to be in good condition with minor cosmetic issues'
      }
    });
  });

  it('should handle string year conversion', async () => {
    // Arrange
    const mockData: ReportData = {
      make: 'Honda',
      model: 'Accord',
      year: '2018',
      mileage: '50000',
      condition: 'Excellent',
      estimatedValue: 18000,
      vin: 'TESTVIN12345678902',
      zipCode: '94105',
      confidenceScore: 85,
    };

    // Act
    await generateValuationPdf(mockData);

    // Assert
    expect(generatePdf).toHaveBeenCalledWith({
      ...mockData,
      year: 2018, // Should be converted to number
      aiCondition: null
    });
  });

  it('should handle missing aiCondition data', async () => {
    // Arrange
    const mockData: ReportData = {
      make: 'Ford',
      model: 'Mustang',
      year: 2015,
      mileage: '65000',
      condition: 'Fair',
      estimatedValue: 15000,
      vin: 'TESTVIN12345678903',
      zipCode: '60601',
      confidenceScore: 70,
    };

    // Act
    await generateValuationPdf(mockData);

    // Assert
    expect(generatePdf).toHaveBeenCalledWith({
      ...mockData,
      aiCondition: null
    });
  });
});
