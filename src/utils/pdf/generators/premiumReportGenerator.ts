
import { rgb, PDFDocument, PDFPage, PDFFont, StandardFonts, degrees } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams, ReportGeneratorParams } from '../types';
import { formatCurrency } from '@/utils/formatCurrency';

// Define font interfaces
interface FontSet {
  regular: PDFFont;
  bold: PDFFont;
  italic?: PDFFont;
}

// Define RotationTypes for PDF-lib
type RotationTypes = 'degrees' | 'radians';

/**
 * Generate a premium valuation PDF report
 */
export async function generatePremiumReport(params: ReportGeneratorParams): Promise<Uint8Array> {
  const { data, options, document } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add metadata
  pdfDoc.setTitle(`${data.year} ${data.make} ${data.model} Valuation Report`);
  pdfDoc.setAuthor('Car Detective');
  pdfDoc.setSubject('Vehicle Valuation Report');
  pdfDoc.setKeywords(['valuation', 'car', 'vehicle', data.make, data.model]);
  pdfDoc.setProducer('Car Detective Premium Valuation Service');
  pdfDoc.setCreator('Car Detective PDF Generator');
  
  // Load standard fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.0, 0.3, 0.7);
  const secondaryColor = rgb(0.7, 0.1, 0.1);
  
  // Define page dimensions (letter size)
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 50;
  const contentWidth = pageWidth - (margin * 2);
  
  // Create the first page
  const page = pdfDoc.addPage([pageWidth, pageHeight]);
  
  // Initialize Y position from the top of the page
  let y = pageHeight - margin;
  
  // Draw report header with vehicle info
  y = drawReportHeader({
    page, 
    data, 
    y, 
    width: contentWidth, 
    margin, 
    textColor, 
    primaryColor, 
    regularFont, 
    boldFont
  });
  y -= 20;
  
  // Draw valuation summary section
  y = drawValuationSummary({
    page, 
    data, 
    y, 
    width: contentWidth, 
    margin, 
    textColor, 
    primaryColor, 
    regularFont, 
    boldFont
  });
  y -= 30;
  
  // Draw vehicle details section
  y = drawVehicleDetails({
    page, 
    data, 
    y, 
    width: contentWidth, 
    margin, 
    textColor, 
    regularFont, 
    boldFont
  });
  y -= 30;
  
  // Draw market analysis section
  y = drawMarketAnalysis({
    page, 
    data, 
    y, 
    width: contentWidth, 
    margin, 
    textColor, 
    primaryColor, 
    regularFont, 
    boldFont
  });
  
  // If not enough space for the next section, add a new page
  if (y < 300) {
    page.drawText('Continued on next page...', {
      x: margin,
      y: margin,
      size: 10,
      font: italicFont,
      color: textColor,
      opacity: 0.7,
    });
    
    // Add a new page
    const newPage = pdfDoc.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
    
    // Draw the header on the new page
    newPage.drawText('Valuation Report (Continued)', {
      x: margin,
      y,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    y -= 30;
    
    // Update the current page
    page = newPage;
  }
  
  // Draw explanation section if included
  if (options.includeExplanation && data.explanation) {
    y = drawExplanationSection({
      page, 
      data, 
      y, 
      width: contentWidth, 
      margin, 
      textColor, 
      regularFont, 
      boldFont, 
      italicFont
    });
    y -= 30;
  }
  
  // Draw photo assessment section if included
  if (options.includePhotoAssessment && (data.photoUrl || data.bestPhotoUrl || data.aiCondition)) {
    y = drawPhotoAssessmentSection({
      page, 
      data, 
      y, 
      width: contentWidth, 
      margin, 
      textColor, 
      regularFont, 
      boldFont
    });
    y -= 30;
  }
  
  // Draw premium features if this is a premium report
  if (data.premium) {
    y = drawPremiumFeatures({
      page, 
      data, 
      y, 
      width: contentWidth, 
      margin, 
      textColor, 
      regularFont, 
      italicFont
    });
    y -= 30;
  }
  
  // Draw watermark if specified
  if (options.watermark) {
    // Add watermark to each page
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const page = pdfDoc.getPage(i);
      drawWatermark({
        page,
        data,
        width: pageWidth,
        height: pageHeight,
        boldFont
      });
    }
  }
  
  // Draw footer on each page
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const page = pdfDoc.getPage(i);
    drawFooter({
      page, 
      data, 
      width: pageWidth, 
      margin, 
      textColor, 
      regularFont
    });
  }
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}

/**
 * Draw the report header section
 */
