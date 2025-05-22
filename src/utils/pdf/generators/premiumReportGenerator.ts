// Import PDF generation and utility libraries
import { PDFDocument, rgb, StandardFonts, PageSizes, degrees } from 'pdf-lib';
import { Font } from '@pdf-lib/standard-fonts';
import { ReportData, ReportOptions, SectionParams } from '../types';

// Import individual section generators with renamed imports to avoid conflicts
import { addHeaderSection as importedHeaderSection } from '../sections/header';
import { addSummarySection as importedSummarySection } from '../sections/summary';
import { addBreakdownSection as importedBreakdownSection } from '../sections/breakdown';
import { addFooterSection as importedFooterSection } from '../sections/footer';
import { addExplanationSection as importedExplanationSection } from '../sections/explanation';
import { addConditionAssessmentSection as importedConditionAssessmentSection } from '../sections/conditionAssessment';
import { addComparablesSection as importedComparablesSection } from '../sections/comparables';

// Local implementation of section functions to keep backward compatibility
async function addHeaderSection(params: SectionParams): Promise<number> {
  return await importedHeaderSection(params);
}

async function addSummarySection(params: SectionParams): Promise<number> {
  return await importedSummarySection(params);
}

async function addBreakdownSection(params: SectionParams): Promise<number> {
  return await importedBreakdownSection(params);
}

async function addFooterSection(params: SectionParams): Promise<number> {
  return await importedFooterSection(params);
}

async function addExplanationSection(params: SectionParams): Promise<number> {
  return await importedExplanationSection(params);
}

async function addConditionAssessmentSection(params: SectionParams): Promise<number> {
  return await importedConditionAssessmentSection(params);
}

async function addComparablesSection(params: SectionParams): Promise<number> {
  return await importedComparablesSection(params);
}

/**
 * Generate a premium PDF report with all sections
 * @param data Report data for the valuation
 * @param options Additional PDF generation options
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePremiumReport(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Set the page size to letter
  const pageSize = PageSizes.Letter;
  
  // Add the main page
  const page = pdfDoc.addPage(pageSize);
  
  // Get the standard fonts
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBoldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set the font size
  const fontSize = 12;
  
  // Get the page dimensions
  const { width, height } = page.getSize();
  
  // Set the margins
  const margin = 50;
  
  // Calculate the content area
  const contentWidth = width - (margin * 2);
  const contentHeight = height - (margin * 2);
  
  // Base Y position (starting from top of page)
  let y = height - margin;
  
  // Basic section params that will be passed to each section function
  const params: SectionParams = {
    page,
    pdfDoc,
    data,
    options,
    fonts: {
      regular: helveticaFont,
      bold: helveticaBoldFont
    },
    fontSize,
    startY: y,
    y,
    margin,
    width: contentWidth,
    height: contentHeight,
    pageWidth: width,
    pageHeight: height
  };
  
  // Draw a colored header bar
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: rgb(0.1, 0.1, 0.6)
  });
  
  // Add the logo (if available)
  if (options.logoUrl) {
    try {
      const logoImage = await fetch(options.logoUrl).then(res => res.arrayBuffer());
      const logoImageEmbed = await pdfDoc.embedPng(logoImage);
      const logoDims = logoImageEmbed.scale(0.5);
      
      page.drawImage(logoImageEmbed, {
        x: margin,
        y: height - margin - 40,
        width: logoDims.width,
        height: logoDims.height,
        rotate: { type: 'degrees', angle: 0 }
      });
    } catch (error) {
      console.error('Error adding logo to PDF:', error);
    }
  }
  
  // Add the title
  page.drawText('Vehicle Valuation Report', {
    x: margin + 100,
    y: height - margin - 30,
    size: 24,
    font: helveticaBoldFont,
    color: rgb(1, 1, 1)
  });
  
  // Add the date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  page.drawText(`Generated on ${dateStr}`, {
    x: margin + 100,
    y: height - margin - 50,
    size: 12,
    font: helveticaFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  // Add vehicle information header
  y = height - margin - 120;
  params.y = y;
  
  // Add the header section (vehicle info)
  y = await addHeaderSection(params);
  params.y = y;
  
  // Add some space
  y -= 20;
  params.y = y;
  
  // Add the summary section (price, confidence, etc)
  y = await addSummarySection(params);
  params.y = y;
  
  // Add some space
  y -= 20;
  params.y = y;
  
  // Add the breakdown section (price adjustments)
  y = await addBreakdownSection(params);
  params.y = y;
  
  // Add some space
  y -= 20;
  params.y = y;
  
  // If there's aiCondition data, add a condition assessment section
  if (data.aiCondition) {
    // Add the condition assessment section
    y = await addConditionAssessmentSection(params);
    params.y = y;
    
    // Add some space
    y -= 20;
    params.y = y;
  }
  
  // If premium, add the explanation section
  if (data.premium) {
    // Add the explanation section
    y = await addExplanationSection(params);
    params.y = y;
    
    // Add some space
    y -= 20;
    params.y = y;
    
    // Add the comparables section
    y = await addComparablesSection(params);
    params.y = y;
    
    // Add some space
    y -= 20;
    params.y = y;
  }
  
  // Add the footer
  y = await addFooterSection(params);
  
  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}

// Local implementations of the section functions
// These will be used if the imported functions fail

/**
 * Draw condition assessment section
 */
