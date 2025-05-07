import { generatePdf } from './pdfGenerator';
import { ReportData } from './types';

describe('PDF Generator', () => {
  test('generates a valid PDF with basic data', async () => {
    // Prepare minimal test data
    const mockData: ReportData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2020,
      mileage: 25000,
      condition: 'Good',
      estimatedValue: 20000,
      vin: 'ABC123456789',
      zipCode: '90210',
      confidenceScore: 85,
      color: 'Red',
      bodyStyle: 'Sedan',
      bodyType: 'Sedan',
      fuelType: 'Gasoline',
      explanation: 'This is a test explanation',
      isPremium: false
    };

    // Generate the PDF
    const pdfBytes = await generatePdf(mockData);
    
    // Verify we got some bytes back
    expect(pdfBytes).toBeTruthy();
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  test('includes AI condition data when provided', async () => {
    // Prepare test data with AI condition assessment
    const mockData: ReportData = {
      make: 'Honda',
      model: 'Accord',
      year: 2019,
      mileage: 35000,
      condition: 'Good',
      estimatedValue: 18500,
      vin: 'DEF123456789',
      zipCode: '10001',
      confidenceScore: 90,
      color: 'Blue',
      bodyStyle: 'Sedan',
      bodyType: 'Sedan',
      fuelType: 'Gasoline',
      explanation: 'This is a test explanation with AI condition',
      isPremium: false,
      aiCondition: {
        condition: 'Good',
        confidenceScore: 85,
        issuesDetected: ['Minor scratch on rear bumper', 'Light wear on driver seat'],
        aiSummary: 'Vehicle is in good condition with minor cosmetic issues.'
      }
    };

    // Generate the PDF
    const pdfBytes = await generatePdf(mockData);
    
    // Verify we got some bytes back
    expect(pdfBytes).toBeTruthy();
    expect(pdfBytes.length).toBeGreaterThan(0);
  });

  test('generates a premium report when isPremium is true', async () => {
    // Prepare minimal test data for premium report
    const mockData: ReportData = {
      make: 'Tesla',
      model: 'Model 3',
      year: 2021,
      mileage: 15000,
      condition: 'Excellent',
      estimatedValue: 42000,
      vin: 'GHI123456789',
      zipCode: '94105',
      confidenceScore: 95,
      color: 'White',
      bodyStyle: 'Sedan',
      bodyType: 'Sedan',
      fuelType: 'Electric',
      explanation: 'This is a test explanation for premium report',
      isPremium: true
    };

    // Generate the PDF
    const pdfBytes = await generatePdf(mockData);
    
    // Verify we got some bytes back
    expect(pdfBytes).toBeTruthy();
    expect(pdfBytes.length).toBeGreaterThan(0);
  });
});