function drawReportHeader(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    primaryColor,
    regularFont,
    boldFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw logo (placeholder - would need an actual logo embedded)
  // const logoWidth = 100;
  // const logoHeight = 40;
  // page.drawRectangle({
  //   x: margin,
  //   y: currentY - logoHeight,
  //   width: logoWidth,
  //   height: logoHeight,
  //   color: rgb(0.9, 0.9, 0.9),
  //   borderColor: rgb(0.8, 0.8, 0.8),
  //   borderWidth: 1,
  // });
  
  // Draw report title
  const reportTitle = data.reportTitle || `${data.year} ${data.make} ${data.model} ${data.trim || ''} Valuation Report`;
  page.drawText(reportTitle, {
    x: margin,
    y: currentY,
    size: 20,
    font: boldFont,
    color: primaryColor,
  });
  currentY -= 30;
  
  // Draw report generation date
  const reportDate = data.reportDate || data.generatedDate;
  const dateString = reportDate ? 
    `Report generated on ${reportDate.toLocaleDateString()}` : 
    `Report generated on ${new Date().toLocaleDateString()}`;
  
  page.drawText(dateString, {
    x: margin,
    y: currentY,
    size: 10,
    font: regularFont,
    color: textColor,
  });
  currentY -= 20;
  
  // Draw vehicle basic info
  page.drawText(`${data.year} ${data.make} ${data.model} ${data.trim || ''}`, {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor,
  });
  currentY -= 20;
  
  // Draw vehicle details in a two-column layout
  const colWidth = width / 2;
  
  // Left column
  let leftY = currentY;
  
  // Draw mileage
  page.drawText('Mileage:', {
    x: margin,
    y: leftY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(`${data.mileage.toLocaleString()} miles`, {
    x: margin + 100,
    y: leftY,
    size: 10,
    font: regularFont,
    color: textColor,
  });
  leftY -= 15;
  
  // Draw VIN if available
  if (data.vin) {
    page.drawText('VIN:', {
      x: margin,
      y: leftY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(data.vin, {
      x: margin + 100,
      y: leftY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    leftY -= 15;
  }
  
  // Draw ZIP code if available
  if (data.zipCode) {
    page.drawText('Location:', {
      x: margin,
      y: leftY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    const location = data.regionName ? 
      `${data.zipCode} (${data.regionName})` : 
      data.zipCode;
    
    page.drawText(location, {
      x: margin + 100,
      y: leftY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    leftY -= 15;
  }
  
  // Right column
  let rightY = currentY;
  const rightX = margin + colWidth;
  
  // Draw transmission if available
  if (data.transmission) {
    page.drawText('Transmission:', {
      x: rightX,
      y: rightY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(data.transmission, {
      x: rightX + 100,
      y: rightY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    rightY -= 15;
  }
  
  // Draw fuel type if available
  if (data.fuelType) {
    page.drawText('Fuel Type:', {
      x: rightX,
      y: rightY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(data.fuelType, {
      x: rightX + 100,
      y: rightY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    rightY -= 15;
  }
  
  // Draw color if available
  if (data.color) {
    page.drawText('Color:', {
      x: rightX,
      y: rightY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(data.color, {
      x: rightX + 100,
      y: rightY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    rightY -= 15;
  }
  
  // Update currentY to the lower of the two columns
  currentY = Math.min(leftY, rightY);
  currentY -= 10;
  
  // Draw separator line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: margin + width, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw the valuation summary section
 */
function drawValuationSummary(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    primaryColor,
    regularFont,
    boldFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  currentY -= 25;
  
  // Draw estimated value in large font
  const formattedValue = formatCurrency(data.estimatedValue);
  
  // Helper function to measure text width with proper typing
  const measureTextWidth = (text: string, font: PDFFont, size: number): number => {
    return font.widthOfTextAtSize(text, size);
  };
  
  const valueWidth = measureTextWidth(formattedValue, boldFont, 28);
  const valueX = margin + (width - valueWidth) / 2; // Center the value
  
  // Draw a background box for the value
  page.drawRectangle({
    x: margin,
    y: currentY - 35,
    width: width,
    height: 45,
    color: rgb(0.95, 0.95, 0.98),
    borderColor: rgb(0.8, 0.8, 0.9),
    borderWidth: 1,
    borderRadius: 4,
    opacity: 0.8,
  });
  
  // Draw the estimated value
  page.drawText('Estimated Value:', {
    x: margin + 10,
    y: currentY - 15,
    size: 12,
    font: regularFont,
    color: textColor,
  });
  
  page.drawText(formattedValue, {
    x: valueX,
    y: currentY - 28,
    size: 28,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 50;
  
  // Draw price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    const lowPrice = formatCurrency(data.priceRange[0]);
    const highPrice = formatCurrency(data.priceRange[1]);
    
    page.drawText('Value Range:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`${lowPrice} - ${highPrice}`, {
      x: margin + 100,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Draw confidence score if available
  if (data.confidenceScore !== undefined) {
    page.drawText('Confidence Score:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    // Convert confidence score to percentage
    const confidencePercent = `${Math.round(data.confidenceScore)}%`;
    
    page.drawText(confidencePercent, {
      x: margin + 100,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw the vehicle details section
 */
function drawVehicleDetails(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    regularFont,
    boldFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw section title
  page.drawText('Vehicle Details', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor,
  });
  currentY -= 25;
  
  // Check if we have adjustment data
  if (data.adjustments && data.baseValue !== undefined) {
    // Draw base value
    page.drawText('Base Value:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(formatCurrency(data.baseValue), {
      x: margin + 150,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor,
    });
    currentY -= 20;
    
    // Draw adjustments table
    page.drawText('Adjustments:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    currentY -= 20;
    
    // Draw adjustment table headers
    page.drawText('Factor', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Impact', {
      x: margin + 150,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Description', {
      x: margin + 220,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    currentY -= 15;
    
    // Draw separator line
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: margin + width, y: currentY },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    currentY -= 10;
    
    // Draw each adjustment
    for (const adjustment of data.adjustments) {
      // Define the maximum width for the description
      const maxDescWidth = width - 230;
      const wrappedDescription = wrapText(
        adjustment.description || '',
        regularFont,
        10,
        maxDescWidth
      );
      
      // Calculate line height based on description length
      const lineHeight = 15;
      const descriptionLines = wrappedDescription.length;
      const rowHeight = Math.max(lineHeight, descriptionLines * lineHeight);
      
      // Draw factor
      page.drawText(adjustment.factor, {
        x: margin,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      
      // Draw impact (with appropriate color based on value)
      const impact = adjustment.impact;
      const impactText = formatCurrency(impact);
      const impactColor = impact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0);
      
      page.drawText(impactText, {
        x: margin + 150,
        y: currentY,
        size: 10,
        font: regularFont,
        color: impactColor,
      });
      
      // Draw description (potentially multi-line)
      for (let i = 0; i < wrappedDescription.length; i++) {
        page.drawText(wrappedDescription[i], {
          x: margin + 220,
          y: currentY - (i * lineHeight),
          size: 10,
          font: regularFont,
          color: textColor,
        });
      }
      
      // Move down by the calculated row height
      currentY -= rowHeight;
      
      // Add a little extra space between rows
      currentY -= 5;
    }
  } else {
    // If no adjustments, just show basic vehicle details
    const details = [
      { label: 'Year', value: data.year.toString() },
      { label: 'Make', value: data.make },
      { label: 'Model', value: data.model },
      { label: 'Trim', value: data.trim || 'Standard' },
      { label: 'Mileage', value: `${data.mileage.toLocaleString()} miles` },
      { label: 'VIN', value: data.vin || 'Not provided' },
      { label: 'Color', value: data.color || 'Not specified' },
      { label: 'Transmission', value: data.transmission || 'Not specified' },
      { label: 'Fuel Type', value: data.fuelType || 'Not specified' },
      { label: 'Body Style', value: data.bodyStyle || data.bodyType || 'Not specified' },
    ];
    
    // Create a two-column layout
    const colWidth = width / 2;
    let leftY = currentY;
    let rightY = currentY;
    
    for (let i = 0; i < details.length; i++) {
      const detail = details[i];
      const isLeftColumn = i < details.length / 2;
      const x = isLeftColumn ? margin : margin + colWidth;
      const y = isLeftColumn ? leftY : rightY;
      
      // Draw label
      page.drawText(`${detail.label}:`, {
        x,
        y,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      // Draw value
      page.drawText(detail.value, {
        x: x + 100,
        y,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      
      // Update the appropriate column's Y position
      if (isLeftColumn) {
        leftY -= 15;
      } else {
        rightY -= 15;
      }
    }
    
    // Update currentY to the lower of the two columns
    currentY = Math.min(leftY, rightY);
  }
  
  // Add features list if available
  if (data.features && data.features.length > 0) {
    currentY -= 10;
    
    page.drawText('Vehicle Features:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    currentY -= 15;
    
    // Create multi-column feature list
    const colWidth = width / 3;
    const featureHeight = 15;
    const maxFeaturesPerColumn = 10;
    
    for (let i = 0; i < data.features.length; i++) {
      const colIndex = Math.floor(i / maxFeaturesPerColumn);
      const rowIndex = i % maxFeaturesPerColumn;
      
      const x = margin + (colWidth * colIndex);
      const y = currentY - (rowIndex * featureHeight);
      
      page.drawText(`• ${data.features[i]}`, {
        x,
        y,
        size: 9,
        font: regularFont,
        color: textColor,
      });
    }
    
    // Update currentY based on features list height
    const totalRows = Math.ceil(data.features.length / 3);
    currentY -= totalRows * featureHeight;
  }
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw the market analysis section
 */
function drawMarketAnalysis(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    primaryColor,
    regularFont,
    boldFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw section title
  page.drawText('Market Analysis', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  currentY -= 20;
  
  // Add market analysis content here
  // For now, just adding placeholder text
  const marketAnalysisText = 
    'This valuation is based on current market conditions for similar vehicles ' +
    `in the ${data.regionName || 'your'} region. Factors such as vehicle condition, ` +
    'mileage, and optional features have been considered in this valuation.';
  
  const wrappedText = wrapText(
    marketAnalysisText,
    regularFont,
    10,
    width
  );
  
  for (let i = 0; i < wrappedText.length; i++) {
    page.drawText(wrappedText[i], {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    currentY -= 15;
  }
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw the explanation section
 */
function drawExplanationSection(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    regularFont,
    boldFont,
    italicFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor,
  });
  currentY -= 20;
  
  // Wrap and draw the explanation text
  if (data.explanation) {
    const wrappedExplanation = wrapText(
      data.explanation,
      regularFont,
      10,
      width
    );
    
    for (let i = 0; i < wrappedExplanation.length; i++) {
      page.drawText(wrappedExplanation[i], {
        x: margin,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor,
      });
      currentY -= 15;
    }
  } else {
    // Display a default message if no explanation is provided
    page.drawText('No detailed explanation is available for this valuation.', {
      x: margin,
      y: currentY,
      size: 10,
      font: italicFont,
      color: textColor,
    });
    currentY -= 15;
  }
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw the photo assessment section
 */
function drawPhotoAssessmentSection(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    regularFont,
    boldFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 30;
  
  // Draw photo if available
  if (data.photoUrl || data.bestPhotoUrl) {
    // Logic to embed an image would go here
    // For now, just add placeholder text
    page.drawText('Photo available: ' + (data.photoUrl || data.bestPhotoUrl), {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor
    });
    currentY -= 20;
  }
  
  // Draw photo score if available
  if (data.photoScore !== undefined) {
    page.drawText(`Photo Score: ${(data.photoScore * 100).toFixed(0)}%`, {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    // Add explanation of score
    const scoreText = getScoreDescription(data.photoScore);
    page.drawText(scoreText, {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor
    });
    currentY -= 30;
  }
  
  // Draw AI condition assessment if available
  if (data.aiCondition) {
    const aiCondition = data.aiCondition;
    
    // Helper function to check if aiCondition is an object
    const isAiConditionObject = (obj: any): obj is { 
      summary?: string; 
      score?: number; 
      confidenceScore?: number; 
      issuesDetected?: string[];
      condition?: string;
    } => {
      return typeof obj === 'object' && obj !== null;
    };
    
    // Draw condition summary
    page.drawText('AI Condition Assessment:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    // Draw summary if available
    if (isAiConditionObject(aiCondition) && aiCondition.summary) {
      page.drawText(aiCondition.summary, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    } else if (typeof aiCondition === 'string') {
      page.drawText(aiCondition, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    }
    
    // Draw confidence score if available
    if (isAiConditionObject(aiCondition) && aiCondition.confidenceScore) {
      page.drawText('Confidence Score:', {
        x: margin,
        y: currentY,
        size: 11,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;
      
      page.drawText(`${aiCondition.confidenceScore.toFixed(0)}%`, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    }
    
    // Draw issues detected if available
    if (isAiConditionObject(aiCondition) && aiCondition.issuesDetected && aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: currentY,
        size: 11,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;
      
      // List all issues
      for (const issue of aiCondition.issuesDetected) {
        page.drawText(`• ${issue}`, {
          x: margin + 10,
          y: currentY,
          size: 10,
          font: regularFont,
          color: textColor
        });
        currentY -= 15;
      }
    }
  }
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw premium features section
 */
function drawPremiumFeatures(params: SectionParams): number {
  const {
    page,
    data,
    y = 0,
    width = 500,
    margin = 50,
    textColor,
    regularFont,
    italicFont
  } = params;
  
  // Define starting Y position
  let currentY = y;
  
  // Draw section title
  page.drawText('Premium Report Features', {
    x: margin,
    y: currentY,
    size: 14,
    font: italicFont,
    color: textColor,
  });
  currentY -= 20;
  
  // List premium features
  const premiumFeatures = [
    'Detailed vehicle condition assessment',
    'Historical price trends analysis',
    'Market-specific valuation adjustments',
    'Comprehensive vehicle feature impact analysis',
    'Professional photo quality assessment',
  ];
  
  for (const feature of premiumFeatures) {
    page.drawText(`• ${feature}`, {
      x: margin + 10,
      y: currentY,
      size: 10,
      font: regularFont,
      color: textColor,
    });
    currentY -= 15;
  }
  
  // Return the updated Y position
  return currentY;
}

/**
 * Draw footer on each page
 */
function drawFooter(params: SectionParams): number {
  const {
    page,
    data,
    width = 612,
    margin = 50,
    textColor,
    regularFont
  } = params;
  
  const footerY = 30;
  const companyName = data.companyName || 'Car Detective';
  const website = data.website || 'www.cardetective.com';
  const disclaimer = data.disclaimerText || 'This report is for informational purposes only. Values may vary based on actual vehicle condition and market factors.';
  
  // Draw company info
  page.drawText(companyName, {
    x: margin,
    y: footerY,
    size: 8,
    font: regularFont,
    color: textColor,
    opacity: 0.7,
  });
  
  // Draw website
  page.drawText(website, {
    x: width / 2,
    y: footerY,
    size: 8,
    font: regularFont,
    color: textColor,
    opacity: 0.7,
  });
  
  // Draw page number
  page.drawText(`Page ${page.getIndex() + 1}`, {
    x: width - margin - 40,
    y: footerY,
    size: 8,
    font: regularFont,
    color: textColor,
    opacity: 0.7,
  });
  
  // Draw disclaimer
  const wrappedDisclaimer = wrapText(
    disclaimer,
    regularFont,
    6,
    width - (margin * 2)
  );
  
  for (let i = 0; i < wrappedDisclaimer.length; i++) {
    page.drawText(wrappedDisclaimer[i], {
      x: margin,
      y: footerY - 10 - (i * 8),
      size: 6,
      font: regularFont,
      color: textColor,
      opacity: 0.6,
    });
  }
  
  return footerY;
}

/**
 * Draw a watermark diagonally across the page
 */
function drawWatermark(params: SectionParams): void {
  const {
    page,
    data,
    width = 612,
    height = 792,
    boldFont
  } = params;
  
  if (!page || !boldFont) {
    console.warn("Required parameters missing in watermark");
    return;
  }
  
  // Determine watermark text based on premium status or sample flag
  let watermarkText = 'SAMPLE REPORT';
  if (data.premium) {
    watermarkText = 'PREMIUM REPORT';
  } else if (data.isSample) {
    watermarkText = 'SAMPLE REPORT';
  }
  
  // Set watermark properties
  const watermarkColor = rgb(0.8, 0.8, 0.8);
  const watermarkSize = 40;
  
  // Calculate position for centered watermark
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Measure text dimensions for centering
  const textWidth = boldFont.widthOfTextAtSize(watermarkText, watermarkSize);
  const textHeight = watermarkSize;
  
  // Draw rotated watermark
  page.drawText(watermarkText, {
    x: centerX - (textWidth / 2),
    y: centerY - (textHeight / 2),
    size: watermarkSize,
    font: boldFont,
    color: watermarkColor,
    opacity: 0.2,
    rotate: {
      angle: 45 * (Math.PI / 180), // Convert to radians
      type: 'radians' as RotationTypes
    },
  });
}

/**
 * Helper function to wrap text to fit within a width
 */
function wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);
    
    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine.length > 0) {
    lines.push(currentLine);
  }
  
  return lines;
}

/**
 * Get photo score description based on score value
 */
function getScoreDescription(score: number): string {
  if (score >= 0.9) {
    return 'Excellent: Photos show a vehicle in exceptional condition.';
  } else if (score >= 0.8) {
    return 'Very Good: Photos show a well-maintained vehicle with minimal wear.';
  } else if (score >= 0.7) {
    return 'Good: Photos show a vehicle in good condition with normal wear.';
  } else if (score >= 0.6) {
    return 'Fair: Photos show a vehicle with noticeable wear and potential issues.';
  } else {
    return 'Poor: Photos show a vehicle with significant wear or potential problems.';
  }
}