async function drawConditionAssessment(params: SectionParams): Promise<number> {
  const { page, data, fonts, margin, y, width } = params;
  const contentWidth = width - (margin * 2);
  let currentY = y;
  
  // Draw section title
  page.drawText('Condition Assessment', {
    x: margin,
    y: currentY,
    size: 18,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.6)
  });
  
  currentY -= 30;
  
  // Draw the condition score
  if (data.aiCondition) {
    // Draw condition text
    page.drawText(`Overall Condition: ${data.aiCondition.condition}`, {
      x: margin,
      y: currentY,
      size: 14,
      font: fonts.bold,
      color: rgb(0, 0, 0)
    });
    
    currentY -= 20;
    
    // Draw confidence score
    page.drawText(`Confidence: ${data.aiCondition.confidenceScore}%`, {
      x: margin,
      y: currentY,
      size: 12,
      font: fonts.regular,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    currentY -= 30;
    
    // Draw issues detected
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: currentY,
        size: 14,
        font: fonts.bold,
        color: rgb(0, 0, 0)
      });
      
      currentY -= 20;
      
      // List all detected issues
      data.aiCondition.issuesDetected.forEach((issue: string) => {
        page.drawText(`• ${issue}`, {
          x: margin + 20,
          y: currentY,
          size: 12,
          font: fonts.regular,
          color: rgb(0, 0, 0)
        });
        
        currentY -= 18;
      });
    }
    
    currentY -= 10;
    
    // Draw condition summary
    if (data.aiCondition.summary) {
      // Break the summary text into lines
      const summaryLines = breakTextIntoLines(
        data.aiCondition.summary,
        fonts.regular,
        12,
        contentWidth - 40
      );
      
      page.drawText('Summary:', {
        x: margin,
        y: currentY,
        size: 14,
        font: fonts.bold,
        color: rgb(0, 0, 0)
      });
      
      currentY -= 20;
      
      // Draw each line of the summary
      summaryLines.forEach((line) => {
        page.drawText(line, {
          x: margin + 20,
          y: currentY,
          size: 12,
          font: fonts.regular,
          color: rgb(0, 0, 0)
        });
        
        currentY -= 18;
      });
    }
  } else {
    // No condition data available
    page.drawText('No condition assessment data available.', {
      x: margin,
      y: currentY,
      size: 12,
      font: fonts.regular,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Draw breakdown section with price adjustments
 */
async function drawBreakdown(params: SectionParams): Promise<number> {
  const { page, data, fonts, margin, y, width } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Price Breakdown', {
    x: margin,
    y: currentY,
    size: 18,
    font: fonts.bold,
    color: rgb(0.1, 0.1, 0.6)
  });
  
  currentY -= 30;
  
  // Calculate the base price (either from data or from adjustments)
  const basePrice = data.baseValue || (data.estimatedValue - data.adjustments.reduce((total: number, adj: { impact: number }) => total + adj.impact, 0));
  
  // Draw the base price
  page.drawText(`Base Value: $${formatNumber(basePrice)}`, {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: rgb(0, 0, 0)
  });
  
  currentY -= 30;
  
  // Draw adjustments header
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Adjustments:', {
      x: margin,
      y: currentY,
      size: 14,
      font: fonts.bold,
      color: rgb(0, 0, 0)
    });
    
    currentY -= 20;
    
    // Draw each adjustment
    data.adjustments.forEach((adjustment: { factor: string; impact: number; description?: string }) => {
      const impactText = formatAdjustment(adjustment.impact);
      const factorText = `${adjustment.factor}:`;
      
      // Draw the factor name
      page.drawText(factorText, {
        x: margin + 20,
        y: currentY,
        size: 12,
        font: fonts.regular,
        color: rgb(0, 0, 0)
      });
      
      // Draw the impact amount
      page.drawText(impactText, {
        x: margin + 200,
        y: currentY,
        size: 12,
        font: fonts.bold,
        color: adjustment.impact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0)
      });
      
      // Draw the description if available
      if (adjustment.description) {
        currentY -= 16;
        page.drawText(`(${adjustment.description})`, {
          x: margin + 40,
          y: currentY,
          size: 10,
          font: fonts.regular,
          color: rgb(0.5, 0.5, 0.5)
        });
      }
      
      currentY -= 24;
    });
  }
  
  // Draw the final value
  page.drawText(`Final Value: $${formatNumber(data.estimatedValue)}`, {
    x: margin,
    y: currentY,
    size: 16,
    font: fonts.bold,
    color: rgb(0, 0, 0)
  });
  
  return currentY - 20;
}

