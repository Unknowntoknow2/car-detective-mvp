
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { ReportData, ReportGeneratorParams, ReportOptions, SectionParams } from '../types';

/**
 * Generate a premium PDF report
 */
export async function generatePremiumReport({ data, options }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a blank page
  const page = pdfDoc.addPage([612, 792]); // Letter size page
  
  // Define colors and styles
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.0, 0.4, 0.8);
  const secondaryColor = rgb(0.2, 0.6, 0.9);
  
  // Load standard fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Set page margins
  const margin = 50;
  const width = page.getWidth() - (margin * 2);
  const height = page.getHeight();
  
  // Initialize current Y position for content placement
  let currentY = height - margin;
  
  // Common section parameters
  const sectionParams: SectionParams = {
    page,
    startY: currentY,
    width,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    height,
    fonts: {
      regular: regularFont,
      bold: boldFont,
      italic: italicFont
    }
  };
  
  // Add header section
  currentY = await addHeaderSection(sectionParams);
  
  // Add vehicle details section
  currentY = await addVehicleDetailsSection({
    ...sectionParams,
    startY: currentY
  });
  
  // Add valuation summary section
  currentY = await addValuationSummarySection({
    ...sectionParams,
    startY: currentY
  });
  
  // Add condition assessment if available and included in options
  if (data.aiCondition && options.includePhotoAssessment) {
    currentY = await addConditionAssessmentSection({
      ...sectionParams,
      startY: currentY
    });
  }
  
  // Add valuation breakdown section
  currentY = await addValuationBreakdownSection({
    ...sectionParams,
    startY: currentY
  });
  
  // Add explanation section if included in options
  if (options.includeExplanation) {
    currentY = await addExplanationSection({
      ...sectionParams,
      startY: currentY
    });
  }
  
  // Add disclaimer section
  currentY = await addDisclaimerSection({
    ...sectionParams,
    startY: currentY
  });
  
  // Add watermark if specified
  if (options.watermark) {
    await addWatermark({
      ...sectionParams,
      watermarkText: typeof options.watermark === 'string' ? options.watermark : 'SAMPLE'
    });
  }
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}

/**
 * Add header section to the PDF
 */
