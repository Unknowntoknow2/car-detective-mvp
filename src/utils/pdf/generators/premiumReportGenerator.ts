
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams, SectionParams } from '../types';

/**
 * Generate a premium PDF report
 */
export async function generatePremiumReport(params: ReportGeneratorParams): Promise<Uint8Array> {
  const { data, options } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page to the document
  const page = pdfDoc.addPage();
  
  // Set page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  
  // Load fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.05, 0.2, 0.6);
  
  // Create section parameters
  const sectionParams: SectionParams = {
    page,
    startY: height - margin,
    width,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    regularFont, // Add regularFont explicitly
    y: height - margin // Add y property explicitly
  };
  
  // Draw watermark if needed
  if (options.watermark) {
    drawWatermark(sectionParams, typeof options.watermark === 'string' ? options.watermark : 'SAMPLE');
  }
  
  // Draw header section
  let currentY = drawHeaderSection(sectionParams);
  
  // Draw vehicle info section
  currentY = drawVehicleInfoSection({
    ...sectionParams,
    startY: currentY
  });
  
  // Draw valuation section
  currentY = drawValuationSection({
    ...sectionParams,
    startY: currentY
  });
  
  // Draw adjustment section if we have adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    currentY = drawAdjustmentSection({
      ...sectionParams,
      startY: currentY
    });
  }
  
  // Draw photo assessment section if enabled
  if (options.includePhotoAssessment && data.aiCondition) {
    currentY = drawPhotoAssessmentSection({
      ...sectionParams,
      startY: currentY
    });
  }
  
  // For premium reports, add professional opinion
  if (data.isPremium || options.isPremium) {
    // Check if we need to add a new page
    if (currentY < 200) {
      // Add a new page
      const newPage = pdfDoc.addPage();
      
      // Update page reference
      sectionParams.page = newPage;
      currentY = height - margin;
    }
    
    currentY = drawProfessionalOpinionSection({
      ...sectionParams,
      startY: currentY
    });
  }
  
  // Draw explanation section if enabled
  if (options.includeExplanation && data.explanation) {
    currentY = drawExplanationSection({
      ...sectionParams,
      startY: currentY
    });
  }
  
  // Draw disclaimer section
  currentY = drawDisclaimerSection({
    ...sectionParams,
    startY: currentY
  });
  
  // Draw footer on all pages
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const pageObj = pdfDoc.getPage(i);
    drawFooterSection({
      ...sectionParams,
      page: pageObj
    });
  }
  
  // Serialize the PDF to bytes
  return await pdfDoc.save();
}

/**
 * Draw watermark on the page
 */
function drawWatermark(params: SectionParams, text: string): void {
  const { page, width, height } = params;
  
  // Draw diagonal watermark
  page.drawText(text, {
    x: width / 2 - 150,
    y: height / 2,
    size: 60,
    font: params.font,
    color: rgb(0.85, 0.85, 0.85),
    opacity: 0.3,
    rotate: Math.PI / -4,
  });
}

/**
 * Draw header section
 */
