
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams } from '../types';
import { drawWatermark } from '../sections/watermark';

// Create simple implementations for the missing section modules
function drawHeader(params: SectionParams): number {
  const { page, startY, margin, data, fonts, primaryColor } = params;
  
  // Draw the report title
  page.drawText(`${data.year} ${data.make} ${data.model} Valuation Report`, {
    x: margin,
    y: startY,
    size: 16,
    font: fonts.bold,
    color: primaryColor
  });
  
  // Draw the date if available
  if (data.generatedAt) {
    const date = new Date(data.generatedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    page.drawText(`Generated on ${formattedDate}`, {
      x: margin,
      y: startY - 20,
      size: 10,
      font: fonts.regular,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
  
  // Return the new Y position
  return startY - 40;
}

function drawSummary(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw the section title
  page.drawText('Vehicle Summary', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor
  });
  y -= 20;
  
  // Draw the vehicle details
  const details = [
    { label: 'Year', value: data.year.toString() },
    { label: 'Make', value: data.make },
    { label: 'Model', value: data.model },
    { label: 'Mileage', value: `${data.mileage.toLocaleString()} miles` },
    { label: 'Condition', value: data.condition },
    { label: 'VIN', value: data.vin || 'N/A' },
    { label: 'Location', value: data.zipCode || 'N/A' }
  ];
  
  details.forEach(detail => {
    page.drawText(`${detail.label}:`, {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor
    });
    
    page.drawText(detail.value, {
      x: margin + 100,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor
    });
    
    y -= 15;
  });
  
  // Return the new Y position
  return y - 10;
}

function drawBreakdown(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw the section title
  page.drawText('Valuation Breakdown', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor
  });
  y -= 20;
  
  // Draw the estimated value
  page.drawText('Estimated Value:', {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: textColor
  });
  
  const formattedValue = `$${data.estimatedValue.toLocaleString()}`;
  const valueWidth = fonts.bold.widthOfTextAtSize(formattedValue, 12);
  
  page.drawText(formattedValue, {
    x: params.width - margin - valueWidth,
    y,
    size: 12,
    font: fonts.bold,
    color: primaryColor
  });
  y -= 25;
  
  // Draw the adjustments if available
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Value Adjustments:', {
      x: margin,
      y,
      size: 11,
      font: fonts.bold,
      color: textColor
    });
    y -= 15;
    
    data.adjustments.forEach(adjustment => {
      // Factor name
      page.drawText(adjustment.factor, {
        x: margin + 10,
        y,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
      
      // Impact amount
      const impact = adjustment.impact;
      const formattedImpact = `${impact >= 0 ? '+' : ''}$${Math.abs(impact).toLocaleString()}`;
      const impactWidth = fonts.regular.widthOfTextAtSize(formattedImpact, 10);
      
      page.drawText(formattedImpact, {
        x: params.width - margin - impactWidth,
        y,
        size: 10,
        font: fonts.regular,
        color: impact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0)
      });
      
      y -= 15;
      
      // Description if available
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 20,
          y,
          size: 9,
          font: fonts.italic || fonts.regular,
          color: rgb(0.5, 0.5, 0.5)
        });
        y -= 12;
      }
    });
  }
  
  // Return the new Y position
  return y - 10;
}

