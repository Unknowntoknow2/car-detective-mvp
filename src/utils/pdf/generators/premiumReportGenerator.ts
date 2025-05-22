
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportGeneratorParams, ReportOptions, SectionParams } from '../types';

/**
 * Generate a premium PDF report with enhanced design and details
 */
export async function generatePremiumReport({ data, options }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([850, 1100]);
  const { width, height } = page.getSize();
  
  // Set standard dimensions and spacing
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Load fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Define colors
  const primaryColor = rgb(0.1, 0.4, 0.7);
  const textColor = rgb(0.1, 0.1, 0.1);
  const subtleColor = rgb(0.5, 0.5, 0.5);
  
  // Initialize Y position for content placement
  let currentY = height - margin;
  
  // Initialize section params object
  const sectionParams: SectionParams = {
    page,
    startY: currentY,
    width: contentWidth,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    y: currentY,
    regularFont,
    height
  };
  
  // Draw header section
  currentY = drawHeader(sectionParams);
  
  // Draw vehicle information section
  currentY = drawVehicleInfo({...sectionParams, startY: currentY});
  
  // Draw valuation breakdown
  currentY = drawValuationBreakdown({...sectionParams, startY: currentY});
  
  // Draw condition assessment if available and requested
  if (data.aiCondition && options.includePhotoAssessment) {
    currentY = drawConditionAssessment({...sectionParams, startY: currentY});
  }
  
  // Draw explanation section if requested
  if (options.includeExplanation && data.explanation) {
    currentY = drawExplanation({...sectionParams, startY: currentY});
  }
  
  // Draw features section if available
  if (data.features && data.features.length > 0) {
    currentY = drawFeatures({...sectionParams, startY: currentY});
  }
  
  // Add watermark if specified
  if (options.watermark) {
    addWatermark({...sectionParams, watermarkText: 
      typeof options.watermark === 'string' ? options.watermark : 'SAMPLE REPORT'});
  }
  
  // Draw footer with branding if requested
  if (options.includeBranding) {
    drawFooter({...sectionParams, startY: 40});
  }
  
  // Return the PDF as a byte array
  return pdfDoc.save();
}

/**
 * Draw the report header with vehicle details and estimated value
 */
function drawHeader(params: SectionParams): number {
  const { page, startY, width, margin, data, boldFont, font, primaryColor, textColor } = params;
  let currentY = startY;
  
  // Draw the header background
  page.drawRectangle({
    x: margin,
    y: currentY - 120,
    width,
    height: 110,
    color: primaryColor,
  });
  
  // Draw report title
  const reportTitle = data.reportTitle || 'PREMIUM VEHICLE VALUATION REPORT';
  page.drawText(reportTitle, {
    x: margin + 20,
    y: currentY - 30,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1), // White text on primary color background
  });
  
  // Draw vehicle name
  const vehicleName = `${data.year} ${data.make} ${data.model}${data.trim ? ' ' + data.trim : ''}`;
  page.drawText(vehicleName, {
    x: margin + 20,
    y: currentY - 60,
    size: 18,
    font: boldFont,
    color: rgb(1, 1, 1), // White text on primary color background
  });
  
  // Draw generation date
  if (data.generatedAt) {
    const generatedDate = new Date(data.generatedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    page.drawText(`Report Generated: ${generatedDate}`, {
      x: margin + 20,
      y: currentY - 85,
      size: 12,
      font: font,
      color: rgb(1, 1, 1), // White text on primary color background
    });
  }
  
  // Draw VIN if available
  if (data.vin) {
    page.drawText(`VIN: ${data.vin}`, {
      x: margin + 20,
      y: currentY - 105,
      size: 12,
      font: font,
      color: rgb(1, 1, 1), // White text on primary color background
    });
  }
  
  // Draw estimated value box
  const valueBoxWidth = 200;
  const valueBoxHeight = 140;
  const valueBoxX = width - valueBoxWidth + margin;
  const valueBoxY = currentY - valueBoxHeight;
  
  // Draw value box background
  page.drawRectangle({
    x: valueBoxX,
    y: valueBoxY,
    width: valueBoxWidth,
    height: valueBoxHeight,
    color: rgb(1, 1, 1), // White background
    borderColor: primaryColor,
    borderWidth: 2,
  });
  
  // Draw Estimated Value text
  page.drawText('ESTIMATED VALUE', {
    x: valueBoxX + 30,
    y: valueBoxY + valueBoxHeight - 30,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  // Format the estimated value with commas
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.estimatedValue);
  
  // Draw the estimated value
  page.drawText(formattedValue, {
    x: valueBoxX + 20,
    y: valueBoxY + valueBoxHeight - 60,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw price range if available
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    const formattedLow = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(data.priceRange[0]);
    
    const formattedHigh = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(data.priceRange[1]);
    
    page.drawText('Price Range:', {
      x: valueBoxX + 20,
      y: valueBoxY + valueBoxHeight - 90,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`${formattedLow} - ${formattedHigh}`, {
      x: valueBoxX + 20,
      y: valueBoxY + valueBoxHeight - 110,
      size: 12,
      font: font,
      color: textColor,
    });
  }
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
      x: valueBoxX + 20,
      y: valueBoxY + 20,
      size: 10,
      font: font,
      color: textColor,
    });
  }
  
  // Update the Y position to continue below the header section
  currentY = currentY - 150;
  
  return currentY;
}

