import { PDFDocument, PDFFont, rgb, PDFPage } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams, DocumentFonts } from '../types';
import { drawExplanationSection } from '../sections/explanationSection';
import { drawValuePredictionSection } from '../sections/valuePredictionSection';
import { drawProfessionalOpinionSection } from '../sections/professionalOpinionSection';
import { RotationTypes } from '../types';

// Create function signatures to avoid name conflicts with imports
function addHeaderSection(page: PDFPage, params: any): number { return 0; }
function addSummarySection(page: PDFPage, params: any): number { return 0; }
function addBreakdownSection(page: PDFPage, params: any): number { return 0; }
function addFooterSection(page: PDFPage, params: any): void {}
function addExplanationSection(page: PDFPage, params: any): number { return 0; }
function addConditionAssessmentSection(page: PDFPage, params: any): number { return 0; }
function addComparablesSection(page: PDFPage, params: any): number { return 0; }

/**
 * Generate a premium valuation report with full details
 * @param reportData The data to include in the report
 * @param options Additional options for PDF generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePremiumReport(
  reportData: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  
  // Create a new page
  const page = pdfDoc.addPage([8.5 * 72, 11 * 72]); // Letter size
  const { width, height } = page.getSize();
  
  // Set margins
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Load fonts
  const fontBytes = await pdfDoc.embedFont('Helvetica');
  const boldFontBytes = await pdfDoc.embedFont('Helvetica-Bold');
  
  const fonts: DocumentFonts = {
    regular: fontBytes,
    bold: boldFontBytes,
  };
  
  // Define colors
  const primaryColor = rgb(0, 0.5, 0.8);
  const secondaryColor = rgb(0.6, 0.6, 0.6);
  const textColor = rgb(0.1, 0.1, 0.1);
  
  // Current Y position for drawing elements
  let currentY = height - margin;
  
  // Add title
  page.drawText(`Vehicle Valuation Report: ${reportData.year} ${reportData.make} ${reportData.model}`, {
    x: margin,
    y: currentY,
    size: 16,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 10;
  
  // Add subtitle with date
  const generatedDate = reportData.generatedAt ? 
    new Date(reportData.generatedAt).toLocaleDateString() : 
    new Date().toLocaleDateString();
  
  page.drawText(`Generated on: ${generatedDate}`, {
    x: margin,
    y: currentY,
    size: 10,
    font: fonts.regular,
    color: secondaryColor,
  });
  
  currentY -= 30;
  
  // Add watermark if option is set
  if (options.showPremiumWatermark) {
    // Add diagonal watermark across the page
    const watermarkText = options.watermarkText || 'CAR DETECTIVE';
    const watermarkFont = fonts.bold;
    const watermarkSize = 60;
    const watermarkTextWidth = watermarkFont.widthOfTextAtSize(watermarkText, watermarkSize);
    
    // Position watermark in the center of the page
    const watermarkX = (width - watermarkTextWidth) / 2;
    const watermarkY = height / 2;
    
    // Set rotation for the watermark text (30 degrees)
    // Using degrees for rotation type
    page.drawText(watermarkText, {
      x: watermarkX,
      y: watermarkY,
      size: watermarkSize,
      font: watermarkFont,
      color: rgb(0.9, 0.9, 0.9), // Light gray
      opacity: 0.2,
      rotate: {
        type: RotationTypes.Degrees,
        angle: -30,
      },
    });
  }
  
  // Create parameters object for section drawing
  const sectionParams: SectionParams = {
    page,
    width: contentWidth,
    pageWidth: width,
    startY: currentY,
    margin,
    fonts,
    data: reportData,
    options,
    textColor,
    primaryColor,
    height,
    pdfDoc,
  };
  
  // Draw vehicle details section
  currentY = drawVehicleDetailsSection(sectionParams);
  
  // Draw valuation summary section
  currentY = drawValuationSummarySection({ ...sectionParams, startY: currentY });
  
  // Draw adjustments section
  currentY = drawAdjustmentsSection({ ...sectionParams, startY: currentY });
  
  // Draw explanation section if included
  currentY = drawExplanationSection({ ...sectionParams, startY: currentY });
  
  // Draw value prediction section (premium only)
  currentY = drawValuePredictionSection({ ...sectionParams, startY: currentY });
  
  // Draw professional opinion section (premium only)
  currentY = drawProfessionalOpinionSection({ ...sectionParams, startY: currentY });
  
  // Draw footer
  drawFooterSection({ ...sectionParams, startY: currentY });
  
  // Return the PDF as a buffer
  return await pdfDoc.save();
}

/**
 * Draw vehicle details section
 * @param params Section parameters
 * @returns New Y position
 */
