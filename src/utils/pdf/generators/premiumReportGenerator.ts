
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams } from '../types';
import { mvpPdfStyles, drawStyledHeading, drawPremiumBadge } from '../styles';
import { addHeaderSection } from '../sections/header';
import { addSummarySection } from '../sections/summary';
import { addBreakdownSection } from '../sections/breakdown';
import { addFooterSection } from '../sections/footer';
import { addExplanationSection } from '../sections/explanation';
import { addConditionAssessmentSection } from '../sections/conditionAssessment';
import { addComparablesSection } from '../sections/comparables';

/**
 * Generate a premium valuation report PDF
 */
export async function generatePremiumReport(
  data: ReportData,
  options: ReportOptions
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Embed the standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Create a page
  const page = pdfDoc.addPage([850, 1100]);
  const { width, height } = page.getSize();
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.2, 0.4, 0.8);
  
  // Set up the fonts object
  const fonts = {
    regular: fontRegular,
    bold: fontBold,
    italic: fontItalic
  };
  
  // Define parameters for the page sections
  const params = {
    page,
    startY: height - mvpPdfStyles.spacing.margin,
    width: width - 2 * mvpPdfStyles.spacing.margin,
    margin: mvpPdfStyles.spacing.margin,
    data,
    options,
    textColor,
    primaryColor,
    height,
    fonts
  };
  
  // Track the current Y position as we add sections
  let currentY = params.startY;
  
  // Add the header section
  currentY = await addHeaderSection({
    ...params,
    y: currentY
  });
  
  // Add summary section with valuation and vehicle info
  currentY = await addSummarySection({
    ...params,
    y: currentY
  });
  
  // Add the price breakdown section
  currentY = await addBreakdownSection({
    ...params,
    y: currentY
  });
  
  // Add the explanation section if included
  if (options.includeExplanation) {
    currentY = await addExplanationSection({
      ...params,
      y: currentY
    });
  }
  
  // Add the condition assessment section if we have AI condition data
  if (options.includePhotoAssessment && data.aiCondition) {
    currentY = await addConditionAssessmentSection({
      ...params,
      y: currentY
    });
  }
  
  // Add comparables section
  currentY = await addComparablesSection({
    ...params,
    y: currentY
  });
  
  // Add the footer section
  await addFooterSection({
    ...params,
    y: currentY
  });
  
  // Add watermark if needed
  if (options.watermark) {
    const watermarkText = typeof options.watermark === 'string' 
      ? options.watermark 
      : 'SAMPLE REPORT';
      
    addWatermark(page, watermarkText, fontBold, width, height);
  }
  
  // Serialize the PDFDocument to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

/**
 * Add a watermark across the page
 */
function addWatermark(
  page: any,
  text: string,
  font: any,
  width: number,
  height: number
): void {
  const fontSize = 60;
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const textHeight = fontSize;
  
  const x = (width - textWidth) / 2;
  const y = (height - textHeight) / 2;
  
  page.drawText(text, {
    x,
    y,
    size: fontSize,
    font,
    color: rgb(0.85, 0.85, 0.85),
    opacity: 0.3,
    rotate: { type: 'degrees', angle: -45 }
  });
}

// Temporary placeholder implementations of PDF section generators 
// (to be replaced with actual implementations)

/**
 * Add the header section to the PDF
 */
export async function addHeaderSection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor } = params;
  const startY = y;
  
  // Draw report title
  page.drawText('PREMIUM VEHICLE VALUATION REPORT', {
    x: margin,
    y: startY,
    size: 24,
    font: fonts.bold,
    color: primaryColor
  });
  
  // Draw date
  const dateText = `Generated on: ${new Date(data.generatedAt || new Date()).toLocaleDateString()}`;
  page.drawText(dateText, {
    x: width - margin - fonts.regular.widthOfTextAtSize(dateText, 12),
    y: startY,
    size: 12,
    font: fonts.regular,
    color: textColor
  });
  
  // Draw vehicle info
  const vehicleText = `${data.year} ${data.make} ${data.model}`;
  page.drawText(vehicleText, {
    x: margin,
    y: startY - 40,
    size: 18,
    font: fonts.bold,
    color: textColor
  });
  
  // Draw VIN if available
  if (data.vin) {
    page.drawText(`VIN: ${data.vin}`, {
      x: margin,
      y: startY - 65,
      size: 12,
      font: fonts.regular,
      color: textColor
    });
  }
  
  // Draw company logo or premium badge
  if (data.isPremium || data.premium) {
    drawPremiumBadge(page, width - margin - 100, startY - 60, fonts.bold);
  }
  
  return startY - 100; // Return the new Y position
}

