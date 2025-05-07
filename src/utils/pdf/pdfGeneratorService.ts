import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, SectionParams } from './types';
import { drawVehicleInfoSection } from './sections/vehicleInfoSection';
import { drawValuationSection } from './sections/valuationSection';
import { drawExplanationSection } from './sections/explanationSection';
import { drawFooterSection } from './sections/footerSection';
import { applyWatermark } from './sections/watermark';

/**
 * Generates a PDF report for a vehicle valuation
 * @param data The report data to include
 * @param options Options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePdfReport(
  data: ReportData,
  options: {
    includeBranding?: boolean;
    includeTimestamp?: boolean;
    includePageNumbers?: boolean;
    pageNumber?: number;
    totalPages?: number;
  } = {}
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document (Letter size)
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set drawing parameters
  const margin = 50;
  const contentWidth = width - margin * 2;
  
  // Create section params object
  const sectionParams: SectionParams = {
    page,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    contentWidth
  };
  
  // Apply watermark if premium
  if (data.isPremium && options.includeBranding !== false) {
    applyWatermark(sectionParams, "Car Detective™ • Premium Report");
  }
  
  // Track vertical position
  let yPosition = height - margin;
  
  // Draw header
  page.drawRectangle({
    x: margin,
    y: height - margin - 50,
    width: contentWidth,
    height: 50,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  page.drawText("Vehicle Valuation Report", {
    x: margin + 10,
    y: height - margin - 30,
    size: 18,
    font: boldFont
  });
  
  yPosition -= 70;
  
  // Draw vehicle info section
  yPosition = drawVehicleInfoSection(sectionParams, data, yPosition);
  
  // Draw valuation section
  yPosition = drawValuationSection(sectionParams, data, yPosition);
  
  // Draw explanation if available
  if (data.explanation) {
    yPosition = drawExplanationSection(sectionParams, data.explanation, yPosition);
  }
  
  // Draw footer
  drawFooterSection(
    sectionParams,
    options.includeTimestamp !== false, // includeTimestamp
    options.pageNumber || 1,            // pageNumber
    options.totalPages || 1,            // totalPages
    options.includeBranding || false    // includeWatermark
  );
  
  // Generate and return PDF bytes
  return await pdfDoc.save();
}

/**
 * Generates a multi-page PDF report for a vehicle valuation
 * @param data The report data to include
 * @param options Options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateMultiPagePdfReport(
  data: ReportData,
  options: {
    includeBranding?: boolean;
    includeTimestamp?: boolean;
    includePageNumbers?: boolean;
  } = {}
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add first page (main valuation)
  const page1 = pdfDoc.addPage([612, 792]);
  const { width, height } = page1.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set drawing parameters
  const margin = 50;
  const contentWidth = width - margin * 2;
  
  // Create section params object for first page
  const sectionParams1: SectionParams = {
    page: page1,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    contentWidth
  };
  
  // Apply watermark if premium
  if (data.isPremium && options.includeBranding !== false) {
    applyWatermark(sectionParams1, "Car Detective™ • Premium Report");
  }
  
  // Track vertical position
  let yPosition = height - margin;
  
  // Draw header
  page1.drawRectangle({
    x: margin,
    y: height - margin - 50,
    width: contentWidth,
    height: 50,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  page1.drawText("Vehicle Valuation Report", {
    x: margin + 10,
    y: height - margin - 30,
    size: 18,
    font: boldFont
  });
  
  yPosition -= 70;
  
  // Draw vehicle info section
  yPosition = drawVehicleInfoSection(sectionParams1, data, yPosition);
  
  // Draw valuation section
  yPosition = drawValuationSection(sectionParams1, data, yPosition);
  
  // Draw footer on first page
  drawFooterSection(
    sectionParams1,
    options.includeTimestamp !== false, // includeTimestamp
    1,                                  // pageNumber
    2,                                  // totalPages
    options.includeBranding || false    // includeWatermark
  );
  
  // Add second page (explanation and details)
  const page2 = pdfDoc.addPage([612, 792]);
  
  // Create section params object for second page
  const sectionParams2: SectionParams = {
    page: page2,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    contentWidth
  };
  
  // Apply watermark if premium
  if (data.isPremium && options.includeBranding !== false) {
    applyWatermark(sectionParams2, "Car Detective™ • Premium Report");
  }
  
  // Reset vertical position for second page
  yPosition = height - margin;
  
  // Draw header on second page
  page2.drawRectangle({
    x: margin,
    y: height - margin - 50,
    width: contentWidth,
    height: 50,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  page2.drawText("Valuation Details", {
    x: margin + 10,
    y: height - margin - 30,
    size: 18,
    font: boldFont
  });
  
  yPosition -= 70;
  
  // Draw explanation if available
  if (data.explanation) {
    yPosition = drawExplanationSection(sectionParams2, data.explanation, yPosition);
  }
  
  // Draw footer on second page
  drawFooterSection(
    sectionParams2,
    options.includeTimestamp !== false, // includeTimestamp
    2,                                  // pageNumber
    2,                                  // totalPages
    options.includeBranding || false    // includeWatermark
  );
  
  // Generate and return PDF bytes
  return await pdfDoc.save();
}

/**
 * Generates a PDF report with custom options
 * @param data The report data to include
 * @param options Options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generateCustomPdfReport(
  data: ReportData,
  options: {
    includeBranding?: boolean;
    includeTimestamp?: boolean;
    includePageNumbers?: boolean;
    includeExplanation?: boolean;
    includeAdjustments?: boolean;
  } = {}
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]);
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set drawing parameters
  const margin = 50;
  const contentWidth = width - margin * 2;
  
  // Create section params object
  const sectionParams: SectionParams = {
    page,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    contentWidth
  };
  
  // Apply watermark if premium and branding is included
  if (data.isPremium && options.includeBranding !== false) {
    applyWatermark(sectionParams, "Car Detective™ • Premium Report");
  }
  
  // Track vertical position
  let yPosition = height - margin;
  
  // Draw header
  page.drawRectangle({
    x: margin,
    y: height - margin - 50,
    width: contentWidth,
    height: 50,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  page.drawText("Vehicle Valuation Report", {
    x: margin + 10,
    y: height - margin - 30,
    size: 18,
    font: boldFont
  });
  
  yPosition -= 70;
  
  // Draw vehicle info section
  yPosition = drawVehicleInfoSection(sectionParams, data, yPosition);
  
  // Draw valuation section
  yPosition = drawValuationSection(sectionParams, data, yPosition);
  
  // Draw explanation if available and included in options
  if (data.explanation && options.includeExplanation !== false) {
    yPosition = drawExplanationSection(sectionParams, data.explanation, yPosition);
  }
  
  // Draw footer
  drawFooterSection(
    sectionParams,
    options.includeTimestamp !== false, // includeTimestamp
    1,                                  // pageNumber
    1,                                  // totalPages
    options.includeBranding || false    // includeWatermark
  );
  
  // Generate and return PDF bytes
  return await pdfDoc.save();
}