function drawVehicleDetailsSection(params: SectionParams): number {
  const { page, startY, margin, fonts, data, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw section title
  page.drawText('Vehicle Details', {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Create a two-column layout for vehicle details
  const leftCol = margin;
  const rightCol = margin + 200;
  
  // Left column details
  page.drawText('Make:', {
    x: leftCol,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText(data.make, {
    x: leftCol + 80,
    y,
    size: 9,
    font: fonts.regular,
    color: textColor,
  });
  
  y -= 15;
  
  page.drawText('Model:', {
    x: leftCol,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText(data.model, {
    x: leftCol + 80,
    y,
    size: 9,
    font: fonts.regular,
    color: textColor,
  });
  
  y -= 15;
  
  page.drawText('Year:', {
    x: leftCol,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText(data.year.toString(), {
    x: leftCol + 80,
    y,
    size: 9,
    font: fonts.regular,
    color: textColor,
  });
  
  // Reset Y for right column
  y += 30;
  
  // Right column details
  page.drawText('Mileage:', {
    x: rightCol,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText(data.mileage.toLocaleString(), {
    x: rightCol + 80,
    y,
    size: 9,
    font: fonts.regular,
    color: textColor,
  });
  
  y -= 15;
  
  page.drawText('Condition:', {
    x: rightCol,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText(data.condition, {
    x: rightCol + 80,
    y,
    size: 9,
    font: fonts.regular,
    color: textColor,
  });
  
  y -= 15;
  
  if (data.vin) {
    page.drawText('VIN:', {
      x: rightCol,
      y,
      size: 9,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(data.vin, {
      x: rightCol + 80,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  }
  
  // Additional details for premium reports
  if (data.isPremium) {
    // Add more vehicle details if available
    if (data.transmission) {
      y -= 15;
      
      page.drawText('Transmission:', {
        x: leftCol,
        y,
        size: 9,
        font: fonts.bold,
        color: textColor,
      });
      
      page.drawText(data.transmission, {
        x: leftCol + 80,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
    }
    
    if (data.bodyStyle) {
      // Reset Y for right column
      if (!data.transmission) {
        y -= 15;
      }
      
      page.drawText('Body Style:', {
        x: rightCol,
        y,
        size: 9,
        font: fonts.bold,
        color: textColor,
      });
      
      page.drawText(data.bodyStyle, {
        x: rightCol + 80,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
    }
    
    if (data.fuelType) {
      y -= 15;
      
      page.drawText('Fuel Type:', {
        x: leftCol,
        y,
        size: 9,
        font: fonts.bold,
        color: textColor,
      });
      
      page.drawText(data.fuelType, {
        x: leftCol + 80,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
    }
    
    if (data.color) {
      // Reset Y for right column
      if (!data.fuelType) {
        y -= 15;
      }
      
      page.drawText('Color:', {
        x: rightCol,
        y,
        size: 9,
        font: fonts.bold,
        color: textColor,
      });
      
      page.drawText(data.color, {
        x: rightCol + 80,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
    }
  }
  
  y -= 20;
  
  return y;
}

/**
 * Draw valuation summary section
 * @param params Section parameters
 * @returns New Y position
 */
function drawValuationSummarySection(params: SectionParams): number {
  const { page, startY, margin, width, fonts, data, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw estimated value with larger font
  page.drawText('Estimated Value:', {
    x: margin,
    y,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  const valueString = `$${data.estimatedValue.toLocaleString()}`;
  const valueWidth = fonts.bold.widthOfTextAtSize(valueString, 14);
  
  page.drawText(valueString, {
    x: margin + 120,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw confidence score
  page.drawText('Confidence Score:', {
    x: margin,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  const scoreWidth = 100 * (data.confidenceScore / 100);
  
  // Draw score background
  page.drawRectangle({
    x: margin + 120,
    y: y - 5,
    width: 100,
    height: 10,
    color: rgb(0.9, 0.9, 0.9),
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  });
  
  // Draw score fill
  page.drawRectangle({
    x: margin + 120,
    y: y - 5,
    width: scoreWidth,
    height: 10,
    color: primaryColor,
  });
  
  // Draw score text
  page.drawText(`${data.confidenceScore}%`, {
    x: margin + 225,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  y -= 25;
  
  // Draw price range if available
  if (data.priceRange) {
    const priceRangeText = Array.isArray(data.priceRange)
      ? `$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`
      : `$${Math.floor(data.estimatedValue * 0.95).toLocaleString()} - $${Math.ceil(data.estimatedValue * 1.05).toLocaleString()}`;
    
    page.drawText('Price Range:', {
      x: margin,
      y,
      size: 9,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(priceRangeText, {
      x: margin + 120,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  }
  
  // Show the base value for premium reports
  if (data.baseValue) {
    page.drawText('Base Value:', {
      x: margin,
      y,
      size: 9,
      font: fonts.bold,
      color: textColor,
    });
    
    const baseValueText = `$${data.baseValue.toLocaleString()}`;
    
    page.drawText(baseValueText, {
      x: margin + 120,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  }
  
  // Location information
  if (data.zipCode) {
    page.drawText('Location:', {
      x: margin,
      y,
      size: 9,
      font: fonts.bold,
      color: textColor,
    });
    
    page.drawText(`ZIP Code ${data.zipCode}`, {
      x: margin + 120,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    y -= 15;
  }
  
  y -= 10;
  
  return y;
}

/**
 * Draw adjustments section
 * @param params Section parameters
 * @returns New Y position
 */
function drawAdjustmentsSection(params: SectionParams): number {
  const { page, startY, margin, fonts, data, textColor, primaryColor } = params;
  let y = startY;
  
  // Skip if no adjustments
  if (!data.adjustments || data.adjustments.length === 0) {
    return y;
  }
  
  // Draw section title
  page.drawText('Value Adjustments', {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Headers
  page.drawText('Factor', {
    x: margin,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + 200,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + 280,
    y,
    size: 9,
    font: fonts.bold,
    color: textColor,
  });
  
  y -= 15;
  
  // Draw line under headers
  page.drawLine({
    start: { x: margin, y },
    end: { x: margin + 500, y },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  y -= 10;
  
  // Draw each adjustment
  for (const adjustment of data.adjustments) {
    page.drawText(adjustment.factor, {
      x: margin,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    const impactText = adjustment.impact >= 0 ? 
      `+$${adjustment.impact.toLocaleString()}` : 
      `-$${Math.abs(adjustment.impact).toLocaleString()}`;
    
    const impactColor = adjustment.impact >= 0 ? 
      rgb(0.2, 0.6, 0.2) : // Green for positive
      rgb(0.8, 0.2, 0.2);  // Red for negative
    
    page.drawText(impactText, {
      x: margin + 200,
      y,
      size: 9,
      font: fonts.bold,
      color: impactColor,
    });
    
    if (adjustment.description) {
      page.drawText(adjustment.description, {
        x: margin + 280,
        y,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
    }
    
    y -= 15;
  }
  
  y -= 10;
  
  return y;
}

/**
 * Draw footer section
 * @param params Section parameters
 */
function drawFooterSection(params: SectionParams): void {
  const { page, margin, width, fonts, options } = params;
  const { height } = page.getSize();
  
  // Skip if footer is not included
  if (options.includeFooter === false) {
    return;
  }
  
  const footerText = options.footerText || 'This report was generated by Car Detective. Values are estimates based on market data.';
  const footerY = 40; // Fixed position from bottom
  
  page.drawText(footerText, {
    x: margin,
    y: footerY,
    size: 8,
    font: fonts.regular,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Add page number
  const pageText = 'Page 1 of 1';
  const pageTextWidth = fonts.regular.widthOfTextAtSize(pageText, 8);
  
  page.drawText(pageText, {
    x: width - margin - pageTextWidth,
    y: footerY,
    size: 8,
    font: fonts.regular,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Draw line above footer
  page.drawLine({
    start: { x: margin, y: footerY + 15 },
    end: { x: width - margin, y: footerY + 15 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
}
