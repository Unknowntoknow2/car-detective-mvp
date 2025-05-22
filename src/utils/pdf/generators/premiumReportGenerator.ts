
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams } from '../types';

// Rename imported functions to avoid conflicts with local declarations
import { addHeaderSection as importedHeaderSection } from '../sections/header';
import { addSummarySection as importedSummarySection } from '../sections/summary';
import { addBreakdownSection as importedBreakdownSection } from '../sections/breakdown';
import { addFooterSection as importedFooterSection } from '../sections/footer';
import { addExplanationSection as importedExplanationSection } from '../sections/explanation';
import { addConditionAssessmentSection as importedConditionAssessmentSection } from '../sections/conditionAssessment';
import { addComparablesSection as importedComparablesSection } from '../sections/comparables';

// These are defined types to avoid the 'RotationTypes' error
type RotationTypes = 'degrees' | 'radians';
interface Rotation {
  type: RotationTypes;
  angle: number;
}

/**
 * Generate a premium PDF report with all sections
 * @param data Report data to include
 * @param options PDF generation options
 * @returns PDF as Uint8Array
 */
export async function generatePremiumReport(data: ReportData, options: Partial<ReportOptions> = {}): Promise<Uint8Array> {
  // Default options
  const defaultOptions: ReportOptions = {
    includeBranding: true,
    includeExplanation: true,
    includePhotoAssessment: true,
    watermark: data.isPremium ? false : 'SAMPLE',
    fontSize: 12,
    pdfQuality: 'standard',
    isPremium: !!data.isPremium
  };
  
  // Merge provided options with defaults
  const mergedOptions: ReportOptions = {
    ...defaultOptions,
    ...options
  };
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Load standard fonts
  const fonts = {
    regular: await pdfDoc.embedFont(StandardFonts.Helvetica),
    bold: await pdfDoc.embedFont(StandardFonts.HelveticaBold),
    italic: await pdfDoc.embedFont(StandardFonts.HelveticaOblique),
  };
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0, 0.4, 0.8);
  
  // Add the first page
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const { width, height } = page.getSize();
  const margin = 50;
  
  // Common parameters for all sections
  const commonParams: SectionParams = {
    page,
    startY: height - margin,
    width,
    height,
    margin,
    data,
    options: mergedOptions,
    textColor,
    primaryColor,
    fonts
  };
  
  // Add all sections
  let yPosition = height - margin;
  
  // Add header section
  yPosition = await addHeaderSection({ ...commonParams, y: yPosition });
  
  // Add summary section (valuation overview)
  yPosition = await addSummarySection({ ...commonParams, y: yPosition });
  
  // Add price breakdown section
  yPosition = await addBreakdownSection({ ...commonParams, y: yPosition });
  
  // Add explanation section if enabled
  if (mergedOptions.includeExplanation && data.explanation) {
    yPosition = await addExplanationSection({ ...commonParams, y: yPosition });
  }
  
  // Add condition assessment section if enabled and data exists
  if (mergedOptions.includePhotoAssessment && data.aiCondition) {
    yPosition = await addConditionAssessmentSection({ ...commonParams, y: yPosition });
  }
  
  // Add comparables section if data exists
  if (data.priceRange) {
    yPosition = await addComparablesSection({ ...commonParams, y: yPosition });
  }
  
  // Add footer section
  yPosition = await addFooterSection({ ...commonParams, y: yPosition });
  
  // Add watermark if specified
  if (mergedOptions.watermark) {
    addWatermark(pdfDoc, mergedOptions.watermark);
  }
  
  // Serialize the PDF to bytes
  return await pdfDoc.save();
}

/**
 * Add a watermark to all pages of the PDF
 * @param pdfDoc PDF document
 * @param watermarkText Text to use as watermark
 */