/**
 * Add the summary section to the PDF
 */
export async function addSummarySection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor } = params;
  const startY = y;
  
  const sectionTitle = 'VALUATION SUMMARY';
  const newY = drawStyledHeading(page, sectionTitle, margin, startY, 18, fonts.bold, primaryColor);
  
  // Draw valuation amount
  const formattedValue = `$${data.estimatedValue.toLocaleString()}`;
  page.drawText('Estimated Value:', {
    x: margin,
    y: newY - 30,
    size: 14,
    font: fonts.regular,
    color: textColor
  });
  
  page.drawText(formattedValue, {
    x: margin + 150,
    y: newY - 30,
    size: 20,
    font: fonts.bold,
    color: primaryColor
  });
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    const rangeText = `Price Range: $${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`;
    page.drawText(rangeText, {
      x: margin,
      y: newY - 60,
      size: 12,
      font: fonts.regular,
      color: textColor
    });
  }
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
      x: margin + 300,
      y: newY - 30,
      size: 14,
      font: fonts.regular,
      color: textColor
    });
  }
  
  // Draw vehicle details
  const detailsY = newY - 100;
  page.drawText('Vehicle Details', {
    x: margin,
    y: detailsY,
    size: 16,
    font: fonts.bold,
    color: textColor
  });
  
  // Create a details grid
  const details = [
    { label: 'Year:', value: data.year.toString() },
    { label: 'Make:', value: data.make },
    { label: 'Model:', value: data.model },
    { label: 'Trim:', value: data.trim || 'N/A' },
    { label: 'Mileage:', value: `${data.mileage.toLocaleString()} miles` },
    { label: 'Condition:', value: data.condition },
    { label: 'ZIP Code:', value: data.zipCode || 'N/A' },
  ];
  
  let detailsOffsetY = 30;
  details.forEach(detail => {
    page.drawText(detail.label, {
      x: margin,
      y: detailsY - detailsOffsetY,
      size: 12,
      font: fonts.bold,
      color: textColor
    });
    
    page.drawText(detail.value, {
      x: margin + 80,
      y: detailsY - detailsOffsetY,
      size: 12,
      font: fonts.regular,
      color: textColor
    });
    
    detailsOffsetY += 20;
  });
  
  return detailsY - detailsOffsetY - 20; // Return the new Y position
}

/**
 * Add the breakdown section to the PDF
 */
export async function addBreakdownSection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor } = params;
  const startY = y;
  
  const sectionTitle = 'VALUATION BREAKDOWN';
  const newY = drawStyledHeading(page, sectionTitle, margin, startY, 18, fonts.bold, primaryColor);
  
  // Draw base price info
  page.drawText('Base Vehicle Value:', {
    x: margin,
    y: newY - 30,
    size: 14,
    font: fonts.regular,
    color: textColor
  });
  
  // Use base price from data or calculate from adjustments
  let basePrice = data.basePrice;
  if (!basePrice && data.adjustments && data.adjustments.length > 0) {
    // Approximate base price by subtracting all adjustments from estimated value
    const adjustmentsTotal = data.adjustments.reduce((total, adj) => total + adj.impact, 0);
    basePrice = data.estimatedValue - adjustmentsTotal;
  }
  
  if (basePrice) {
    page.drawText(`$${basePrice.toLocaleString()}`, {
      x: margin + 300,
      y: newY - 30,
      size: 14,
      font: fonts.bold,
      color: textColor
    });
  }
  
  // Draw adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Adjustments:', {
      x: margin,
      y: newY - 60,
      size: 14,
      font: fonts.regular,
      color: textColor
    });
    
    let adjustmentOffsetY = 90;
    data.adjustments.forEach((adjustment) => {
      // Draw adjustment factor
      page.drawText(adjustment.factor, {
        x: margin + 20,
        y: newY - adjustmentOffsetY,
        size: 12,
        font: fonts.regular,
        color: textColor
      });
      
      // Draw adjustment description if available
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 150,
          y: newY - adjustmentOffsetY,
          size: 12,
          font: fonts.italic,
          color: textColor
        });
      }
      
      // Draw adjustment impact
      const impactPrefix = adjustment.impact > 0 ? '+' : '';
      page.drawText(`${impactPrefix}$${adjustment.impact.toLocaleString()}`, {
        x: margin + 300,
        y: newY - adjustmentOffsetY,
        size: 12,
        font: fonts.bold,
        color: adjustment.impact > 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0)
      });
      
      adjustmentOffsetY += 25;
    });
    
    // Draw total line
    page.drawText('Final Valuation:', {
      x: margin,
      y: newY - adjustmentOffsetY - 10,
      size: 14,
      font: fonts.bold,
      color: textColor
    });
    
    page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
      x: margin + 300,
      y: newY - adjustmentOffsetY - 10,
      size: 14,
      font: fonts.bold,
      color: primaryColor
    });
    
    return newY - adjustmentOffsetY - 40; // Return the new Y position
  }
  
  return newY - 60; // Return the new Y position if no adjustments
}

