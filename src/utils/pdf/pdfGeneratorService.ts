import fs from 'fs/promises';
import path from 'path';
import { PDFDocument } from 'pdf-lib';
import { generatePdf } from './pdfGenerator';
import { ReportData, ReportOptions } from './types';

/**
 * Generates a valuation report PDF
 * @param data The report data
 * @param options Options for PDF generation
 * @returns The path to the generated PDF
 */
export async function generateValuationReport(
  data: ReportData,
  options: ReportOptions = {}
): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `valuation-report-${data.vin}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Generate the PDF
    await generatePdf(
      data,
      'valuation-report',
      outputPath,
      { format: 'A4', printBackground: true },
      (doc) => {
        // Add watermark or other modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating valuation report:', error);
    throw new Error(`Failed to generate valuation report: ${error.message}`);
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
  options: ReportOptions = {}
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
    
    // Generate the PDF
    await generatePdf(
      premiumData,
      'premium-report',
      outputPath,
      { format: 'A4', printBackground: true },
      (doc) => {
        // Add premium watermark or other modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating premium report:', error);
    throw new Error(`Failed to generate premium report: ${error.message}`);
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
  options: ReportOptions = {}
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
    
    // Generate the PDF
    await generatePdf(
      dealerData,
      'dealer-report',
      outputPath,
      { format: 'A4', printBackground: true },
      (doc) => {
        // Add dealer watermark or other modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating dealer report:', error);
    throw new Error(`Failed to generate dealer report: ${error.message}`);
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
        rotate: Math.PI / 4, // 45 degrees
      });
    }
    
    // Save the modified PDF
    const modifiedPdfBytes = await pdfDoc.save();
    const outputPath = pdfPath.replace('.pdf', '-watermarked.pdf');
    await fs.writeFile(outputPath, modifiedPdfBytes);
    
    return outputPath;
  } catch (error) {
    console.error('Error adding watermark:', error);
    throw new Error(`Failed to add watermark: ${error.message}`);
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
  options: ReportOptions = {}
): Promise<string> {
  try {
    if (!vehicles || vehicles.length < 2) {
      throw new Error('At least two vehicles are required for comparison');
    }
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports', 'comparison');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `comparison-report-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Prepare comparison data
    const comparisonData = {
      vehicles,
      timestamp: new Date().toISOString(),
      title: options.title || 'Vehicle Comparison Report',
      userName: options.userName || 'Car Detective User'
    };
    
    // Generate the PDF
    await generatePdf(
      comparisonData,
      'comparison-report',
      outputPath,
      { format: 'A4', printBackground: true, landscape: true },
      (doc) => {
        // Add comparison-specific modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating comparison report:', error);
    throw new Error(`Failed to generate comparison report: ${error.message}`);
  }
}

/**
 * Generates a market trend report
 * @param data The report data
 * @param marketData Market trend data
 * @param options Options for PDF generation
 * @returns Path to the generated PDF
 */
export async function generateMarketTrendReport(
  data: ReportData,
  marketData: any,
  options: ReportOptions = {}
): Promise<string> {
  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'reports', 'market');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Generate a unique filename
    const timestamp = new Date().getTime();
    const filename = `market-trend-report-${data.vin}-${timestamp}.pdf`;
    const outputPath = path.join(outputDir, filename);
    
    // Combine data
    const reportData = {
      ...data,
      marketData,
      isPremium: true
    };
    
    // Generate the PDF
    await generatePdf(
      reportData,
      'market-trend-report',
      outputPath,
      { format: 'A4', printBackground: true },
      (doc) => {
        // Add market trend specific modifications
      }
    );
    
    return outputPath;
  } catch (error) {
    console.error('Error generating market trend report:', error);
    throw new Error(`Failed to generate market trend report: ${error.message}`);
  }
}
