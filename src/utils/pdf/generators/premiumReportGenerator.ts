import { PDFDocument, rgb, StandardFonts, PageSizes, degrees } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams } from '../types';

// Import section components
import { addHeaderSection } from '../sections/header';
import { addSummarySection } from '../sections/summary';
import { addBreakdownSection } from '../sections/breakdown';
import { addFooterSection } from '../sections/footer';
import { addExplanationSection } from '../sections/explanation';
import { addComparablesSection } from '../sections/comparables';

// Create a placeholder for conditionAssessment that was missing
async function addConditionAssessmentSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, options, textColor, primaryColor, fonts } = params;
  const y = params.y ?? startY;
  
  // Only include condition assessment for premium reports with photo assessment
  if (!options.isPremium || !options.includePhotoAssessment || !data.aiCondition) {
    return y; // Skip this section
  }
  
  // This would be where we'd add the condition assessment to the PDF
  // Implement real functionality when needed
  
  return y - 100; // Return a new Y position after adding content
}

/**
 * Generate a premium PDF report
 * @param data Report data
 * @param options Report options
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePremiumReport(
  data: ReportData,
  options: Partial<ReportOptions> = {}
): Promise<Uint8Array> {
  // Default options
  const defaultOptions: ReportOptions = {
    includeBranding: true,
    includeExplanation: true,
    includePhotoAssessment: true,
    watermark: false,
    fontSize: 10,
    pdfQuality: 'standard',
    isPremium: !!data.isPremium || !!data.premium
  };
  
  // Merge options
  const mergedOptions: ReportOptions = { ...defaultOptions, ...options };
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage(PageSizes.LETTER);
  const { width, height } = page.getSize();
  const margin = 50;
  
  // Font setup
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.0, 0.3, 0.7);
  
  // Set up common parameters for all sections
  const sectionParams: SectionParams = {
    page,
    startY: height - margin,
    width,
    margin,
    data,
    options: mergedOptions,
    textColor,
    primaryColor,
    height,
    fonts: {
      regular: helveticaFont,
      bold: helveticaBold
    }
  };
  
  // Add watermark if requested
  if (mergedOptions.watermark) {
    const watermarkText = typeof mergedOptions.watermark === 'string' 
      ? mergedOptions.watermark 
      : 'SAMPLE REPORT';
    
    page.drawText(watermarkText, {
      x: width / 2 - 150,
      y: height / 2,
      size: 60,
      font: helveticaFont,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: {
        type: 'degrees',
        angle: -45
      }
    });
  }
  
  // Add header
  let currentY = await addHeaderSection(sectionParams);
  
  // Update the Y position for the next section
  sectionParams.y = currentY;
  
  // Add summary section
  currentY = await addSummarySection(sectionParams);
  sectionParams.y = currentY;
  
  // Add breakdown section
  currentY = await addBreakdownSection(sectionParams);
  sectionParams.y = currentY;
  
  // Add comparables section (premium only)
  if (mergedOptions.isPremium) {
    currentY = await addComparablesSection(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Add explanation section
  if (mergedOptions.includeExplanation) {
    currentY = await addExplanationSection(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Add condition assessment section (premium only with photo assessment)
  if (mergedOptions.isPremium && mergedOptions.includePhotoAssessment && data.aiCondition) {
    currentY = await addConditionAssessmentSection(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Add footer to all pages
  currentY = await addFooterSection(sectionParams);
  
  // Serialize the PDFDocument to bytes
  return await pdfDoc.save();
}

/**
 * Helper function to add a title to a section
 */
function addSectionTitle(
  page: any,
  title: string,
  x: number,
  y: number,
  font: any,
  color: any,
  size: number = 14
) {
  page.drawText(title, {
    x,
    y,
    size,
    font,
    color
  });
  
  // Draw a line under the title
  page.drawLine({
    start: { x, y: y - 10 },
    end: { x: x + 250, y: y - 10 },
    thickness: 1,
    color
  });
  
  return y - 30; // Return the new Y position after the title
}

/**
 * Helper function to add a field with label and value
 */
function addField(
  page: any,
  label: string,
  value: string,
  x: number,
  y: number,
  fonts: { regular: any, bold: any },
  textColor: any
) {
  // Draw the label
  page.drawText(`${label}:`, {
    x,
    y,
    size: 10,
    font: fonts.bold,
    color: textColor
  });
  
  // Draw the value
  page.drawText(value, {
    x: x + 100,
    y,
    size: 10,
    font: fonts.regular,
    color: textColor
  });
  
  return y - 20; // Return the new Y position
}

/**
 * Helper function to format currency
 */
