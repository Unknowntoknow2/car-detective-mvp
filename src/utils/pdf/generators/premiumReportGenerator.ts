
import { PDFDocument, PDFPage, rgb, StandardFonts, PDFFont, RGB } from 'pdf-lib';
import { ReportData, SectionParams, ReportGeneratorParams } from '../types';
import { drawWatermark } from '../sections/watermark';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';

/**
 * Generate a premium PDF report for a vehicle valuation
 * @param params Report generator parameters
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePremiumReport(params: ReportGeneratorParams): Promise<Uint8Array> {
  const { data, options, document } = params;
  
  // Create a new PDF document
  const pdfDoc = document || await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([850, 1100]);
  const { width, height } = page.getSize();
  
  // Load fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0, 0.3, 0.7);
  
  // Set initial y position (starting from top)
  let currentY = height - 50;
  
  // Define margin
  const margin = 50;
  
  // Page parameters to pass to drawing functions
  const pageParams: SectionParams = {
    page,
    data,
    y: currentY,
    width,
    height,
    margin,
    textColor,
    primaryColor,
    regularFont: helveticaFont,
    boldFont: helveticaBold,
    italicFont: helveticaOblique
  };
  
  // Draw watermark if enabled
  if (options.watermark) {
    drawWatermark(pageParams);
  }
  
  // Draw report header
  currentY = drawReportHeader({
    ...pageParams,
    y: currentY
  });
  
  // Draw vehicle info section
  currentY = drawVehicleInfoSection({
    ...pageParams,
    y: currentY
  });
  
  // Draw valuation summary section
  currentY = drawValuationSummary({
    ...pageParams,
    y: currentY
  });
  
  // Draw adjustment table if adjustments are available
  if (data.adjustments && data.adjustments.length > 0) {
    currentY = drawAdjustmentTable({
      ...pageParams,
      y: currentY
    });
  }
  
  // Add a new page for additional content if we're running out of space
  if (currentY < 300) {
    const newPage = pdfDoc.addPage([850, 1100]);
    const newPageParams = {
      ...pageParams,
      page: newPage,
      y: height - 50
    };
    
    if (options.watermark) {
      drawWatermark(newPageParams);
    }
    
    currentY = height - 50;
    pageParams.page = newPage;
    pageParams.y = currentY;
  }
  
  // Draw photo assessment section if enabled
  if (options.includePhotoAssessment && (data.photoUrl || data.bestPhotoUrl || data.aiCondition)) {
    currentY = drawPhotoAssessmentSection({
      ...pageParams,
      y: currentY
    });
  }
  
  // Draw explanation section if enabled
  if (options.includeExplanation && data.explanation) {
    currentY = drawExplanationSection({
      ...pageParams,
      y: currentY
    });
  }
  
  // Draw professional opinion section
  currentY = drawProfessionalOpinion({
    ...pageParams,
    y: currentY
  });
  
  // Draw disclaimer
  currentY = drawDisclaimerSection({
    ...pageParams,
    y: currentY
  });
  
  // Draw footer on all pages
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const footerPage = pdfDoc.getPage(i);
    drawFooter({
      ...pageParams,
      page: footerPage
    });
  }
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}

/**
 * Draw the report header
 */