function addWatermark(pdfDoc: PDFDocument, watermarkText: boolean | string): void {
  if (watermarkText === true) {
    watermarkText = 'SAMPLE';
  } else if (watermarkText === false) {
    return;
  }
  
  // Add watermark to each page
  const pages = pdfDoc.getPages();
  for (const page of pages) {
    const { width, height } = page.getSize();
    const font = pdfDoc.getForm().getFields()[0]?.acroField.getFont() || undefined;
    
    // Draw diagonal watermark text
    page.drawText(watermarkText as string, {
      x: width / 2 - 150,
      y: height / 2,
      size: 60,
      color: rgb(0.8, 0.8, 0.8),
      opacity: 0.3,
      rotate: { type: 'degrees', angle: -45 } as Rotation,
    });
  }
}

/**
 * Add the header section to the PDF
 */
async function addHeaderSection(params: SectionParams): Promise<number> {
  const { page, y, margin, data, fonts, textColor, primaryColor } = params;
  let currentY = y || params.startY;
  
  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: currentY,
    size: 18,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Draw vehicle info
  const vehicleInfo = `${data.year} ${data.make} ${data.model}${data.trim ? ' ' + data.trim : ''}`;
  page.drawText(vehicleInfo, {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.regular,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Draw generated date
  if (data.generatedAt) {
    const date = new Date(data.generatedAt);
    const formattedDate = date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    page.drawText(`Generated: ${formattedDate}`, {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 30;
  }
  
  // Draw additional vehicle details
  const details = [
    `Mileage: ${data.mileage.toLocaleString()} miles`,
    `Condition: ${data.condition}`,
    data.vin ? `VIN: ${data.vin}` : '',
    data.zipCode ? `Location: ${data.zipCode}` : '',
  ].filter(Boolean);
  
  for (const detail of details) {
    page.drawText(detail, {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 15;
  }
  
  return currentY - 10; // Add some padding
}

/**
 * Add the summary section to the PDF
 */
async function addSummarySection(params: SectionParams): Promise<number> {
  const { page, y, margin, width, data, fonts, textColor, primaryColor } = params;
  let currentY = y || params.startY;
  
  // Section title
  currentY -= 10;
  page.drawText('Valuation Summary', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 20;
  
  // Draw estimated value
  const formattedValue = `$${data.estimatedValue.toLocaleString()}`;
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  // Right-align the value
  const valueWidth = fonts.bold.widthOfTextAtSize(formattedValue, 14);
  page.drawText(formattedValue, {
    x: width - margin - valueWidth,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Draw price range if available
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length >= 2) {
    const minPrice = data.priceRange[0];
    const maxPrice = data.priceRange[1];
    
    page.drawText(`Price Range: $${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`, {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY - 10; // Add some padding
}

/**
 * Add the breakdown section to the PDF
 */
async function addBreakdownSection(params: SectionParams): Promise<number> {
  const { page, y, margin, width, data, fonts, textColor, primaryColor } = params;
  let currentY = y || params.startY;
  
  // Section title
  currentY -= 10;
  page.drawText('Price Breakdown', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 30;
  
  // Base price
  const basePrice = data.basePrice || data.baseValue || data.estimatedValue * 0.9;
  const formattedBasePrice = `$${basePrice.toLocaleString()}`;
  
  page.drawText('Base Value:', {
    x: margin,
    y: currentY,
    size: 10,
    font: fonts.regular,
    color: textColor,
  });
  
  // Right-align the value
  const basePriceWidth = fonts.regular.widthOfTextAtSize(formattedBasePrice, 10);
  page.drawText(formattedBasePrice, {
    x: width - margin - basePriceWidth,
    y: currentY,
    size: 10,
    font: fonts.regular,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Adjustments:', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    currentY -= 15;
    
    // Draw each adjustment
    for (const adjustment of data.adjustments) {
      const impact = adjustment.impact;
      const sign = impact >= 0 ? '+' : '';
      const formattedImpact = `${sign}$${Math.abs(impact).toLocaleString()}`;
      
      page.drawText(`${adjustment.factor}:`, {
        x: margin + 15,
        y: currentY,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      // Right-align the value
      const impactWidth = fonts.regular.widthOfTextAtSize(formattedImpact, 9);
      page.drawText(formattedImpact, {
        x: width - margin - impactWidth,
        y: currentY,
        size: 9,
        font: fonts.regular,
        color: impact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
      });
      
      currentY -= 15;
      
      // Add description if available
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 30,
          y: currentY,
          size: 8,
          font: fonts.italic,
          color: rgb(0.5, 0.5, 0.5),
        });
        
        currentY -= 12;
      }
    }
  }
  
  // Total adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    const totalAdjustment = data.adjustments.reduce((total: number, adj: any) => total + adj.impact, 0);
    const sign = totalAdjustment >= 0 ? '+' : '';
    const formattedTotal = `${sign}$${Math.abs(totalAdjustment).toLocaleString()}`;
    
    currentY -= 5;
    
    page.drawText('Total Adjustments:', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    // Right-align the value
    const totalWidth = fonts.bold.widthOfTextAtSize(formattedTotal, 10);
    page.drawText(formattedTotal, {
      x: width - margin - totalWidth,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: totalAdjustment >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
    });
    
    currentY -= 20;
  }
  
  // Horizontal line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 20;
  
  // Final value
  const formattedFinalValue = `$${data.estimatedValue.toLocaleString()}`;
  
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  // Right-align the value
  const finalValueWidth = fonts.bold.widthOfTextAtSize(formattedFinalValue, 14);
  page.drawText(formattedFinalValue, {
    x: width - margin - finalValueWidth,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  return currentY - 30; // Add some padding
}

/**
 * Add the explanation section to the PDF
 */
async function addExplanationSection(params: SectionParams): Promise<number> {
  const { page, y, margin, width, data, fonts, textColor, primaryColor } = params;
  let currentY = y || params.startY;
  
  if (!data.explanation) {
    return currentY;
  }
  
  // Section title
  currentY -= 10;
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 20;
  
  // Explanation text with word wrapping
  const maxWidth = width - (margin * 2);
  const words = data.explanation.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = fonts.regular.widthOfTextAtSize(testLine, 10);
    
    if (testWidth > maxWidth) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 10,
        font: fonts.regular,
        color: textColor,
      });
      
      line = word;
      currentY -= 15;
      
      // If we're running out of space, add a new page
      if (currentY < margin + 50) {
        const newPage = params.page.document.addPage([612, 792]);
        
        // Update the page and reset Y position
        params.page = newPage;
        page.drawText('Valuation Explanation (continued)', {
          x: margin,
          y: params.height - margin - 20,
          size: 14,
          font: fonts.bold,
          color: primaryColor,
        });
        
        currentY = params.height - margin - 50;
      }
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 15;
  }
  
  return currentY - 20; // Add some padding
}

/**
 * Add the condition assessment section to the PDF
 */
async function addConditionAssessmentSection(params: SectionParams): Promise<number> {
  const { page, y, margin, width, data, fonts, textColor, primaryColor } = params;
  let currentY = y || params.startY;
  
  if (!data.aiCondition) {
    return currentY;
  }
  
  // Section title
  currentY -= 10;
  page.drawText('Condition Assessment', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Condition rating
  const condition = data.aiCondition.condition || data.condition || 'Unknown';
  page.drawText(`Overall Condition: ${condition}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Confidence score if available
  if (data.aiCondition.score || data.aiCondition.confidenceScore) {
    const score = data.aiCondition.score || data.aiCondition.confidenceScore || 0;
    page.drawText(`Confidence: ${score}%`, {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Issues detected
  const issues = data.aiCondition.issues || 
                data.aiCondition.issuesDetected || 
                [];
  
  if (issues.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    currentY -= 15;
    
    // List all issues
    for (const issue of issues) {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y: currentY,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      currentY -= 15;
      
      // If we're running out of space, add a new page
      if (currentY < margin + 50) {
        const newPage = params.page.document.addPage([612, 792]);
        
        // Update the page and reset Y position
        params.page = newPage;
        page.drawText('Condition Assessment (continued)', {
          x: margin,
          y: params.height - margin - 20,
          size: 14,
          font: fonts.bold,
          color: primaryColor,
        });
        
        currentY = params.height - margin - 50;
      }
    }
  }
  
  // Add summary if available
  if (data.aiCondition.summary) {
    currentY -= 10;
    
    page.drawText('Summary:', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.bold,
      color: textColor,
    });
    
    currentY -= 15;
    
    // Summary text with word wrapping
    const maxWidth = width - (margin * 2);
    const words = data.aiCondition.summary.split(' ');
    let line = '';
    
    for (const word of words) {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = fonts.regular.widthOfTextAtSize(testLine, 9);
      
      if (testWidth > maxWidth) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 9,
          font: fonts.regular,
          color: textColor,
        });
        
        line = word;
        currentY -= 12;
        
        // If we're running out of space, add a new page
        if (currentY < margin + 50) {
          const newPage = params.page.document.addPage([612, 792]);
          
          // Update the page and reset Y position
          params.page = newPage;
          page.drawText('Condition Assessment (continued)', {
            x: margin,
            y: params.height - margin - 20,
            size: 14,
            font: fonts.bold,
            color: primaryColor,
          });
          
          currentY = params.height - margin - 50;
        }
      } else {
        line = testLine;
      }
    }
    
    // Draw the last line
    if (line) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 9,
        font: fonts.regular,
        color: textColor,
      });
      
      currentY -= 12;
    }
  }
  
  return currentY - 20; // Add some padding
}

/**
 * Add the comparables section to the PDF
 */
async function addComparablesSection(params: SectionParams): Promise<number> {
  const { page, y, margin, width, data, fonts, textColor, primaryColor } = params;
  let currentY = y || params.startY;
  
  // Mock comparables data (in a real implementation, this would come from data)
  const comparables = [
    { source: 'Local Dealership', price: data.estimatedValue * 1.05, date: '2 weeks ago' },
    { source: 'Private Seller (Similar Mileage)', price: data.estimatedValue * 0.95, date: '1 month ago' },
    { source: 'Online Listing Average', price: data.estimatedValue * 1.02, date: 'Current' },
  ];
  
  // Section title
  currentY -= 10;
  page.drawText('Market Comparables', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Column headers
  const col1 = margin;
  const col2 = margin + 200;
  const col3 = width - margin - 100;
  
  page.drawText('Source', {
    x: col1,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Price', {
    x: col2,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  page.drawText('Date', {
    x: col3,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 15;
  
  // Horizontal line under headers
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 15;
  
  // Data rows
  for (const comp of comparables) {
    page.drawText(comp.source, {
      x: col1,
      y: currentY,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    page.drawText(`$${comp.price.toLocaleString()}`, {
      x: col2,
      y: currentY,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    page.drawText(comp.date, {
      x: col3,
      y: currentY,
      size: 9,
      font: fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY - 10; // Add some padding
}

/**
 * Add the footer section to the PDF
 */
async function addFooterSection(params: SectionParams): Promise<number> {
  const { page, y, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let currentY = y || params.startY;
  
  // Move to the bottom of the page
  currentY = margin + 40;
  
  // Add a horizontal line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 25;
  
  // Footer text
  const footerText = 'This report provides an estimated value based on market data and the information provided. ' +
    'Actual selling prices may vary based on negotiation, additional inspections, or market changes. ' +
    'For the most accurate valuation, we recommend a professional inspection.';
  
  // Footer text with word wrapping
  const maxWidth = width - (margin * 2);
  const words = footerText.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = fonts.regular.widthOfTextAtSize(testLine, 8);
    
    if (testWidth > maxWidth) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 8,
        font: fonts.italic,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      line = word;
      currentY -= 10;
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 8,
      font: fonts.italic,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  // Company info at the very bottom
  currentY = margin + 10;
  
  // Add branding if enabled
  if (options.includeBranding) {
    page.drawText('Generated by Car Detective', {
      x: margin,
      y: currentY,
      size: 8,
      font: fonts.bold,
      color: primaryColor,
    });
    
    // Add current date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-US');
    const dateText = `Report Date: ${formattedDate}`;
    const dateWidth = fonts.regular.widthOfTextAtSize(dateText, 8);
    
    page.drawText(dateText, {
      x: width - margin - dateWidth,
      y: currentY,
      size: 8,
      font: fonts.regular,
      color: textColor,
    });
  }
  
  return currentY;
}

// Export the main function for use in other files
export { generatePremiumReport as generatePremiumPdf };