function drawFooter(params: SectionParams): void {
  const { page, height, margin, width, fonts, textColor } = params;
  
  // Draw footer line
  page.drawLine({
    start: { x: margin, y: 40 },
    end: { x: width - margin, y: 40 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  // Draw copyright text
  const currentYear = new Date().getFullYear();
  page.drawText(`© ${currentYear} Car Detective. All rights reserved.`, {
    x: margin,
    y: 25,
    size: 8,
    font: fonts.regular,
    color: textColor
  });
}

function drawExplanation(params: SectionParams): number {
  const { page, startY, margin, width, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  if (!options.includeExplanation) {
    return y;
  }
  
  // Draw the section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor
  });
  y -= 20;
  
  // Draw the explanation text if available
  const explanation = data.explanation || 'No explanation available.';
  
  // Split the explanation into lines
  const words = explanation.split(' ');
  let line = '';
  const maxWidth = width - (margin * 2);
  
  words.forEach(word => {
    const testLine = line ? `${line} ${word}` : word;
    const testWidth = fonts.regular.widthOfTextAtSize(testLine, 10);
    
    if (testWidth > maxWidth) {
      // Draw the current line
      page.drawText(line, {
        x: margin,
        y,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
      y -= 15;
      
      // Start a new line
      line = word;
    } else {
      line = testLine;
    }
  });
  
  // Draw the final line
  if (line) {
    page.drawText(line, {
      x: margin,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor
    });
    y -= 15;
  }
  
  // Return the new Y position
  return y - 10;
}

function drawConditionAssessment(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor, options } = params;
  let y = startY;
  
  if (!options.includePhotoAssessment || !data.aiCondition) {
    return y;
  }
  
  // Draw the section title
  page.drawText('Condition Assessment', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor
  });
  y -= 20;
  
  // Draw the condition score
  const condition = data.aiCondition.condition || 'Unknown';
  page.drawText(`Overall Condition: ${condition}`, {
    x: margin,
    y,
    size: 12,
    font: fonts.bold,
    color: textColor
  });
  y -= 20;
  
  // Draw the confidence score if available
  if (data.aiCondition.confidenceScore) {
    page.drawText(`Confidence Score: ${data.aiCondition.confidenceScore}%`, {
      x: margin,
      y,
      size: 10,
      font: fonts.regular,
      color: textColor
    });
    y -= 15;
  }
  
  // Draw the issues detected if available
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor
    });
    y -= 15;
    
    data.aiCondition.issuesDetected.forEach(issue => {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
      y -= 12;
    });
  }
  
  // Draw the summary if available
  if (data.aiCondition.summary) {
    page.drawText('Summary:', {
      x: margin,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor
    });
    y -= 15;
    
    // Split the summary into lines
    const words = data.aiCondition.summary.split(' ');
    let line = '';
    const maxWidth = params.width - (margin * 2) - 10;
    
    words.forEach(word => {
      const testLine = line ? `${line} ${word}` : word;
      const testWidth = fonts.regular.widthOfTextAtSize(testLine, 10);
      
      if (testWidth > maxWidth) {
        // Draw the current line
        page.drawText(line, {
          x: margin + 10,
          y,
          size: 10,
          font: fonts.regular,
          color: textColor
        });
        y -= 12;
        
        // Start a new line
        line = word;
      } else {
        line = testLine;
      }
    });
    
    // Draw the final line
    if (line) {
      page.drawText(line, {
        x: margin + 10,
        y,
        size: 10,
        font: fonts.regular,
        color: textColor
      });
      y -= 12;
    }
  }
  
  // Return the new Y position
  return y - 10;
}

function drawComparables(params: SectionParams): number {
  const { page, startY, margin, data, fonts, textColor, primaryColor } = params;
  let y = startY;
  
  // Draw the section title
  page.drawText('Comparable Vehicles', {
    x: margin,
    y,
    size: 14,
    font: fonts.bold,
    color: primaryColor
  });
  y -= 20;
  
  // Add a placeholder message
  page.drawText('Similar vehicles in your area:', {
    x: margin,
    y,
    size: 10,
    font: fonts.regular,
    color: textColor
  });
  y -= 15;
  
  // Create some dummy comparable data
  const comparables = [
    { year: data.year, price: data.estimatedValue * 0.95, miles: data.mileage * 0.8, distance: '15 miles' },
    { year: data.year, price: data.estimatedValue * 1.05, miles: data.mileage * 1.2, distance: '20 miles' },
    { year: data.year - 1, price: data.estimatedValue * 0.9, miles: data.mileage * 1.1, distance: '5 miles' }
  ];
  
  comparables.forEach(comp => {
    // Vehicle info
    page.drawText(`${comp.year} ${data.make} ${data.model}`, {
      x: margin + 10,
      y,
      size: 10,
      font: fonts.bold,
      color: textColor
    });
    y -= 15;
    
    // Price and miles
    page.drawText(`$${comp.price.toLocaleString()} • ${comp.miles.toLocaleString()} miles • ${comp.distance} away`, {
      x: margin + 20,
      y,
      size: 9,
      font: fonts.regular,
      color: textColor
    });
    y -= 20;
  });
  
  // Return the new Y position
  return y - 10;
}

