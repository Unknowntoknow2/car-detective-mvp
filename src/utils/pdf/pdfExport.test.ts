import { generateValuationPdf } from '../generateValuationPdf';
import { generatePdf } from './pdfGenerator';
import { DecodedVehicleInfo } from '@/types/vehicle';

// Mock the PDF generator service
jest.mock('./pdfGenerator', () => ({
  generatePdf: jest.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
}));

describe('PDF Export', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate a standard PDF with all required fields', async () => {
    // Arrange
    const vehicle: DecodedVehicleInfo = {
      vin: 'JH4DA9380PS000111',
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: 45000,
      condition: 'Good',
      zipCode: '90210',
      color: 'Blue',
      bodyType: 'Sedan',
      fuelType: 'Gasoline'
    };
    
    const params = {
      vehicle,
      valuation: 21500,
      explanation: 'The vehicle is in good condition with average mileage...',
      explanationText: 'Additional explanation text',
      comparables: [
        { source: 'KBB', price: 22000, date: '2023-05-01' },
        { source: 'Edmunds', price: 21000, date: '2023-05-15' }
      ],
      valuationId: '123e4567-e89b-12d3-a456-426614174000'
    };

    // Act
    const result = await generateValuationPdf(params);

    // Assert
    expect(generatePdf).toHaveBeenCalledWith(expect.objectContaining({
      vin: 'JH4DA9380PS000111',
      make: 'Toyota',
      model: 'Camry',
      year: 2019,
      mileage: '45000',
      condition: 'Good',
      zipCode: '90210',
      estimatedValue: 21500,
      color: 'Blue',
      bodyStyle: 'Sedan',
      bodyType: 'Sedan',
      fuelType: 'Gasoline',
      explanation: 'The vehicle is in good condition with average mileage...',
      valuationId: '123e4567-e89b-12d3-a456-426614174000'
    }));
    
    expect(result).toBeInstanceOf(Uint8Array);
  });

  it('should include AI condition data when provided', async () => {
    // Arrange
    const vehicle: DecodedVehicleInfo = {
      vin: 'JH4DA9380PS000222',
      make: 'Honda',
      model: 'Accord',
      year: 2020,
      mileage: 30000,
      condition: 'Excellent',
      zipCode: '60601'
    };
    
    const aiCondition = {
      condition: 'Good' as const,
      confidenceScore: 85,
      issuesDetected: ['Minor scratches on rear bumper', 'Small dent on driver door'],
      aiSummary: 'The vehicle is in generally good condition with some minor cosmetic issues.'
    };
    
    const bestPhotoUrl = 'https://example.com/photos/123.jpg';
    
    const params = {
      vehicle,
      valuation: 25000,
      explanation: 'The vehicle valuation is based on...',
      valuationId: '123e4567-e89b-12d3-a456-426614174001',
      aiCondition,
      bestPhotoUrl
    };

    // Act
    const result = await generateValuationPdf(params);

    // Assert
    expect(generatePdf).toHaveBeenCalledWith(expect.objectContaining({
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratches on rear bumper', 'Small dent on driver door'],
        aiSummary: 'The vehicle is in generally good condition with some minor cosmetic issues.'
      },
      bestPhotoUrl: 'https://example.com/photos/123.jpg'
    }));
  });

  it('should handle missing or partial vehicle data', async () => {
    // Arrange
    const vehicle: Partial<DecodedVehicleInfo> = {
      make: 'Ford',
      model: 'F-150',
      year: 2018,
    };
    
    const params = {
      vehicle: vehicle as DecodedVehicleInfo,
      valuation: 32000,
      explanation: 'Basic explanation',
    };

    // Act
    const result = await generateValuationPdf(params);

    // Assert
    expect(generatePdf).toHaveBeenCalledWith(expect.objectContaining({
      vin: 'Unknown', // Should default when missing
      make: 'Ford',
      model: 'F-150',
      year: 2018,
      mileage: '0', // Should default when missing
      condition: 'Not Specified', // Should default when missing
      zipCode: '',
      estimatedValue: 32000,
    }));
  });

  it('should throw an error if PDF generation fails', async () => {
    // Arrange
    (generatePdf as jest.Mock).mockRejectedValue(new Error('PDF generation failed'));
    
    const vehicle: DecodedVehicleInfo = {
      vin: 'JH4DA9380PS000333',
      make: 'Chevrolet',
      model: 'Silverado',
      year: 2021,
      mileage: 15000,
      condition: 'Excellent',
      zipCode: '30301'
    };
    
    const params = {
      vehicle,
      valuation: 40000,
      explanation: 'Standard explanation',
    };

    // Act & Assert
    await expect(generateValuationPdf(params)).rejects.toThrow('PDF generation failed');
  });
});
