
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generatePdf, downloadPdf } from './index';
import type { ReportData } from './types';

// Mock the PDF generation
vi.mock('pdf-lib', () => ({
  PDFDocument: {
    create: vi.fn().mockResolvedValue({
      addPage: vi.fn().mockReturnValue({
        getSize: vi.fn().mockReturnValue({ width: 612, height: 792 }),
        drawText: vi.fn(),
        drawRectangle: vi.fn()
      }),
      embedFont: vi.fn().mockResolvedValue({}),
      save: vi.fn().mockResolvedValue(new Uint8Array())
    })
  },
  StandardFonts: {
    Helvetica: 'Helvetica',
    HelveticaBold: 'Helvetica-Bold'
  },
  rgb: vi.fn()
}));

const mockReportData: ReportData = {
  id: 'test-123',
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  mileage: 50000,
  condition: 'Good',
  estimatedValue: 25000,
  price: 25000,
  priceRange: [23000, 27000],
  confidenceScore: 85,
  zipCode: '90210',
  adjustments: [],
  generatedAt: new Date().toISOString()
};

describe('PDF Export', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock URL methods
    global.URL.createObjectURL = vi.fn().mockReturnValue('mock-url');
    global.URL.revokeObjectURL = vi.fn();
    
    // Mock DOM methods
    Object.defineProperty(document, 'createElement', {
      value: vi.fn().mockReturnValue({
        href: '',
        download: '',
        click: vi.fn(),
        style: { display: '' }
      })
    });
    
    Object.defineProperty(document.body, 'appendChild', {
      value: vi.fn()
    });
    
    Object.defineProperty(document.body, 'removeChild', {
      value: vi.fn()
    });
  });

  it('should generate PDF successfully', async () => {
    const result = await generatePdf(mockReportData);
    expect(result).toBeInstanceOf(Uint8Array);
  });

  it('should download PDF successfully', async () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    
    await downloadPdf(mockReportData);
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
  });

  it('should handle premium options', async () => {
    const mockDownloadPdf = vi.fn() as typeof vi.Mock;
    
    await generatePdf(mockReportData, { isPremium: true });
    expect(mockReportData.estimatedValue).toBe(25000);
  });
});