function drawHeaderSection(params: SectionParams): number {
  const { page, startY, margin, data, boldFont, primaryColor, font, textColor } = params;
  let currentY = startY;
  
  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Draw generated date if available
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
      size: 8,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Draw vehicle info section
 */
function drawVehicleInfoSection(params: SectionParams): number {
  const { page, startY, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 20;
  
  // Draw vehicle name
  page.drawText(`${data.year} ${data.make} ${data.model}${data.trim ? ` ${data.trim}` : ''}`, {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Draw vehicle details in a table format
  const drawDetail = (label: string, value: string) => {
    page.drawText(label, {
      x: margin,
      y: currentY,
      size: 9,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(value, {
      x: margin + 120,
      y: currentY,
      size: 9,
      font: font,
      color: textColor,
    });
    
    currentY -= 15;
  };
  
  // Mileage
  if (data.mileage) {
    drawDetail('Mileage:', `${data.mileage.toLocaleString()} miles`);
  }
  
  // VIN
  if (data.vin) {
    drawDetail('VIN:', data.vin);
  }
  
  // Condition
  if (data.condition) {
    drawDetail('Condition:', data.condition);
  }
  
  // Transmission
  if (data.transmission) {
    drawDetail('Transmission:', data.transmission);
  }
  
  // Body Style
  if (data.bodyStyle) {
    drawDetail('Body Style:', data.bodyStyle);
  }
  
  // Color
  if (data.color) {
    drawDetail('Color:', data.color);
  }
  
  // Fuel Type
  if (data.fuelType) {
    drawDetail('Fuel Type:', data.fuelType);
  }
  
  // Location
  if (data.zipCode) {
    drawDetail('Location:', `ZIP: ${data.zipCode}`);
  }
  
  // Region
  if (data.regionName) {
    drawDetail('Region:', data.regionName);
  }
  
  currentY -= 10; // Add some space after the table
  
  return currentY;
}

/**
 * Draw valuation section
 */
function drawValuationSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Draw estimated value
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(`$${data.estimatedValue.toLocaleString()}`, {
    x: margin + 120,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Draw price range if available
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    page.drawText('Price Range:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, {
      x: margin + 120,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText('Confidence Score:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    // Draw the score text
    page.drawText(`${data.confidenceScore}%`, {
      x: margin + 120,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 15;
    
    // Draw confidence score bar
    const barWidth = 150;
    const barHeight = 10;
    const x = margin + 120;
    
    // Draw background bar
    page.drawRectangle({
      x,
      y: currentY - barHeight,
      width: barWidth,
      height: barHeight,
      color: rgb(0.9, 0.9, 0.9), // Light gray
    });
    
    // Draw filled portion of bar
    const fillWidth = barWidth * (data.confidenceScore / 100);
    page.drawRectangle({
      x,
      y: currentY - barHeight,
      width: fillWidth,
      height: barHeight,
      color: primaryColor,
    });
    
    currentY -= 25;
  }
  
  return currentY;
}

/**
 * Draw adjustment section
 */
function drawAdjustmentSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;
  
  // Skip if no adjustments
  if (!data.adjustments || data.adjustments.length === 0) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Value Adjustments', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 20;
  
  // Draw table header
  const columnWidths = {
    factor: 150,
    impact: 100,
    description: width - margin * 2 - 250,
  };
  
  // Draw header row
  page.drawText('Factor', {
    x: margin,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + columnWidths.factor,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + columnWidths.factor + columnWidths.impact,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  currentY -= 15;
  
  // Draw table row divider
  page.drawLine({
    start: { x: margin, y: currentY + 5 },
    end: { x: width - margin, y: currentY + 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 10;
  
  // Draw adjustments
  for (const adjustment of data.adjustments) {
    const impact = adjustment.impact;
    const isPositive = impact > 0;
    
    // Draw factor
    page.drawText(adjustment.factor, {
      x: margin,
      y: currentY,
      size: 9,
      font: font,
      color: textColor,
    });
    
    // Draw impact
    const impactText = `${isPositive ? '+' : ''}$${impact.toLocaleString()}`;
    page.drawText(impactText, {
      x: margin + columnWidths.factor,
      y: currentY,
      size: 9,
      font: font,
      color: isPositive ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0),
    });
    
    // Draw description if available
    if (adjustment.description) {
      page.drawText(adjustment.description, {
        x: margin + columnWidths.factor + columnWidths.impact,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
    }
    
    currentY -= 15;
    
    // Add a new page if we're near the bottom
    if (currentY < 100) {
      const newPage = params.page.document.addPage();
      params.page = newPage;
      currentY = newPage.getSize().height - margin;
    }
  }
  
  // Calculate total adjustment
  if (data.adjustments.length > 0) {
    const totalAdjustment = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    
    // Draw total line
    page.drawLine({
      start: { x: margin, y: currentY + 5 },
      end: { x: width - margin, y: currentY + 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    currentY -= 10;
    
    // Draw total row
    page.drawText('Total Adjustments:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    const totalText = `${totalAdjustment > 0 ? '+' : ''}$${totalAdjustment.toLocaleString()}`;
    page.drawText(totalText, {
      x: margin + columnWidths.factor,
      y: currentY,
      size: 10,
      font: boldFont,
      color: totalAdjustment > 0 ? rgb(0, 0.6, 0) : rgb(0.8, 0, 0),
    });
    
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Draw photo assessment section
 */
function drawPhotoAssessmentSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, options } = params;
  let currentY = startY;
  
  if (!options.includePhotoAssessment || !data.aiCondition) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 20;
  
  // Draw condition assessment
  if (data.aiCondition.condition) {
    page.drawText('Condition Assessment:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(data.aiCondition.condition, {
      x: margin + 150,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 15;
  }
  
  // Draw photo score if available
  if (data.photoScore) {
    page.drawText('Photo Score:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    const scoreText = `${data.photoScore.toFixed(1)}/10`;
    page.drawText(scoreText, {
      x: margin + 150,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 15;
  }
  
  // Draw issues detected if available
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 15;
    
    // List all issues
    for (const issue of data.aiCondition.issuesDetected) {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
      
      currentY -= 12;
    }
    
    currentY -= 5;
  }
  
  // Draw summary if available
  if (data.aiCondition.summary) {
    page.drawText('Summary:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 15;
    
    // Split summary into multiple lines
    const maxWidth = width - (margin * 2) - 10; // Slight indent
    const words = data.aiCondition.summary.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, 9);
      
      if (textWidth > maxWidth) {
        page.drawText(currentLine, {
          x: margin + 10,
          y: currentY,
          size: 9,
          font: font,
          color: textColor,
        });
        
        currentY -= 12;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    // Draw the last line if there's anything left
    if (currentLine) {
      page.drawText(currentLine, {
        x: margin + 10,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
      
      currentY -= 20;
    }
  }
  
  return currentY;
}

/**
 * Draw professional opinion section
 */
function drawProfessionalOpinionSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('Professional Opinion', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 20;
  
  // Sample professional opinion text
  const opinion = "Based on our analysis, this vehicle represents a fair value in the current market. " +
    "The condition is consistent with vehicles of similar age and mileage, and the price reflects current market trends. " +
    "We recommend a professional inspection before purchase as standard practice.";
  
  // Split the opinion into multiple lines
  const maxWidth = width - (margin * 2);
  const words = opinion.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, 9);
    
    if (textWidth > maxWidth) {
      page.drawText(currentLine, {
        x: margin,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
      
      currentY -= 12;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  // Draw the last line if there's anything left
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y: currentY,
      size: 9,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Draw explanation section
 */
function drawExplanationSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, options } = params;
  let currentY = startY;
  
  if (!options.includeExplanation || !data.explanation) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 15;
  
  // Split explanation into multiple lines for better readability
  const maxWidth = width - (margin * 2);
  const words = data.explanation.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, 9);
    
    if (textWidth > maxWidth) {
      // Draw the current line and move to next line
      page.drawText(currentLine, {
        x: margin,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
      
      currentY -= 12;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  // Draw the last line if there's anything left
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y: currentY,
      size: 9,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Draw disclaimer section
 */
function drawDisclaimerSection(params: SectionParams): number {
  const { page, startY, margin, width, font, textColor, data } = params;
  let currentY = startY;
  
  const disclaimer = data.disclaimerText || 
    'DISCLAIMER: This valuation is an estimate based on market data and the vehicle information provided. Actual sale prices may vary based on factors not considered in this report including but not limited to local market conditions, vehicle history, and specific vehicle features. This report is not a guarantee of any specific sale price.';
  
  // Split disclaimer into multiple lines for better readability
  const maxWidth = width - (margin * 2);
  const words = disclaimer.split(' ');
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const textWidth = font.widthOfTextAtSize(testLine, 7);
    
    if (textWidth > maxWidth) {
      // Draw the current line and move to next line
      page.drawText(currentLine, {
        x: margin,
        y: currentY,
        size: 7,
        font: font,
        color: textColor,
        opacity: 0.7,
      });
      
      currentY -= 10;
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  
  // Draw the last line if there's anything left
  if (currentLine) {
    page.drawText(currentLine, {
      x: margin,
      y: currentY,
      size: 7,
      font: font,
      color: textColor,
      opacity: 0.7,
    });
    
    currentY -= 10;
  }
  
  return currentY;
}

/**
 * Draw footer section
 */
function drawFooterSection(params: SectionParams): void {
  const { page, margin, width, font, textColor, data } = params;
  
  const { height } = page.getSize();
  const footerY = 20; // 20 points from bottom
  
  // Draw a thin line above the footer
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Draw copyright text
  const companyName = data.companyName || 'Car Detective';
  const copyrightText = '© ' + new Date().getFullYear() + ' ' + companyName + ' - All Rights Reserved';
  
  page.drawText(copyrightText, {
    x: margin,
    y: footerY,
    size: 8,
    font: font,
    color: textColor,
    opacity: 0.7,
  });
  
  // Draw website if available
  if (data.website) {
    const websiteText = data.website;
    const websiteTextWidth = font.widthOfTextAtSize(websiteText, 8);
    
    page.drawText(websiteText, {
      x: width - margin - websiteTextWidth,
      y: footerY,
      size: 8,
      font: font,
      color: textColor,
      opacity: 0.7,
    });
  }
}