function formatCurrency(value: number): string {
  return `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
}

/**
 * Helper function to add the vehicle information section
 */
function addVehicleInfoSection(
  page: any,
  data: ReportData,
  x: number,
  y: number,
  fonts: { regular: any, bold: any },
  textColor: any
): number {
  // Add section title
  let currentY = addSectionTitle(page, 'Vehicle Information', x, y, fonts.bold, textColor);
  
  // Add vehicle info fields
  currentY = addField(page, 'Make', data.make || 'N/A', x, currentY, fonts, textColor);
  currentY = addField(page, 'Model', data.model || 'N/A', x, currentY, fonts, textColor);
  currentY = addField(page, 'Year', data.year?.toString() || 'N/A', x, currentY, fonts, textColor);
  currentY = addField(page, 'Mileage', (data.mileage?.toLocaleString() || 'N/A') + ' miles', x, currentY, fonts, textColor);
  currentY = addField(page, 'Condition', data.condition || 'N/A', x, currentY, fonts, textColor);
  
  if (data.vin) {
    currentY = addField(page, 'VIN', data.vin, x, currentY, fonts, textColor);
  }
  
  if (data.trim) {
    currentY = addField(page, 'Trim', data.trim, x, currentY, fonts, textColor);
  }
  
  if (data.transmission) {
    currentY = addField(page, 'Transmission', data.transmission, x, currentY, fonts, textColor);
  }
  
  if (data.bodyStyle) {
    currentY = addField(page, 'Body Style', data.bodyStyle, x, currentY, fonts, textColor);
  }
  
  return currentY - 10; // Return the new Y position with some extra padding
}

/**
 * Helper function to add the valuation section
 */
function addValuationSection(
  page: any,
  data: ReportData,
  x: number,
  y: number,
  fonts: { regular: any, bold: any },
  textColor: any,
  primaryColor: any
): number {
  // Add section title
  let currentY = addSectionTitle(page, 'Valuation Summary', x, y, fonts.bold, textColor);
  
  // Add estimated value with emphasis
  page.drawText('Estimated Value:', {
    x,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: primaryColor
  });
  
  const valueText = formatCurrency(data.estimatedValue || 0);
  
  page.drawText(valueText, {
    x: x + 120,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor
  });
  
  currentY -= 25;
  
  // Add confidence score if available
  if (data.confidenceScore !== undefined) {
    currentY = addField(
      page,
      'Confidence Score',
      `${data.confidenceScore}%`,
      x,
      currentY,
      fonts,
      textColor
    );
  }
  
  // Add price range if available
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    currentY = addField(
      page,
      'Value Range',
      `${formatCurrency(data.priceRange[0])} - ${formatCurrency(data.priceRange[1])}`,
      x,
      currentY,
      fonts,
      textColor
    );
  }
  
  // Add the valuation date
  const generatedDate = data.generatedAt 
    ? new Date(data.generatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
  
  currentY = addField(page, 'Valuation Date', generatedDate, x, currentY, fonts, textColor);
  
  return currentY - 10; // Return the new Y position with some extra padding
}

/**
 * Helper function to add the adjustments section
 */
function addAdjustmentsSection(
  page: any,
  data: ReportData,
  x: number,
  y: number,
  fonts: { regular: any, bold: any },
  textColor: any
): number {
  // Only add this section if there are adjustments
  if (!data.adjustments || data.adjustments.length === 0) {
    return y; // No adjustments, return the same Y position
  }
  
  // Add section title
  let currentY = addSectionTitle(page, 'Value Adjustments', x, y, fonts.bold, textColor);
  
  // Add a header row
  page.drawText('Factor', {
    x,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor
  });
  
  page.drawText('Impact', {
    x: x + 150,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor
  });
  
  page.drawText('Description', {
    x: x + 250,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor
  });
  
  currentY -= 20;
  
  // Calculate the total adjustment
  const totalAdjustment = data.adjustments.reduce((total: number, adj: any) => total + (adj.impact || 0), 0);
  
  // Add each adjustment
  data.adjustments.forEach((adjustment: any) => {
    // Draw the factor
    page.drawText(adjustment.factor || '', {
      x,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor
    });
    
    // Draw the impact
    const impactText = adjustment.impact > 0 
      ? `+${formatCurrency(adjustment.impact)}` 
      : formatCurrency(adjustment.impact);
    
    const impactColor = adjustment.impact > 0 
      ? rgb(0, 0.5, 0) // Green for positive
      : adjustment.impact < 0 
        ? rgb(0.8, 0, 0) // Red for negative
        : textColor; // Default for zero
    
    page.drawText(impactText, {
      x: x + 150,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: impactColor
    });
    
    // Draw the description (with word wrapping if needed)
    const description = adjustment.description || '';
    const words = description.split(' ');
    let line = '';
    let descY = currentY;
    
    words.forEach((word: string) => {
      const testLine = line + word + ' ';
      if (testLine.length * 5 > 200) { // Rough estimate of line width
        page.drawText(line, {
          x: x + 250,
          y: descY,
          size: 10,
          font: fonts.regular,
          color: textColor
        });
        line = word + ' ';
        descY -= 15;
      } else {
        line = testLine;
      }
    });
    
    if (line) {
      page.drawText(line, {
        x: x + 250,
        y: descY,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
    }
    
    // Update the current Y position, taking into account possible word wrapping
    currentY = Math.min(currentY - 20, descY - 20);
  });
  
  // Add a total row
  page.drawLine({
    start: { x: x + 150, y: currentY + 10 },
    end: { x: x + 220, y: currentY + 10 },
    thickness: 1,
    color: textColor
  });
  
  currentY -= 5;
  
  page.drawText('Total Adjustments:', {
    x,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor
  });
  
  const totalText = totalAdjustment > 0 
    ? `+${formatCurrency(totalAdjustment)}` 
    : formatCurrency(totalAdjustment);
  
  const totalColor = totalAdjustment > 0 
    ? rgb(0, 0.5, 0) // Green for positive
    : totalAdjustment < 0 
      ? rgb(0.8, 0, 0) // Red for negative
      : textColor; // Default for zero
  
  page.drawText(totalText, {
    x: x + 150,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: totalColor
  });
  
  return currentY - 20; // Return the new Y position
}

/**
 * Helper function to add the condition assessment section
 */
function addConditionSection(
  page: any,
  data: ReportData,
  x: number,
  y: number,
  fonts: { regular: any, bold: any },
  textColor: any,
  width: number,
  height: number | undefined
): number {
  // Only add this section if there is condition data
  if (!data.aiCondition) {
    return y; // No condition data, return the same Y position
  }
  
  // Check if we need to add a new page
  if (y < 200 && height !== undefined) {
    // Add a new page
    page = page.document.addPage(PageSizes.LETTER);
    y = height - 50; // Reset Y position for the new page
  }
  
  // Add section title
  let currentY = addSectionTitle(page, 'Condition Assessment', x, y, fonts.bold, textColor);
  
  // Add the condition score
  page.drawText('Overall Condition:', {
    x,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor
  });
  
  page.drawText(data.aiCondition.condition || 'Unknown', {
    x: x + 130,
    y: currentY,
    size: 12,
    font: fonts.regular,
    color: textColor
  });
  
  currentY -= 25;
  
  // Add confidence score if available
  if (data.aiCondition.confidenceScore !== undefined) {
    currentY = addField(
      page,
      'AI Confidence',
      `${data.aiCondition.confidenceScore}%`,
      x,
      currentY,
      fonts,
      textColor
    );
  }
  
  // Add condition summary if available
  if (data.aiCondition.summary) {
    page.drawText('Condition Summary:', {
      x,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor
    });
    
    currentY -= 20;
    
    // Add the summary text with word wrapping
    const maxWidth = width - (2 * x);
    const words = data.aiCondition.summary.split(' ');
    let line = '';
    
    words.forEach(word => {
      const testLine = line + word + ' ';
      if (testLine.length * 5 > maxWidth) { // Rough estimate of line width
        page.drawText(line, {
          x,
          y: currentY,
          size: 10,
          font: fonts.regular,
          color: textColor
        });
        line = word + ' ';
        currentY -= 15;
      } else {
        line = testLine;
      }
    });
    
    if (line) {
      page.drawText(line, {
        x,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
      currentY -= 20;
    }
  }
  
  // Add issues detected if available
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor
    });
    
    currentY -= 20;
    
    // Add each issue as a bullet point
    data.aiCondition.issuesDetected.forEach((issue: string) => {
      page.drawText('•', {
        x,
        y: currentY,
        size: 10,
        font: fonts.bold,
        color: textColor
      });
      
      page.drawText(issue, {
        x: x + 15,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
      
      currentY -= 15;
    });
    
    currentY -= 10; // Add some extra padding
  }
  
  return currentY; // Return the new Y position
}

/**
 * Helper function to add a legal disclaimer
 */
function addDisclaimerSection(
  page: any,
  x: number,
  y: number,
  font: any,
  textColor: any,
  width: number,
  height: number | undefined
): number {
  // Check if we need to add a new page
  if (y < 150 && height !== undefined) {
    // Add a new page
    page = page.document.addPage(PageSizes.LETTER);
    y = height - 50; // Reset Y position for the new page
  }
  
  // Add section title
  let currentY = addSectionTitle(page, 'Disclaimer', x, y, font, textColor);
  
  const disclaimer = 'This valuation report is an estimate based on available data and market conditions at the time of generation. ' +
    'Actual selling or purchase prices may vary. This report is not an offer to purchase or sell any vehicle. ' +
    'CarDetective does not guarantee the accuracy of this valuation and is not responsible for any decisions made based on this information.';
  
  // Add the disclaimer text with word wrapping
  const maxWidth = width - (2 * x);
  const words = disclaimer.split(' ');
  let line = '';
  
  words.forEach(word => {
    const testLine = line + word + ' ';
    if (testLine.length * 5 > maxWidth) { // Rough estimate of line width
      page.drawText(line, {
        x,
        y: currentY,
        size: 8,
        font,
        color: rgb(0.4, 0.4, 0.4)
      });
      line = word + ' ';
      currentY -= 12;
    } else {
      line = testLine;
    }
  });
  
  if (line) {
    page.drawText(line, {
      x,
      y: currentY,
      size: 8,
      font,
      color: rgb(0.4, 0.4, 0.4)
    });
    currentY -= 12;
  }
  
  return currentY; // Return the new Y position
}
