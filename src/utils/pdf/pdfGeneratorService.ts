import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { generatePdf } from './pdfGenerator';
import { ReportData, ReportOptions } from './types';

const DEFAULT_OPTIONS: ReportOptions = {
  // Required properties from ReportOptions
  includeHeader: true,
  includeFooter: true,
  includePageNumbers: true,
  includePhotos: true,
  includeLegalDisclaimer: true,
  theme: 'light',
  
  // Additional properties
  format: 'letter',
  orientation: 'portrait',
  margin: 50,
  includeBranding: true,
  includeTimestamp: true,
  includePhotoAssessment: true,
  includeAIScore: true,
  isPremium: false,
  title: 'Vehicle Valuation Report',
  printBackground: true,
  landscape: false,
  showWholesaleValue: false
};

/**
 * Generates a valuation report PDF
 * @param data The report data
 * @param options Options for PDF generation
 * @returns The path to the generated PDF
 */
export async function generateValuationReport(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `valuation-report-${data.vin}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Generate the PDF with merged options
    const mergedOptions: ReportOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };
    
    await generatePdf(
      data,
      'valuation-report',
      outputPath,
      mergedOptions,
      (doc) => {
        // Add watermark or other modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating valuation report:', error);
    throw new Error(`Failed to generate valuation report: ${(error as Error).message}`);
  }
}

/**
 * Generates a premium valuation report PDF with additional details
 * @param data The report data
 * @param options Options for PDF generation
 * @returns The path to the generated PDF
 */
export async function generatePremiumReport(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports', 'premium');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `premium-report-${data.vin}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Add premium flag to data
    const premiumData = {
      ...data,
      isPremium: true
    };
    
    // Generate the PDF with merged options
    const mergedOptions: ReportOptions = {
      ...DEFAULT_OPTIONS,
      isPremium: true,
      ...options
    };
    
    await generatePdf(
      premiumData,
      'premium-report',
      outputPath,
      mergedOptions,
      (doc) => {
        // Add premium watermark or other modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating premium report:', error);
    throw new Error(`Failed to generate premium report: ${(error as Error).message}`);
  }
}

/**
 * Adds a watermark to an existing PDF
 * @param pdfPath Path to the PDF file
 * @param watermarkText Text to use as watermark
 * @returns Path to the watermarked PDF
 */
export async function addWatermark(
  pdfPath: string,
  watermarkText: string
): Promise<string> {
  try {
    // Read the PDF file
    const pdfBytes = await fs.readFile(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    // Add watermark to each page
    for (const page of pages) {
      const { width, height } = page.getSize();
      
      // Draw watermark text
      page.drawText(watermarkText, {
        x: width / 2 - 150,
        y: height / 2,
        size: 60,
        opacity: 0.15,
        rotate: {
          type: 'degrees' as any,
          angle: 45
        }
      });
    }
    
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const outputPath = pdfPath.replace('.pdf', '-watermarked.pdf');
    await fs.writeFile(outputPath, modifiedPdfBytes);
    
    return outputPath;
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw new Error(`Failed to add watermark: ${(error as Error).message}`);
  }
}

/**
 * Generates a comparison report for multiple vehicles
 * @param vehicles Array of vehicle report data
 * @param options Options for PDF generation
 * @returns Path to the generated PDF
 */
export async function generateComparisonReport(
  vehicles: ReportData[],
  options: Partial<ReportOptions> = {}
): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports', 'comparisons');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `comparison-report-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Create a composite "report data" for the comparison
    // This is a special case that the PDF generator needs to handle differently
    const comparisonData: any = {
      vehicles,
      timestamp: new Date().toISOString(),
      title: options.title || 'Vehicle Comparison Report',
      userName: options.userName || 'Car Detective User'
    };
    
    // Generate the PDF with merged options
    const mergedOptions: ReportOptions = {
      ...DEFAULT_OPTIONS,
      landscape: true, // Comparison reports are typically in landscape
      ...options
    };
    
    // For comparison reports, we'll call a special template
    await generatePdf(
      comparisonData as any,
      'comparison-report',
      outputPath,
      mergedOptions,
      (doc) => {
        // Add any custom modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating comparison report:', error);
    throw new Error(`Failed to generate comparison report: ${(error as Error).message}`);
  }
}

/**
 * Generates a dealer report PDF
 * @param data The report data
 * @param options Options for PDF generation
 * @returns The path to the generated PDF
 */
export async function generateDealerReport(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports', 'dealer');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `dealer-report-${data.vin}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Add dealer-specific data
    const dealerData = {
      ...data,
      isDealer: true,
      showWholesaleValue: options.showWholesaleValue || false,
      dealerName: options.dealerName || 'Authorized Dealer'
    };
    
    // Generate the PDF with merged options
    const mergedOptions: ReportOptions = {
      ...DEFAULT_OPTIONS,
      ...options
    };
    
    await generatePdf(
      dealerData,
      'dealer-report',
      outputPath,
      mergedOptions,
      (doc) => {
        // Add dealer watermark or other modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating dealer report:', error);
    throw new Error(`Failed to generate dealer report: ${(error as Error).message}`);
  }
}