export async function generatePremiumReport(data: ReportData, customOptions: Partial<ReportOptions> = {}): Promise<Uint8Array> {
  // Set default options
  const options: ReportOptions = {
    includeBranding: true,
    includeExplanation: true,
    includePhotoAssessment: true,
    watermark: data.isSample ? 'SAMPLE REPORT' : false,
    fontSize: 10,
    pdfQuality: 'standard',
    isPremium: true,
    ...customOptions
  };

  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Define margins
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Load fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.05, 0.4, 0.65); // Primary blue color
  
  // Initialize the current Y position for drawing
  let startY = height - margin;
  
  // Setup the section parameters
  const sectionParams: SectionParams = {
    page,
    startY,
    width: contentWidth,
    margin,
    data,
    options,
    textColor,
    primaryColor,
    fonts: {
      regular: fontRegular,
      bold: fontBold,
      italic: fontItalic
    }
  };
  
  // Draw the report header section
  startY = drawHeader(sectionParams);
  
  // Add some spacing
  startY -= 20;
  
  // Draw the summary section
  startY = drawSummary({ ...sectionParams, startY });
  
  // Add some spacing
  startY -= 25;
  
  // Draw the breakdown section
  startY = drawBreakdown({ ...sectionParams, startY });
  
  // Check if we need a new page for the explanation
  if (options.includeExplanation && startY < 300) {
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    
    // Reset the startY for the new page
    startY = height - margin;
    
    // Update the page in the section params
    sectionParams.page = newPage;
  }
  
  // Add some spacing
  startY -= 25;
  
  // Draw the explanation section if included
  if (options.includeExplanation) {
    startY = drawExplanation({ ...sectionParams, startY });
  }
  
  // Check if we need a new page for the condition assessment
  if (options.includePhotoAssessment && data.aiCondition && startY < 300) {
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    
    // Reset the startY for the new page
    startY = height - margin;
    
    // Update the page in the section params
    sectionParams.page = newPage;
  }
  
  // Add some spacing
  startY -= 25;
  
  // Draw the condition assessment section if included and if we have AI condition data
  if (options.includePhotoAssessment && data.aiCondition) {
    startY = drawConditionAssessment({ ...sectionParams, startY });
  }
  
  // Check if we need a new page for the comparables
  if (startY < 200) {
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    
    // Reset the startY for the new page
    startY = height - margin;
    
    // Update the page in the section params
    sectionParams.page = newPage;
  }
  
  // Add some spacing
  startY -= 25;
  
  // Draw the comparables section
  startY = drawComparables({ ...sectionParams, startY });
  
  // Add the footer to all pages
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const pageHeight = page.getSize().height;
    
    // Draw the footer
    drawFooter({
      ...sectionParams,
      page,
      startY: 50, // Footer always at the bottom
      height: pageHeight
    });
    
    // Add the watermark if enabled
    if (options.watermark) {
      drawWatermark({
        ...sectionParams,
        page
      }, typeof options.watermark === 'string' ? options.watermark : 'DRAFT');
    }
    
    // Add page numbers
    const pageText = `Page ${i + 1} of ${pages.length}`;
    const textWidth = fontRegular.widthOfTextAtSize(pageText, 9);
    
    page.drawText(pageText, {
      x: width - margin - textWidth,
      y: 30,
      size: 9,
      font: fontRegular,
      color: rgb(0.5, 0.5, 0.5)
    });
    
    // Add the company logo/name to the top right of each page (except first)
    if (i > 0) {
      const companyName = 'Car Detective';
      page.drawText(companyName, {
        x: width - margin - fontBold.widthOfTextAtSize(companyName, 12),
        y: pageHeight - 30,
        size: 12,
        font: fontBold,
        color: primaryColor,
        rotate: {
          type: 'degrees',
          angle: 0
        }
      });
    }
    
    // Add a subtle branded background element to each page
    page.drawText('PREMIUM REPORT', {
      x: margin,
      y: 40,
      size: 9,
      font: fontBold,
      color: rgb(0.9, 0.9, 0.9), // Very light gray
      rotate: {
        type: 'degrees',
        angle: 0
      }
    });
  }
  
  // Serialize the PDFDocument to bytes
  return pdfDoc.save();
}