/**
 * Draw the vehicle information section
 */
function drawVehicleInfo(params: SectionParams): number {
  const { page, startY, width, margin, data, boldFont, font, primaryColor, textColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('VEHICLE INFORMATION', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: margin + width, y: currentY - 10 },
    thickness: 1,
    color: primaryColor,
  });
  
  currentY -= 40;
  
  // Create a two-column layout for vehicle details
  const colWidth = width / 2;
  let leftColY = currentY;
  let rightColY = currentY;
  
  // Left column details
  const leftDetails = [
    { label: 'Make', value: data.make || 'N/A' },
    { label: 'Model', value: data.model || 'N/A' },
    { label: 'Year', value: data.year ? data.year.toString() : 'N/A' },
    { label: 'Mileage', value: data.mileage ? `${data.mileage.toLocaleString()} miles` : 'N/A' },
    { label: 'Condition', value: data.condition || 'N/A' },
  ];
  
  // Right column details
  const rightDetails = [
    { label: 'VIN', value: data.vin || 'N/A' },
    { label: 'Trim', value: data.trim || 'N/A' },
    { label: 'Body Style', value: data.bodyStyle || 'N/A' },
    { label: 'Transmission', value: data.transmission || 'N/A' },
    { label: 'Color', value: data.color || 'N/A' },
    { label: 'Fuel Type', value: data.fuelType || 'N/A' },
  ];
  
  // Draw left column
  for (const detail of leftDetails) {
    // Draw label
    page.drawText(`${detail.label}:`, {
      x: margin,
      y: leftColY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    // Draw value
    page.drawText(detail.value, {
      x: margin + 100,
      y: leftColY,
      size: 12,
      font: font,
      color: textColor,
    });
    
    leftColY -= 25;
  }
  
  // Draw right column
  for (const detail of rightDetails) {
    // Draw label
    page.drawText(`${detail.label}:`, {
      x: margin + colWidth,
      y: rightColY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    // Draw value
    page.drawText(detail.value, {
      x: margin + colWidth + 100,
      y: rightColY,
      size: 12,
      font: font,
      color: textColor,
    });
    
    rightColY -= 25;
  }
  
  // Calculate new Y position (using the lowest Y value from either column)
  currentY = Math.min(leftColY, rightColY) - 20;
  
  // Draw photo if available
  if (data.bestPhotoUrl) {
    try {
      // In a real implementation, we would load and embed the image
      // For this example, we'll just draw a placeholder rectangle
      page.drawRectangle({
        x: margin + width - 200,
        y: currentY - 150,
        width: 180,
        height: 120,
        color: rgb(0.9, 0.9, 0.9),
        borderColor: rgb(0.7, 0.7, 0.7),
        borderWidth: 1,
      });
      
      page.drawText('Vehicle Photo', {
        x: margin + width - 155,
        y: currentY - 90,
        size: 12,
        font: italicFont,
        color: rgb(0.5, 0.5, 0.5),
      });
      
      // Adjust current Y to account for photo
      currentY -= 170;
    } catch (error) {
      console.error('Error drawing photo:', error);
      // If photo fails, don't adjust Y position as much
      currentY -= 20;
    }
  }
  
  return currentY;
}

/**
 * Draw the valuation breakdown section
 */
function drawValuationBreakdown(params: SectionParams): number {
  const { page, startY, width, margin, data, boldFont, font, primaryColor, textColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('VALUATION BREAKDOWN', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: margin + width, y: currentY - 10 },
    thickness: 1,
    color: primaryColor,
  });
  
  currentY -= 40;
  
  // Draw base value
  page.drawText('Base Vehicle Value:', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: textColor,
  });
  
  // Calculate base value (estimated value minus all adjustments)
  let baseValue = data.estimatedValue;
  if (data.adjustments && data.adjustments.length > 0) {
    const totalAdjustments = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    baseValue = data.estimatedValue - totalAdjustments;
  }
  
  // Format base value
  const formattedBaseValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(baseValue);
  
  page.drawText(formattedBaseValue, {
    x: margin + width - 100,
    y: currentY,
    size: 14,
    font: boldFont,
    color: textColor,
  });
  
  currentY -= 30;
  
  // Draw adjustments if available
  if (data.adjustments && data.adjustments.length > 0) {
    page.drawText('Adjustments:', {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 25;
    
    // Draw each adjustment
    for (const adjustment of data.adjustments) {
      // Draw factor name
      page.drawText(adjustment.factor, {
        x: margin + 20,
        y: currentY,
        size: 12,
        font: font,
        color: textColor,
      });
      
      // Draw description if available
      if (adjustment.description) {
        page.drawText(`(${adjustment.description})`, {
          x: margin + 150,
          y: currentY,
          size: 10,
          font: italicFont,
          color: rgb(0.5, 0.5, 0.5),
        });
      }
      
      // Format adjustment impact
      const impact = adjustment.impact;
      const formattedImpact = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
        signDisplay: 'always',
      }).format(impact);
      
      // Determine color based on impact
      const impactColor = impact >= 0 ? rgb(0.2, 0.6, 0.2) : rgb(0.8, 0.2, 0.2);
      
      // Draw impact value
      page.drawText(formattedImpact, {
        x: margin + width - 100,
        y: currentY,
        size: 12,
        font: boldFont,
        color: impactColor,
      });
      
      currentY -= 20;
    }
    
    // Draw total line
    page.drawLine({
      start: { x: margin + width - 150, y: currentY - 5 },
      end: { x: margin + width, y: currentY - 5 },
      thickness: 1,
      color: textColor,
    });
    
    currentY -= 25;
  }
  
  // Draw final value
  page.drawText('FINAL VALUE:', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  // Format final value
  const formattedFinalValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.estimatedValue);
  
  page.drawText(formattedFinalValue, {
    x: margin + width - 100,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  // If region info is available, draw it
  if (data.regionName && data.zipCode) {
    currentY -= 40;
    
    page.drawText(`Market Analysis for ${data.regionName} (${data.zipCode})`, {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 20;
    
    // Draw region analysis placeholder (in a real implementation, we would include actual data)
    page.drawText('This valuation is based on similar vehicles in your area and recent market trends.', {
      x: margin,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 15;
    
    page.drawText('The price range reflects the typical variation in your local market.', {
      x: margin,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
  }
  
  currentY -= 30;
  
  return currentY;
}

/**
 * Draw the condition assessment section with AI-verified details
 */
function drawConditionAssessment(params: SectionParams): number {
  const { page, startY, width, margin, data, boldFont, font, primaryColor, textColor, italicFont } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('AI-VERIFIED CONDITION ASSESSMENT', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: margin + width, y: currentY - 10 },
    thickness: 1,
    color: primaryColor,
  });
  
  currentY -= 40;
  
  // If AI condition data is available, draw it
  if (data.aiCondition) {
    // Draw condition rating
    const condition = data.aiCondition.condition || 'Unknown';
    page.drawText(`Overall Condition: ${condition}`, {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 25;
    
    // Draw photo score if available
    if (data.photoScore !== undefined) {
      page.drawText(`Photo Analysis Score: ${data.photoScore}`, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: textColor,
      });
      
      currentY -= 20;
    }
    
    // Draw confidence
    if (data.aiCondition.confidenceScore !== undefined) {
      page.drawText(`AI Confidence: ${data.aiCondition.confidenceScore}%`, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: textColor,
      });
      
      currentY -= 20;
    }
    
    // Draw issues detected if available
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor,
      });
      
      currentY -= 20;
      
      // Create new page reference for issues list 
      const tempPage = page;
      
      // Draw each issue with bullet points
      for (const issue of data.aiCondition.issuesDetected) {
        tempPage.drawText('•', {
          x: margin + 10,
          y: currentY,
          size: 12,
          font: font,
          color: textColor,
        });
        
        tempPage.drawText(issue, {
          x: margin + 30,
          y: currentY,
          size: 12,
          font: font,
          color: textColor,
        });
        
        currentY -= 20;
      }
    }
    
    // Draw condition summary if available
    if (data.aiCondition.summary) {
      page.drawText('Summary:', {
        x: margin,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor,
      });
      
      currentY -= 20;
      
      // Split summary into lines to avoid overflow
      const summaryLines = splitTextToLines(data.aiCondition.summary, 90);
      
      for (const line of summaryLines) {
        page.drawText(line, {
          x: margin + 10,
          y: currentY,
          size: 11,
          font: font,
          color: textColor,
        });
        
        currentY -= 18;
      }
    }
  } else {
    // Draw message that condition assessment is not available
    page.drawText('Condition assessment data is not available for this vehicle.', {
      x: margin,
      y: currentY,
      size: 12,
      font: italicFont,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    currentY -= 20;
  }
  
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the explanation section with valuation justification
 */
function drawExplanation(params: SectionParams): number {
  const { page, startY, width, margin, data, boldFont, font, primaryColor, textColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('VALUATION EXPLANATION', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: margin + width, y: currentY - 10 },
    thickness: 1,
    color: primaryColor,
  });
  
  currentY -= 40;
  
  // If explanation is available, draw it
  if (data.explanation) {
    // Split explanation into lines to avoid overflow
    const explanationLines = splitTextToLines(data.explanation, 100);
    
    for (const line of explanationLines) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 11,
        font: font,
        color: textColor,
      });
      
      currentY -= 18;
    }
  } else {
    // Draw message that explanation is not available
    page.drawText('Detailed valuation explanation is not available for this vehicle.', {
      x: margin,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    currentY -= 20;
  }
  
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the features section with list of vehicle features
 */
function drawFeatures(params: SectionParams): number {
  const { page, startY, width, margin, data, boldFont, font, primaryColor, textColor } = params;
  let currentY = startY;
  
  // Draw section title
  page.drawText('VEHICLE FEATURES', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY - 10 },
    end: { x: margin + width, y: currentY - 10 },
    thickness: 1,
    color: primaryColor,
  });
  
  currentY -= 40;
  
  // If features are available, draw them in a multi-column layout
  if (data.features && data.features.length > 0) {
    const columns = 2;
    const columnWidth = width / columns;
    const itemsPerColumn = Math.ceil(data.features.length / columns);
    
    // Create new page reference for features 
    const tempPage = page;
    
    for (let i = 0; i < data.features.length; i++) {
      const column = Math.floor(i / itemsPerColumn);
      const columnX = margin + (column * columnWidth);
      const itemY = currentY - ((i % itemsPerColumn) * 20);
      
      // Draw bullet point
      tempPage.drawText('•', {
        x: columnX,
        y: itemY,
        size: 12,
        font: font,
        color: textColor,
      });
      
      // Draw feature name
      tempPage.drawText(data.features[i], {
        x: columnX + 15,
        y: itemY,
        size: 11,
        font: font,
        color: textColor,
      });
    }
    
    // Adjust current Y based on the items in the first column
    currentY -= (itemsPerColumn * 20) + 20;
  } else {
    // Draw message that features are not available
    page.drawText('Feature information is not available for this vehicle.', {
      x: margin,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    currentY -= 20;
  }
  
  return currentY;
}

/**
 * Add a watermark across the entire document
 */
function addWatermark(params: SectionParams & { watermarkText: string }): void {
  const { page, watermarkText, boldFont, width, height } = params;
  
  // Set diagonal watermark across the page
  page.drawText(watermarkText, {
    x: 50,
    y: height / 2,
    size: 60,
    font: boldFont,
    color: rgb(0.85, 0.85, 0.85),
    opacity: 0.3,
    rotate: {
      type: 'degrees' as any, // Type assertion to bypass TS error
      angle: -45,
    },
  });
}

/**
 * Draw the report footer with branding information
 */
function drawFooter(params: SectionParams): void {
  const { page, startY, width, margin, data, font, boldFont, textColor, primaryColor } = params;
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: startY + 20 },
    end: { x: margin + width, y: startY + 20 },
    thickness: 1,
    color: primaryColor,
  });
  
  // Draw company name if available, otherwise use default
  const companyName = data.companyName || 'CarDetective Valuations';
  page.drawText(companyName, {
    x: margin,
    y: startY,
    size: 10,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw website if available
  if (data.website) {
    page.drawText(data.website, {
      x: margin + width - 150,
      y: startY,
      size: 10,
      font: font,
      color: textColor,
    });
  }
  
  // Draw disclaimer text
  const disclaimer = data.disclaimerText || 'This report is based on market data and AI analysis. Actual value may vary based on factors not accounted for in this report. Not an offer to purchase.';
  
  const disclaimerLines = splitTextToLines(disclaimer, 110);
  let disclaimerY = startY - 20;
  
  for (const line of disclaimerLines) {
    page.drawText(line, {
      x: margin,
      y: disclaimerY,
      size: 8,
      font: font,
      color: rgb(0.5, 0.5, 0.5),
    });
    
    disclaimerY -= 10;
  }
  
  // Draw page number
  page.drawText('Page 1 of 1', {
    x: margin + width - 60,
    y: startY - 40,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
}

/**
 * Helper function to split text into lines based on maximum characters per line
 */
function splitTextToLines(text: string, maxCharsPerLine: number): string[] {
  if (!text) return [];
  
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    
    if (testLine.length <= maxCharsPerLine) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}