function drawReportHeader(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, primaryColor, regularFont, boldFont } = params;
  
  if (!page || !boldFont || !regularFont) return y;
  
  let currentY = y;
  
  // Draw logo or report title
  const reportTitle = data.reportTitle || 'PREMIUM VEHICLE VALUATION REPORT';
  page.drawText(reportTitle, {
    x: margin,
    y: currentY,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;
  
  // Draw report generation date
  const dateStr = data.generatedDate instanceof Date 
    ? data.generatedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  page.drawText(`Generated on ${dateStr}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: textColor
  });
  currentY -= 20;
  
  // Draw vehicle name
  const vehicleName = `${data.year} ${data.make} ${data.model} ${data.trim || ''}`.trim();
  page.drawText(vehicleName, {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: textColor
  });
  currentY -= 40;
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw vehicle information section
 */
function drawVehicleInfoSection(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, regularFont, boldFont } = params;
  
  if (!page || !boldFont || !regularFont) return y;
  
  let currentY = y;
  
  // Draw section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 25;
  
  // Define information fields
  const fields = [
    { label: 'Make', value: data.make },
    { label: 'Model', value: data.model },
    { label: 'Year', value: data.year.toString() },
    { label: 'Trim', value: data.trim || 'N/A' },
    { label: 'VIN', value: data.vin || 'N/A' },
    { label: 'Mileage', value: `${data.mileage.toLocaleString()} miles` },
    { label: 'Fuel Type', value: data.fuelType || 'N/A' },
    { label: 'Transmission', value: data.transmission || 'N/A' },
    { label: 'Color', value: data.color || 'N/A' },
    { label: 'Body Style', value: data.bodyStyle || data.bodyType || 'N/A' }
  ];
  
  // Calculate column width
  const columnWidth = (width - (margin * 2) - 20) / 2;
  
  // Draw fields in two columns
  for (let i = 0; i < fields.length; i++) {
    const field = fields[i];
    const isRightColumn = i >= fields.length / 2;
    const x = isRightColumn ? margin + columnWidth + 20 : margin;
    const rowIndex = isRightColumn ? i - Math.floor(fields.length / 2) : i;
    const fieldY = currentY - (rowIndex * 25);
    
    // Draw label
    page.drawText(`${field.label}:`, {
      x,
      y: fieldY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    // Draw value
    page.drawText(field.value, {
      x: x + 100,
      y: fieldY,
      size: 12,
      font: boldFont,
      color: textColor
    });
  }
  
  // Update Y position based on number of rows
  const rowsNeeded = Math.ceil(fields.length / 2);
  currentY -= (rowsNeeded * 25) + 20;
  
  return currentY;
}

/**
 * Draw valuation summary section
 */
function drawValuationSummary(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, primaryColor, regularFont, boldFont } = params;
  
  if (!page || !boldFont || !regularFont) return y;
  
  let currentY = y;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 30;
  
  // Draw estimated value
  const formattedValue = formatCurrency(data.estimatedValue);
  page.drawText(formattedValue, {
    x: margin,
    y: currentY,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length >= 2) {
    page.drawText('Estimated Price Range:', {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    const rangeText = `${formatCurrency(data.priceRange[0])} - ${formatCurrency(data.priceRange[1])}`;
    page.drawText(rangeText, {
      x: margin + 160,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    currentY -= 20;
  }
  
  // Draw confidence score if available
  if (data.confidenceScore !== undefined) {
    page.drawText('Confidence Score:', {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    page.drawText(`${data.confidenceScore}%`, {
      x: margin + 160,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    currentY -= 20;
  }
  
  // Draw region information if available
  if (data.zipCode || data.regionName) {
    page.drawText('Location:', {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    const locationText = data.regionName || `ZIP Code: ${data.zipCode}`;
    page.drawText(locationText, {
      x: margin + 160,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    currentY -= 30;
  }
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the adjustment table showing valuation factors
 */
function drawAdjustmentTable(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, regularFont, boldFont, italicFont } = params;
  
  if (!page || !boldFont || !regularFont || !data.adjustments) return y;
  
  let currentY = y;
  
  // Draw section title
  page.drawText('Value Adjustments', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 25;
  
  // Calculate column widths
  const tableWidth = width - (margin * 2);
  const colWidths = [tableWidth * 0.3, tableWidth * 0.2, tableWidth * 0.5];
  
  // Draw table headers
  page.drawText('Factor', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Impact', {
    x: margin + colWidths[0],
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Description', {
    x: margin + colWidths[0] + colWidths[1],
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  currentY -= 15;
  
  // Draw header separator line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 15;
  
  // Draw each adjustment
  for (const adjustment of data.adjustments) {
    // Factor
    page.drawText(adjustment.factor, {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: textColor
    });
    
    // Impact
    const impactText = formatCurrency(adjustment.impact);
    const impactColor = adjustment.impact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0);
    
    page.drawText(impactText, {
      x: margin + colWidths[0],
      y: currentY,
      size: 11,
      font: boldFont,
      color: impactColor
    });
    
    // Description
    if (adjustment.description) {
      const description = adjustment.description;
      const maxCharsPerLine = 50;
      
      // Simplified text wrapping for descriptions
      if (description.length <= maxCharsPerLine) {
        page.drawText(description, {
          x: margin + colWidths[0] + colWidths[1],
          y: currentY,
          size: 11,
          font: italicFont || regularFont,
          color: textColor
        });
      } else {
        // Simple line splitting for long descriptions
        const firstLine = description.substring(0, maxCharsPerLine);
        const secondLine = description.substring(maxCharsPerLine);
        
        page.drawText(firstLine, {
          x: margin + colWidths[0] + colWidths[1],
          y: currentY,
          size: 11,
          font: italicFont || regularFont,
          color: textColor
        });
        
        currentY -= 15;
        
        page.drawText(secondLine, {
          x: margin + colWidths[0] + colWidths[1],
          y: currentY,
          size: 11,
          font: italicFont || regularFont,
          color: textColor
        });
      }
    }
    
    currentY -= 20;
  }
  
  // Draw total line
  currentY -= 5;
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 15;
  
  // Calculate and draw total
  const total = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  
  page.drawText('Total Adjustments:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  const totalText = formatCurrency(total);
  const totalColor = total >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0);
  
  page.drawText(totalText, {
    x: margin + colWidths[0],
    y: currentY,
    size: 12,
    font: boldFont,
    color: totalColor
  });
  
  currentY -= 30;
  
  return currentY;
}

/**
 * Draw the professional opinion section
 */
function drawProfessionalOpinion(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, regularFont, boldFont } = params;
  
  if (!page || !boldFont || !regularFont) return y;
  
  let currentY = y;
  
  // Draw section title
  page.drawText('Professional Opinion', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 25;
  
  // Draw professional opinion content
  const opinion = `This ${data.year} ${data.make} ${data.model} ${data.trim || ''} has been professionally evaluated based on current market conditions, vehicle specifications, and condition assessment. The valuation represents the estimated private party sale value in the ${data.regionName || 'current'} market.`;
  
  // Draw opinion text with simple word wrapping
  const maxWidth = width - (margin * 2);
  const words = opinion.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const testWidth = regularFont.widthOfTextAtSize(testLine, 12);
    
    if (testWidth > maxWidth && line !== '') {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 12,
        font: regularFont,
        color: textColor
      });
      line = word;
      currentY -= 18;
    } else {
      line = testLine;
    }
  }
  
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    currentY -= 30;
  }
  
  return currentY;
}

/**
 * Draw the explanation section
 */
function drawExplanationSection(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, regularFont, italicFont } = params;
  
  if (!page || !regularFont || !data.explanation) return y;
  
  let currentY = y;
  
  // Draw section title
  page.drawText('Detailed Explanation', {
    x: margin,
    y: currentY,
    size: 16,
    font: regularFont,
    color: textColor
  });
  currentY -= 25;
  
  // Split explanation into paragraphs
  const paragraphs = data.explanation.split('\n');
  
  // Draw each paragraph with word wrapping
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      currentY -= 12;
      continue;
    }
    
    // Simple word wrapping
    const maxWidth = width - (margin * 2);
    const words = paragraph.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const testWidth = regularFont.widthOfTextAtSize(testLine, 11);
      
      if (testWidth > maxWidth && line !== '') {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 11,
          font: italicFont || regularFont,
          color: textColor
        });
        line = word;
        currentY -= 16;
      } else {
        line = testLine;
      }
    }
    
    if (line) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 11,
        font: italicFont || regularFont,
        color: textColor
      });
      currentY -= 16;
    }
    
    currentY -= 10; // Extra space between paragraphs
  }
  
  return currentY;
}

/**
 * Draw the disclaimer section
 */
function drawDisclaimerSection(params: SectionParams): number {
  const { page, data, y = 0, width = 0, margin = 0, textColor, regularFont } = params;
  
  if (!page || !regularFont) return y;
  
  let currentY = y;
  
  // Default disclaimer text
  const disclaimer = data.disclaimerText || 'This valuation is an estimate based on market data and may not reflect the actual value of this specific vehicle. Factors such as actual condition, local market variations, and unique vehicle history can affect the real-world value.';
  
  // Draw disclaimer
  page.drawText('Disclaimer:', {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: textColor
  });
  currentY -= 15;
  
  // Simple word wrapping for disclaimer
  const maxWidth = width - (margin * 2);
  const words = disclaimer.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const testWidth = regularFont.widthOfTextAtSize(testLine, 9);
    
    if (testWidth > maxWidth && line !== '') {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 9,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5)
      });
      line = word;
      currentY -= 12;
    } else {
      line = testLine;
    }
  }
  
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 9,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Draw the footer on every page
 */
function drawFooter(params: SectionParams): void {
  const { page, data, width = 0, margin = 0, textColor, regularFont } = params;
  
  if (!page || !regularFont) return;
  
  const footerY = 30;
  
  // Draw footer line
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  // Draw copyright text
  const currentYear = new Date().getFullYear();
  const companyName = data.companyName || 'Car Detective';
  const footerText = `© ${currentYear} ${companyName}. All rights reserved.`;
  
  page.drawText(footerText, {
    x: margin,
    y: footerY,
    size: 9,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw website if available
  if (data.website) {
    const websiteWidth = regularFont.widthOfTextAtSize(data.website, 9);
    
    page.drawText(data.website, {
      x: width - margin - websiteWidth,
      y: footerY,
      size: 9,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
}

/**
 * Format a number as currency
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
}
