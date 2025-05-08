import { generatePdf } from './pdfGenerator';
import { ReportData } from './types';
import fs from 'node:fs';

// In all test data objects, add the required properties
const testReportData: ReportData = {
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 35000,
  condition: 'Good',
  estimatedValue: 18500,
  vin: '1HGCM82633A004352',
  zipCode: '10001',
  confidenceScore: 85,
  color: 'Blue',
  bodyType: 'Sedan',
  fuelType: 'Gasoline',
  explanation: 'This is a test explanation',
  isPremium: false,
  // Add required properties
  priceRange: [16650, 20350],
  adjustments: [
    {
      name: 'Mileage',
      value: -500,
      description: 'Vehicle has higher than average mileage',
      percentAdjustment: -2.7
    }
  ],
  generatedAt: new Date().toISOString()
};

const testReportDataWithAICondition: ReportData = {
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 35000,
  condition: 'Good',
  estimatedValue: 18500,
  vin: '1HGCM82633A004352',
  zipCode: '10001',
  confidenceScore: 85,
  color: 'Blue',
  bodyType: 'Sedan',
  fuelType: 'Gasoline',
  explanation: 'This is a test explanation',
  isPremium: false,
  aiCondition: {
    condition: 'Good',
    confidenceScore: 0.85,
    issuesDetected: ['Scratch on door', 'Dent on hood'],
    aiSummary: 'The AI detected some minor issues with the vehicle.'
  },
  // Add required properties
  priceRange: [16650, 20350],
  adjustments: [
    {
      name: 'Mileage',
      value: -500,
      description: 'Vehicle has higher than average mileage',
      percentAdjustment: -2.7
    }
  ],
  generatedAt: new Date().toISOString()
};

const testReportDataPremium: ReportData = {
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 35000,
  condition: 'Good',
  estimatedValue: 18500,
  vin: '1HGCM82633A004352',
  zipCode: '10001',
  confidenceScore: 85,
  color: 'Blue',
  bodyType: 'Sedan',
  fuelType: 'Gasoline',
  explanation: 'This is a test explanation',
  isPremium: true,
  // Add required properties
  priceRange: [16650, 20350],
  adjustments: [
    {
      name: 'Mileage',
      value: -500,
      description: 'Vehicle has higher than average mileage',
      percentAdjustment: -2.7
    }
  ],
  generatedAt: new Date().toISOString()
};

describe('PDF Generation', () => {
  it('should generate a PDF report', async () => {
    const pdfBuffer = await generatePdf(testReportData);
    expect(pdfBuffer).toBeInstanceOf(Buffer);

    // Optionally save the PDF to a file for manual inspection
    fs.writeFileSync('test-report.pdf', pdfBuffer);
  });

  it('should generate a PDF report with AI condition data', async () => {
    const pdfBuffer = await generatePdf(testReportDataWithAICondition);
    expect(pdfBuffer).toBeInstanceOf(Buffer);

    // Optionally save the PDF to a file for manual inspection
    fs.writeFileSync('test-report-ai.pdf', pdfBuffer);
  });

  it('should generate a premium PDF report', async () => {
    const pdfBuffer = await generatePdf(testReportDataPremium);
    expect(pdfBuffer).toBeInstanceOf(Buffer);

    // Optionally save the PDF to a file for manual inspection
    fs.writeFileSync('test-report-premium.pdf', pdfBuffer);
  });
});
