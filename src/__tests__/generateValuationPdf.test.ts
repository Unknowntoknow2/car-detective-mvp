
import { describe, expect, it, vi } from "vitest";
import { generateValuationPdf, ReportData } from "../utils/pdfService";
import { Buffer } from "node:buffer";

// Mock the PDF generation dependencies
vi.mock("pdf-lib", () => ({
  PDFDocument: {
    create: vi.fn().mockResolvedValue({
      addPage: vi.fn().mockReturnValue({
        getSize: vi.fn().mockReturnValue({ width: 595, height: 842 }),
        drawText: vi.fn(),
        drawLine: vi.fn(),
      }),
      embedFont: vi.fn().mockResolvedValue({}),
      save: vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3, 4])),
    }),
  },
  StandardFonts: {
    Helvetica: 'Helvetica',
    HelveticaBold: 'Helvetica-Bold',
  },
  rgb: vi.fn().mockReturnValue({ r: 0, g: 0, b: 0 }),
}));

describe("generateValuationPdf", () => {
  it("generates a PDF with the correct data", async () => {
    // Sample test data
    const testData: ReportData = {
      id: "123",
      make: "Toyota",
      model: "Camry",
      year: 2020,
      vin: "ABC123456DEF78901",
      mileage: 15000,
      condition: "Good",
      zipCode: "90210",
      price: 25000,
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
      isPremium: false,
    };

    // Generate the PDF
    const pdfBuffer = await generateValuationPdf(testData);

    // Verify the PDF was generated
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer instanceof Buffer).toBe(true);
    expect(pdfBuffer.length).toBeGreaterThan(0);
  });

  it("handles missing optional fields gracefully", async () => {
    // Minimal test data with only required fields
    const minimalData: ReportData = {
      id: "456",
      make: "Honda",
      model: "Civic",
      year: 2019,
      mileage: 20000,
      condition: "Fair",
      zipCode: "10001",
      price: 18000,
      estimatedValue: 18000,
      generatedAt: new Date().toISOString(),
      priceRange: [17000, 19000],
      confidenceScore: 75,
      adjustments: [],
      isPremium: false,
    };

    // Generate the PDF with minimal data
    const pdfBuffer = await generateValuationPdf(minimalData);

    // Verify the PDF was generated even with minimal data
    expect(pdfBuffer).toBeDefined();
    expect(pdfBuffer instanceof Buffer).toBe(true);
  });
});
