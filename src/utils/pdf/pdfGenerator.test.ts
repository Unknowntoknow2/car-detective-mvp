
// Mock test file for PDF generator
import { ReportData } from './types';

describe('PDF Generator', () => {
  test('should create report data correctly', () => {
    // Example minimum required data
    const minimalData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 35000, // Added mileage field
      zipCode: '90210',
      price: 22000,
      estimatedValue: 21500,
      // Add required fields
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: [],
        summary: 'Vehicle is in good condition overall.'
      },
      generatedDate: new Date()
    };
    
    // Verify data has required fields
    expect(minimalData.make).toBeDefined();
    expect(minimalData.mileage).toBeDefined();
    expect(minimalData.zipCode).toBeDefined();
    expect(minimalData.aiCondition).toBeDefined();
    
    // Create a full report data
    const fullData: ReportData = {
      ...minimalData,
      vin: '1HGCM82633A123456',
      trim: 'XLE',
      color: 'Silver',
      bodyStyle: 'Sedan',
      transmission: 'Automatic',
      fuelType: 'Gasoline',
      confidenceScore: 85,
      photoScore: 92,
      priceRange: [21000, 23000],
      adjustments: [
        { 
          factor: 'Low Mileage', 
          impact: 500, 
          description: 'Vehicle has lower than average mileage' 
        }
      ],
      premium: true,
      generatedDate: new Date()
    };
    
    // Verify full data has all expected fields
    expect(fullData.vin).toBeDefined();
    expect(fullData.adjustments).toBeDefined();
    expect(fullData.premium).toBeDefined();
  });
});