/**
 * Break text into lines that fit within a specific width
 */
function breakTextIntoLines(text: string, font: Font, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  words.forEach((word: string) => {
    const lineWidth = font.widthOfTextAtSize(currentLine + ' ' + word, fontSize);
    
    if (lineWidth < maxWidth) {
      currentLine += (currentLine ? ' ' : '') + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  });
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Format a number with commas
 */
function formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Format an adjustment value as a string
 */
function formatAdjustment(value: number): string {
  if (value >= 0) {
    return `+$${formatNumber(value)}`;
  } else {
    return `-$${formatNumber(Math.abs(value))}`;
  }
}

/**
 * Add a watermark to the page
 */
async function addWatermark(params: SectionParams, text: string): Promise<void> {
  const { page, pdfDoc, fonts, pageWidth, pageHeight } = params;
  const font = fonts.bold;
  
  // Create a separate page for the watermark
  const watermarkPage = pdfDoc.addPage([pageWidth, pageHeight ?? 1000]);
  
  // Draw the watermark text
  watermarkPage.drawText(text, {
    x: pageWidth / 2 - 150,
    y: (pageHeight ?? 1000) / 2,
    size: 60,
    font,
    color: rgb(0.8, 0.8, 0.8),
    opacity: 0.3,
    rotate: { type: 'degrees', angle: 45 }
  });
  
  // Extract the watermark to a form XObject
  const [watermarkForm] = await pdfDoc.copyPages(pdfDoc, [pdfDoc.getPageCount() - 1]);
  
  // Remove the watermark page
  pdfDoc.removePage(pdfDoc.getPageCount() - 1);
  
  // Add the watermark as a form XObject to the original page
  page.drawPage(watermarkForm, {
    x: 0,
    y: 0,
    width: pageWidth,
    height: pageHeight ?? 1000,
    rotate: { type: 'degrees', angle: 0 }
  });
}

/**
 * Add a watermark to the document
 */
async function addDocumentWatermark(params: SectionParams, text: string): Promise<void> {
  const { pdfDoc, pageWidth, pageHeight } = params;
  
  // Add watermark to each page
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    
    // Create a separate page for the watermark
    const watermarkPage = pdfDoc.addPage([pageWidth, pageHeight ?? 1000]);
    
    // Draw the watermark text
    watermarkPage.drawText(text, {
      x: pageWidth / 2 - 150,
      y: (pageHeight ?? 1000) / 2,
      size: 60,
      font: params.fonts.bold,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: { type: 'degrees', angle: 45 }
    });
    
    // Extract the watermark to a form XObject
    const [watermarkForm] = await pdfDoc.copyPages(pdfDoc, [pdfDoc.getPageCount() - 1]);
    
    // Remove the watermark page
    pdfDoc.removePage(pdfDoc.getPageCount() - 1);
    
    // Add the watermark as a form XObject to the original page
    page.drawPage(watermarkForm, {
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight ?? 1000,
      rotate: { type: 'degrees', angle: 0 }
    });
  }
}