/**
 * Add the explanation section to the PDF
 */
export async function addExplanationSection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor } = params;
  const startY = y;
  
  const sectionTitle = 'VALUATION EXPLANATION';
  const newY = drawStyledHeading(page, sectionTitle, margin, startY, 18, fonts.bold, primaryColor);
  
  if (data.explanation) {
    // Define max width for wrapping text
    const maxWidth = width - 2 * margin;
    const fontSize = 12;
    const lineHeight = 16;
    
    // Split the explanation into words and build wrapped lines
    const words = data.explanation.split(' ');
    let lines = [];
    let currentLine = '';
    
    words.forEach((word: string) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testLineWidth = fonts.regular.widthOfTextAtSize(testLine, fontSize);
      
      if (testLineWidth > maxWidth) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    // Draw each line of the wrapped text
    let lineOffsetY = 30;
    lines.forEach(line => {
      page.drawText(line, {
        x: margin,
        y: newY - lineOffsetY,
        size: fontSize,
        font: fonts.regular,
        color: textColor
      });
      
      lineOffsetY += lineHeight;
    });
    
    return newY - lineOffsetY - 10; // Return the new Y position
  }
  
  return newY - 40; // Return the new Y position if no explanation
}

/**
 * Add the condition assessment section to the PDF
 */
export async function addConditionAssessmentSection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor } = params;
  const startY = y;
  
  const sectionTitle = 'AI CONDITION ASSESSMENT';
  const newY = drawStyledHeading(page, sectionTitle, margin, startY, 18, fonts.bold, primaryColor);
  
  if (data.aiCondition) {
    const { condition, confidence, score, issues } = data.aiCondition;
    
    page.drawText(`Condition Rating: ${condition}`, {
      x: margin,
      y: newY - 30,
      size: 14,
      font: fonts.bold,
      color: textColor
    });
    
    if (score) {
      page.drawText(`Score: ${score}/100`, {
        x: margin + 250,
        y: newY - 30,
        size: 14,
        font: fonts.regular,
        color: textColor
      });
    }
    
    if (confidence) {
      page.drawText(`Confidence: ${confidence}`, {
        x: margin + 350,
        y: newY - 30,
        size: 14,
        font: fonts.regular,
        color: textColor
      });
    }
    
    // Draw issues list if available
    if (issues && issues.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: newY - 60,
        size: 14,
        font: fonts.bold,
        color: textColor
      });
      
      let issueOffsetY = 90;
      issues.forEach((issue: string) => {
        page.drawText(`• ${issue}`, {
          x: margin + 20,
          y: newY - issueOffsetY,
          size: 12,
          font: fonts.regular,
          color: textColor
        });
        
        issueOffsetY += 20;
      });
      
      return newY - issueOffsetY - 10; // Return the new Y position
    }
    
    return newY - 70; // Return the new Y position if no issues
  }
  
  return newY - 40; // Return the new Y position if no condition assessment
}

/**
 * Add the comparables section to the PDF
 */