async function addHeaderSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, primaryColor, fonts } = params;
  let currentY = startY;
  
  // Add logo placeholder (this would typically be an image)
  page.drawRectangle({
    x: margin,
    y: currentY - 40,
    width: 120,
    height: 30,
    color: primaryColor,
  });
  
  // Add report title
  page.drawText('PREMIUM VEHICLE VALUATION REPORT', {
    x: margin,
    y: currentY - 80,
    size: 20,
    font: boldFont,
    color: primaryColor,
  });
  
  // Add date generated
  const dateGenerated = data.generatedAt 
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
  
  page.drawText(`Generated on ${dateGenerated}`, {
    x: margin,
    y: currentY - 100,
    size: 10,
    font: fonts.italic || fonts.regular,
    color: textColor,
  });
  
  // Add report ID or reference number
  page.drawText(`Report ID: ${data.vin || 'Not Available'}`, {
    x: margin,
    y: currentY - 115,
    size: 10,
    font: font,
    color: textColor,
  });
  
  // Add horizontal separator
  page.drawLine({
    start: { x: margin, y: currentY - 130 },
    end: { x: width + margin, y: currentY - 130 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the new Y position
  return currentY - 150;
}

/**
 * Add vehicle details section to the PDF
 */
async function addVehicleDetailsSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, primaryColor, fonts } = params;
  let currentY = startY;
  
  // Section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Vehicle title (year, make, model)
  const vehicleTitle = `${data.year} ${data.make} ${data.model}${data.trim ? ` ${data.trim}` : ''}`;
  page.drawText(vehicleTitle, {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: textColor,
  });
  
  currentY -= 25;
  
  // Create a 2-column layout for vehicle details
  const colWidth = width / 2;
  const leftCol = margin;
  const rightCol = margin + colWidth;
  const lineHeight = 20;
  
  // Left column details
  page.drawText('VIN:', {
    x: leftCol,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(data.vin || 'Not Available', {
    x: leftCol + 70,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  currentY -= lineHeight;
  
  page.drawText('Mileage:', {
    x: leftCol,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(`${data.mileage.toLocaleString()} miles`, {
    x: leftCol + 70,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  currentY -= lineHeight;
  
  page.drawText('Condition:', {
    x: leftCol,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(data.condition || 'Not Available', {
    x: leftCol + 70,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  // Reset Y position for right column
  currentY = startY - 50;
  
  // Right column details
  page.drawText('Body Style:', {
    x: rightCol,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(data.bodyStyle || 'Not Available', {
    x: rightCol + 80,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  currentY -= lineHeight;
  
  page.drawText('Color:', {
    x: rightCol,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(data.color || 'Not Available', {
    x: rightCol + 80,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  currentY -= lineHeight;
  
  page.drawText('Location:', {
    x: rightCol,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(data.zipCode || 'Not Available', {
    x: rightCol + 80,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  // Additional vehicle information
  currentY = startY - 110;
  
  if (data.features && data.features.length > 0) {
    page.drawText('Key Features:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 20;
    
    // Display features in a compact format
    const featuresPerRow = 2;
    const featureColWidth = width / featuresPerRow;
    
    for (let i = 0; i < Math.min(data.features.length, 6); i++) {
      const colIndex = i % featuresPerRow;
      const rowIndex = Math.floor(i / featuresPerRow);
      const featureX = margin + (colIndex * featureColWidth);
      const featureY = currentY - (rowIndex * lineHeight);
      
      page.drawText(`• ${data.features[i]}`, {
        x: featureX,
        y: featureY,
        size: 10,
        font: font,
        color: textColor,
      });
    }
    
    currentY -= (Math.ceil(Math.min(data.features.length, 6) / featuresPerRow) * lineHeight);
  }
  
  // Add horizontal separator
  currentY -= 20;
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width + margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the new Y position
  return currentY - 20;
}

/**
 * Add valuation summary section to the PDF
 */
async function addValuationSummarySection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, primaryColor, fonts } = params;
  let currentY = startY;
  
  // Section title
  page.drawText('Valuation Summary', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 30;
  
  // Draw estimated value box
  const boxWidth = width;
  const boxHeight = 60;
  const boxX = margin;
  const boxY = currentY - boxHeight;
  
  // Box background
  page.drawRectangle({
    x: boxX,
    y: boxY,
    width: boxWidth,
    height: boxHeight,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  // Value label
  page.drawText('Estimated Value:', {
    x: boxX + 15,
    y: boxY + boxHeight - 25,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  // Format the estimated value as currency
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(data.estimatedValue);
  
  // Estimated value amount
  page.drawText(formattedValue, {
    x: boxX + 15,
    y: boxY + boxHeight - 50,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  
  // Confidence score
  if (data.confidenceScore) {
    const confidenceText = `Confidence Score: ${data.confidenceScore}%`;
    const textWidth = font.widthOfTextAtSize(confidenceText, 10);
    
    page.drawText(confidenceText, {
      x: boxX + boxWidth - textWidth - 15,
      y: boxY + 15,
      size: 10,
      font: font,
      color: textColor,
    });
  }
  
  currentY = boxY - 20;
  
  // Price range
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    const formatPrice = (price: number) => new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
    
    page.drawText('Estimated Price Range:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(`${formatPrice(data.priceRange[0])} - ${formatPrice(data.priceRange[1])}`, {
      x: margin + 130,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Region information
  if (data.regionName || data.zipCode) {
    page.drawText('Market Region:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(data.regionName || `Area code ${data.zipCode}` || 'National Average', {
      x: margin + 130,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  // Add horizontal separator
  currentY -= 10;
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width + margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the new Y position
  return currentY - 20;
}

/**
 * Add condition assessment section to the PDF
 */
async function addConditionAssessmentSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, primaryColor, fonts } = params;
  let currentY = startY;
  
  // Section title
  page.drawText('AI Condition Assessment', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Check if we have AI condition data
  if (!data.aiCondition) {
    page.drawText('No condition assessment data available.', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.italic || fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  } else {
    // Format and display the condition assessment
    const condition = data.aiCondition.condition || 'Not Available';
    const score = data.aiCondition.confidenceScore || data.aiCondition.score || 0;
    
    // Condition rating box
    const boxWidth = width / 3;
    const boxHeight = 60;
    const boxX = margin;
    const boxY = currentY - boxHeight;
    
    // Box background
    page.drawRectangle({
      x: boxX,
      y: boxY,
      width: boxWidth,
      height: boxHeight,
      color: rgb(0.95, 0.95, 0.95),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    
    // Condition label
    page.drawText('Overall Condition:', {
      x: boxX + 10,
      y: boxY + boxHeight - 20,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    // Condition value
    page.drawText(condition, {
      x: boxX + 10,
      y: boxY + boxHeight - 40,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    // Confidence score
    if (score) {
      page.drawText(`Confidence: ${score}%`, {
        x: boxX + 10,
        y: boxY + 10,
        size: 8,
        font: font,
        color: textColor,
      });
    }
    
    // Issues detected
    const issuesDetected = data.aiCondition.issuesDetected || 
                         data.aiCondition.issues || 
                         [];
    
    if (issuesDetected.length > 0) {
      const issuesBoxX = boxX + boxWidth + 20;
      const issuesBoxWidth = width - boxWidth - 20;
      
      page.drawText('Issues Detected:', {
        x: issuesBoxX,
        y: boxY + boxHeight - 20,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      // List the issues
      for (let i = 0; i < Math.min(issuesDetected.length, 3); i++) {
        page.drawText(`• ${issuesDetected[i]}`, {
          x: issuesBoxX,
          y: boxY + boxHeight - 40 - (i * 15),
          size: 9,
          font: font,
          color: textColor,
        });
      }
    }
    
    currentY = boxY - 20;
    
    // Condition summary
    if (data.aiCondition.summary) {
      page.drawText('Assessment Summary:', {
        x: margin,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      currentY -= 15;
      
      // Split the summary into multiple lines if necessary
      const summaryText = data.aiCondition.summary;
      const maxWidth = width;
      const fontSize = 9;
      
      let remainingText = summaryText;
      let lineCounter = 0;
      
      while (remainingText.length > 0 && lineCounter < 5) {
        // Find how many characters will fit in one line
        let i = 0;
        let currentLine = '';
        
        while (i < remainingText.length) {
          const testLine = remainingText.substring(0, i + 1);
          const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (lineWidth > maxWidth) {
            break;
          }
          
          currentLine = testLine;
          i++;
        }
        
        // If we couldn't fit even one character, break to avoid infinite loop
        if (currentLine.length === 0) {
          currentLine = remainingText.substring(0, 20); // Take first 20 chars
          remainingText = remainingText.substring(20);
        } else {
          // Find last space to break at word boundary
          const lastSpace = currentLine.lastIndexOf(' ');
          
          if (lastSpace > 0 && currentLine.length < remainingText.length) {
            currentLine = remainingText.substring(0, lastSpace);
            remainingText = remainingText.substring(lastSpace + 1);
          } else {
            remainingText = remainingText.substring(currentLine.length);
          }
        }
        
        // Draw the line
        page.drawText(currentLine, {
          x: margin,
          y: currentY - (lineCounter * 12),
          size: fontSize,
          font: font,
          color: textColor,
        });
        
        lineCounter++;
      }
      
      currentY -= (lineCounter * 12 + 10);
    }
  }
  
  // Add horizontal separator
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width + margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the new Y position
  return currentY - 20;
}

/**
 * Add valuation breakdown section to the PDF
 */
async function addValuationBreakdownSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, primaryColor, fonts } = params;
  let currentY = startY;
  
  // Section title
  page.drawText('Valuation Breakdown', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 30;
  
  // Base value
  const baseValue = data.estimatedValue - 
    (data.adjustments?.reduce((sum, adj) => sum + adj.impact, 0) || 0);
  
  page.drawText('Base Value:', {
    x: margin,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(formatCurrency(baseValue), {
    x: margin + width - 100,
    y: currentY,
    size: 10,
    font: font,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Add adjustments if available
  if (data.adjustments && data.adjustments.length > 0) {
    // Draw adjustments header
    page.drawText('Adjustments:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 15;
    
    // Draw adjustments table
    const tableStartY = currentY;
    const colWidth = width / 4;
    
    // Table header
    page.drawRectangle({
      x: margin,
      y: currentY - 20,
      width: width,
      height: 20,
      color: rgb(0.95, 0.95, 0.95),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    
    page.drawText('Factor', {
      x: margin + 10,
      y: currentY - 15,
      size: 9,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Description', {
      x: margin + colWidth + 10,
      y: currentY - 15,
      size: 9,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Impact', {
      x: margin + colWidth * 3 + 10,
      y: currentY - 15,
      size: 9,
      font: boldFont,
      color: textColor,
    });
    
    currentY -= 20;
    
    // Table rows
    for (let i = 0; i < data.adjustments.length; i++) {
      const adjustment = data.adjustments[i];
      const rowHeight = 20;
      const rowY = currentY - rowHeight;
      
      // Row background (alternating)
      if (i % 2 === 0) {
        page.drawRectangle({
          x: margin,
          y: rowY,
          width: width,
          height: rowHeight,
          color: rgb(0.98, 0.98, 0.98),
          borderColor: rgb(0.9, 0.9, 0.9),
          borderWidth: 1,
        });
      } else {
        page.drawRectangle({
          x: margin,
          y: rowY,
          width: width,
          height: rowHeight,
          borderColor: rgb(0.9, 0.9, 0.9),
          borderWidth: 1,
        });
      }
      
      // Factor
      page.drawText(adjustment.factor, {
        x: margin + 10,
        y: rowY + 5,
        size: 9,
        font: font,
        color: textColor,
      });
      
      // Description
      const description = adjustment.description || '';
      page.drawText(description.length > 30 ? `${description.substring(0, 27)}...` : description, {
        x: margin + colWidth + 10,
        y: rowY + 5,
        size: 9,
        font: font,
        color: textColor,
      });
      
      // Impact
      const impact = adjustment.impact;
      const formattedImpact = impact > 0 ? `+${formatCurrency(impact)}` : formatCurrency(impact);
      
      page.drawText(formattedImpact, {
        x: margin + colWidth * 3 + 10,
        y: rowY + 5,
        size: 9,
        font: font,
        color: impact >= 0 ? rgb(0.2, 0.6, 0.2) : rgb(0.8, 0.2, 0.2),
      });
      
      currentY = rowY;
    }
    
    // Total value
    currentY -= 30;
    
    page.drawLine({
      start: { x: margin + colWidth * 3, y: currentY + 20 },
      end: { x: margin + width, y: currentY + 20 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    page.drawText('Final Valuation:', {
      x: margin + colWidth * 3 + 10,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(formatCurrency(data.estimatedValue), {
      x: margin + width - 100,
      y: currentY,
      size: 10,
      font: boldFont,
      color: primaryColor,
    });
    
    currentY -= 20;
  }
  
  // Add horizontal separator
  currentY -= 20;
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width + margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the new Y position
  return currentY - 20;
}

/**
 * Add explanation section to the PDF
 */
async function addExplanationSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, primaryColor, fonts } = params;
  let currentY = startY;
  
  // Section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Check if we have explanation data
  if (!data.explanation) {
    page.drawText('No detailed explanation available.', {
      x: margin,
      y: currentY,
      size: 10,
      font: fonts.italic || fonts.regular,
      color: textColor,
    });
    
    currentY -= 20;
  } else {
    // Split the explanation into multiple lines if necessary
    const explanationText = data.explanation;
    const maxWidth = width;
    const fontSize = 10;
    
    let remainingText = explanationText;
    let lineCounter = 0;
    
    while (remainingText.length > 0 && lineCounter < 10) {
      // Find how many characters will fit in one line
      let i = 0;
      let currentLine = '';
      
      while (i < remainingText.length) {
        const testLine = remainingText.substring(0, i + 1);
        const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
        
        if (lineWidth > maxWidth) {
          break;
        }
        
        currentLine = testLine;
        i++;
      }
      
      // If we couldn't fit even one character, break to avoid infinite loop
      if (currentLine.length === 0) {
        currentLine = remainingText.substring(0, 20); // Take first 20 chars
        remainingText = remainingText.substring(20);
      } else {
        // Find last space to break at word boundary
        const lastSpace = currentLine.lastIndexOf(' ');
        
        if (lastSpace > 0 && currentLine.length < remainingText.length) {
          currentLine = remainingText.substring(0, lastSpace);
          remainingText = remainingText.substring(lastSpace + 1);
        } else {
          remainingText = remainingText.substring(currentLine.length);
        }
      }
      
      // Draw the line
      page.drawText(currentLine, {
        x: margin,
        y: currentY - (lineCounter * 15),
        size: fontSize,
        font: font,
        color: textColor,
      });
      
      lineCounter++;
    }
    
    currentY -= (lineCounter * 15 + 10);
  }
  
  // Add horizontal separator
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width + margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Return the new Y position
  return currentY - 20;
}

/**
 * Add disclaimer section to the PDF
 */
async function addDisclaimerSection(params: SectionParams): Promise<number> {
  const { page, startY, width, margin, data, boldFont, font, textColor, fonts, height } = params;
  
  // Position the disclaimer at the bottom of the page
  let currentY = Math.min(startY, 100); // Either continue from previous section or place near bottom
  
  if (height && currentY > height - 100) {
    // If there's not enough space, add a new page
    const newPage = params.page.document.addPage([612, 792]);
    const tempParams = { ...params, page: newPage, startY: height - margin };
    return addDisclaimerSection(tempParams);
  }
  
  // Section title
  page.drawText('Disclaimer', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  currentY -= 20;
  
  // Disclaimer text
  const disclaimerText = data.disclaimerText || 
    'This report provides an estimated valuation based on market data and the information provided. ' +
    'Actual selling prices may vary. This is not an offer to purchase the vehicle. ' +
    'Values are estimates only and are subject to change based on market conditions. ' +
    'Report generated for informational purposes only.';
  
  // Split the disclaimer into multiple lines if necessary
  const maxWidth = width;
  const fontSize = 8;
  
  let remainingText = disclaimerText;
  let lineCounter = 0;
  
  while (remainingText.length > 0 && lineCounter < 8) {
    // Find how many characters will fit in one line
    let i = 0;
    let currentLine = '';
    
    while (i < remainingText.length) {
      const testLine = remainingText.substring(0, i + 1);
      const lineWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (lineWidth > maxWidth) {
        break;
      }
      
      currentLine = testLine;
      i++;
    }
    
    // If we couldn't fit even one character, break to avoid infinite loop
    if (currentLine.length === 0) {
      currentLine = remainingText.substring(0, 20); // Take first 20 chars
      remainingText = remainingText.substring(20);
    } else {
      // Find last space to break at word boundary
      const lastSpace = currentLine.lastIndexOf(' ');
      
      if (lastSpace > 0 && currentLine.length < remainingText.length) {
        currentLine = remainingText.substring(0, lastSpace);
        remainingText = remainingText.substring(lastSpace + 1);
      } else {
        remainingText = remainingText.substring(currentLine.length);
      }
    }
    
    // Draw the line
    page.drawText(currentLine, {
      x: margin,
      y: currentY - (lineCounter * 12),
      size: fontSize,
      font: font,
      color: textColor,
    });
    
    lineCounter++;
  }
  
  currentY -= (lineCounter * 12 + 10);
  
  // Add footer with company info if available
  if (data.companyName || data.website) {
    const companyText = [
      data.companyName || '',
      data.website || ''
    ].filter(Boolean).join(' | ');
    
    const textWidth = font.widthOfTextAtSize(companyText, 8);
    const textX = margin + (width - textWidth) / 2; // Center text
    
    page.drawText(companyText, {
      x: textX,
      y: margin / 2, // Position at bottom of page
      size: 8,
      font: font,
      color: textColor,
    });
  }
  
  // Return the new Y position
  return currentY;
}

/**
 * Add watermark to the PDF
 */
async function addWatermark(params: SectionParams & { watermarkText: string }): Promise<void> {
  const { page, watermarkText, height, font } = params;
  const pageWidth = page.getWidth();
  const pageHeight = height || page.getHeight();
  
  // Set watermark properties
  const watermarkSize = 60;
  const watermarkColor = rgb(0.8, 0.8, 0.8);
  const watermarkOpacity = 0.3;
  
  // Calculate the center of the page
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Save the current graphics state
  page.pushOperators(
    // Translate to center of page
    `${centerX} ${centerY} 0 0 cm`,
    // Rotate 45 degrees
    `0.7071 0.7071 -0.7071 0.7071 0 0 cm`,
    // Set the opacity
    `${watermarkOpacity} gs`
  );
  
  // Draw the watermark text
  page.drawText(watermarkText, {
    x: -watermarkSize * 2,
    y: 0,
    size: watermarkSize,
    font: font,
    color: watermarkColor,
    rotate: degrees(0) as any, // Type assertion to handle the type mismatch
  });
  
  // Restore the graphics state
  page.popOperators();
}

/**
 * Helper function to format currency values
 */
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

