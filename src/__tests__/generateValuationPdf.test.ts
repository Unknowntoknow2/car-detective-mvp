<<<<<<< HEAD

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
    // Add required adjustments property with descriptions
    adjustments: [
      { factor: 'Mileage', impact: -500, description: 'Higher than average mileage adjustment' },
      { factor: 'Condition', impact: 300, description: 'Good condition premium' }
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
      // Add required adjustments property with descriptions
      adjustments: []
    };

    const result = await generateValuationPdf(minimalData);
    expect(result).toBeInstanceOf(Uint8Array);
=======
import { describe, expect, it, vi } from "vitest";
import { generateValuationPdf } from "../utils/pdf/generateValuationPdf";
import { ReportData } from "../utils/pdf/types";
import { Buffer } from "node:buffer";

// Mock the PDF generation dependencies
vi.mock("@react-pdf/renderer", () => ({
  pdf: {
    create: vi.fn().mockReturnValue({
      toBlob: vi.fn().mockResolvedValue(
        new Blob(["mock pdf content"], { type: "application/pdf" }),
      ),
      toBuffer: vi.fn().mockResolvedValue(Buffer.from("mock pdf content")),
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
  Image: vi.fn(() => "Image"),
}));

describe("generateValuationPdf", () => {
  it("generates a PDF with the correct data", async () => {
    // Sample test data
    const testData = {
      id: "123",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      vin: "ABC123456DEF78901",
      mileage: 15000,
      condition: "Good",
      zipCode: "90210",
      price: 25000, // Added required price property
      estimatedValue: 25000,
      adjustments: [
        {
          factor: "Mileage",
          impact: -500,
          description: "Lower than average mileage",
        },
        {
          factor: "Condition",
          impact: 1000,
          description: "Excellent condition",
        },
      ],
      confidenceScore: 85,
      generatedAt: new Date().toISOString(),
      priceRange: [23000, 27000],
      userId: "user123",
    } as ReportData;

    // Generate the PDF
    const pdfBuffer = await generateValuationPdf(testData);

    // Verify the PDF was generated
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer instanceof Buffer).toBe(true);
    expect(pdfBuffer.toString()).toBe("mock pdf content");
  });

  it("handles missing optional fields gracefully", async () => {
    // Minimal test data with only required fields
    const minimalData = {
      id: "456",
      make: "Honda",
      model: "Civic",
      year: 2019,
      mileage: 20000,
      condition: "Fair",
      zipCode: "10001",
      price: 18000, // Added required price property
      estimatedValue: 18000,
      generatedAt: new Date().toISOString(),
    } as ReportData;

    // Generate the PDF with minimal data
    const pdfBuffer = await generateValuationPdf(minimalData);

    // Verify the PDF was generated even with minimal data
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer instanceof Buffer).toBe(true);
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
});