export async function addComparablesSection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor } = params;
  const startY = y;
  
  const sectionTitle = 'COMPARABLE VEHICLES';
  const newY = drawStyledHeading(page, sectionTitle, margin, startY, 18, fonts.bold, primaryColor);
  
  // In a real implementation, we would draw comparable vehicles here
  // This is just a placeholder that could be expanded with actual data
  
  page.drawText('Based on similar vehicles in your area', {
    x: margin,
    y: newY - 30,
    size: 12,
    font: fonts.italic,
    color: textColor
  });
  
  return newY - 50; // Return the new Y position
}

/**
 * Add the footer section to the PDF
 */
export async function addFooterSection(params: any): Promise<number> {
  const { page, y, width, margin, data, fonts, textColor, primaryColor, height } = params;
  
  // Draw separator line
  page.drawLine({
    start: { x: margin, y: 50 },
    end: { x: width - margin, y: 50 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  // Draw copyright and disclaimer
  const disclaimer = 'This report is based on current market data and is provided for informational purposes only. Values are estimates and not a guarantee of actual market value.';
  
  // Draw disclaimer with text wrapping
  const maxWidth = width - 2 * margin;
  const fontSize = 8;
  const lineHeight = 10;
  
  // Split the disclaimer into words and build wrapped lines
  const words = disclaimer.split(' ');
  let lines = [];
  let currentLine = '';
  
  words.forEach(word => {
    const testLine = currentLine + (currentLine ? ' ' : '') + word;
    const testLineWidth = fonts.regular.widthOfTextAtSize(testLine, fontSize);
    
    if (testLineWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Draw each line of the wrapped text
  let lineOffsetY = 0;
  lines.forEach(line => {
    page.drawText(line, {
      x: margin,
      y: 35 - lineOffsetY,
      size: fontSize,
      font: fonts.regular,
      color: textColor
    });
    
    lineOffsetY += lineHeight;
  });
  
  // Draw page number
  const pageText = 'Page 1 of 1';
  page.drawText(pageText, {
    x: width - margin - fonts.regular.widthOfTextAtSize(pageText, 10),
    y: 20,
    size: 10,
    font: fonts.regular,
    color: textColor
  });
  
  // Draw company info if branding is enabled
  if (params.options.includeBranding) {
    const companyName = data.companyName || 'Car Detective';
    const website = data.website || 'www.cardetective.com';
    
    page.drawText(companyName, {
      x: margin,
      y: 20,
      size: 10,
      font: fonts.bold,
      color: primaryColor
    });
    
    page.drawText(website, {
      x: margin,
      y: 10,
      size: 8,
      font: fonts.regular,
      color: textColor
    });
  }
  
  return 0; // Footer is at the bottom, so return 0
}

// Additional helper functions for the PDF generator

/**
 * Add a watermark across all pages of the document
 */
function addDocumentWatermark(
  pdfDoc: any,
  text: string,
  font: any
): void {
  // Get all pages
  const pages = pdfDoc.getPages();
  
  // Add watermark to each page
  for (const page of pages) {
    const { width, height } = page.getSize();
    
    // Add large diagonal watermark
    const fontSize = 60;
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = fontSize;
    
    const x = (width - textWidth) / 2;
    const y = (height - textHeight) / 2;
    
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(0.85, 0.85, 0.85),
      opacity: 0.3,
      rotate: { type: 'degrees', angle: -45 }
    });
    
    // Add small watermarks in each corner
    const smallFontSize = 12;
    const padding = 20;
    
    // Top-left
    page.drawText(text, {
      x: padding,
      y: height - padding,
      size: smallFontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.5,
      rotate: { type: 'degrees', angle: 0 }
    });
    
    // Top-right
    page.drawText(text, {
      x: width - font.widthOfTextAtSize(text, smallFontSize) - padding,
      y: height - padding,
      size: smallFontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.5,
      rotate: { type: 'degrees', angle: 0 }
    });
    
    // Bottom-left
    page.drawText(text, {
      x: padding,
      y: padding,
      size: smallFontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.5,
      rotate: { type: 'degrees', angle: 0 }
    });
    
    // Bottom-right
    page.drawText(text, {
      x: width - font.widthOfTextAtSize(text, smallFontSize) - padding,
      y: padding,
      size: smallFontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity: 0.5,
      rotate: { type: 'degrees', angle: 0 }
    });
  }
}
