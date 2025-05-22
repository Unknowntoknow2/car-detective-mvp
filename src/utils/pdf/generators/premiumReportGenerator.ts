
import { ReportData, ReportOptions, ReportGeneratorParams, SectionParams } from '../types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { format } from 'date-fns';

/**
 * Generate a premium vehicle valuation report
 */
export async function generatePremiumReport({ data, options }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Add a page
  let page = pdfDoc.addPage([612, 792]); // US Letter
  const { width, height } = page.getSize();
  const margin = 50;

  // Define text colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0, 0.3, 0.7);

  // Initialize y-position for content placement
  let currentY = height - margin;

  // Start rendering the report sections
  // Draw header and title
  currentY = drawHeader({
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
    height
  });

  // Draw vehicle info section
  currentY = drawVehicleInfo({
    page,
    startY: currentY,
    width,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    textColor,
    primaryColor,
    height
  });

  // Draw valuation section
  currentY = drawValuationSection({
    page,
    startY: currentY,
    width,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    textColor,
    primaryColor,
    height
  });

  // Check if we need to add a new page for adjustments
  if (currentY < 300) {
    page = pdfDoc.addPage([612, 792]);
    currentY = height - margin;
  }

  // Draw adjustments section if there are any
  if (data.adjustments && data.adjustments.length > 0) {
    currentY = drawAdjustmentsSection({
      page,
      startY: currentY,
      width,
      margin,
      data,
      options,
      font: regularFont,
      boldFont,
      textColor,
      primaryColor,
      height
    });
  }

  // Check if we need to add a new page for explanation
  if (currentY < 300 && options.includeExplanation && data.explanation) {
    page = pdfDoc.addPage([612, 792]);
    currentY = height - margin;
  }

  // Draw explanation section if enabled and available
  if (options.includeExplanation && data.explanation) {
    currentY = drawExplanationSection({
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
      height
    });
  }

  // Check if we need to add a new page for photo assessment
  if (currentY < 300 && options.includePhotoAssessment && data.photoUrl && data.photoScore) {
    page = pdfDoc.addPage([612, 792]);
    currentY = height - margin;
  }

  // Draw photo assessment section if enabled and available
  if (options.includePhotoAssessment && data.photoUrl && data.photoScore) {
    currentY = drawPhotoAssessmentSection({
      page,
      startY: currentY,
      width,
      margin,
      data,
      options,
      font: regularFont,
      boldFont,
      textColor,
      primaryColor,
      height
    });
  }

  // Draw footer on each page
  if (options.includeBranding) {
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const footerPage = pdfDoc.getPage(i);
      drawFooter({
        page: footerPage,
        startY: 50, // Fixed position from bottom
        width,
        margin,
        data,
        options,
        font: regularFont,
        boldFont,
        textColor,
        primaryColor,
        height: footerPage.getSize().height
      });
    }
  }

  // Add watermark if specified
  if (options.watermark) {
    for (let i = 0; i < pdfDoc.getPageCount(); i++) {
      const watermarkPage = pdfDoc.getPage(i);
      const { width: pageWidth, height: pageHeight } = watermarkPage.getSize();
      
      const watermarkText = typeof options.watermark === 'string' 
        ? options.watermark 
        : 'SAMPLE';
      
      watermarkPage.drawText(watermarkText, {
        x: pageWidth / 2 - 100,
        y: pageHeight / 2,
        size: 60,
        font: boldFont,
        color: rgb(0.8, 0.8, 0.8),
        opacity: 0.3,
        rotate: {
          type: 'degrees',
          angle: -45,
        },
      });
    }
  }

  // Serialize the PDF to bytes
  return await pdfDoc.save();
}

/**
 * Draw the report header and title
 */
function drawHeader(params: SectionParams): number {
  const { page, startY, width, margin, data, options, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;

  // Draw title
  const reportTitle = data.reportTitle || 'Vehicle Valuation Report';
  page.drawText(reportTitle, {
    x: margin,
    y: currentY,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;

  // Draw subtitle if premium
  if (data.premium || data.isPremium) {
    page.drawText('PREMIUM REPORT', {
      x: margin,
      y: currentY,
      size: 16,
      font: boldFont,
      color: rgb(0.8, 0.2, 0.2)
    });
    currentY -= 25;
  }

  // Draw date
  const generatedDate = data.generatedAt 
    ? new Date(data.generatedAt) 
    : new Date();
  
  page.drawText(`Generated on: ${format(generatedDate, 'MMMM d, yyyy')}`, {
    x: margin,
    y: currentY,
    size: 10,
    font: font,
    color: textColor
  });
  currentY -= 20;

  // Draw divider
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
 * Draw the vehicle information section
 */
function drawVehicleInfo(params: SectionParams): number {
  const { page, startY, width, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;

  // Section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;

  // Draw vehicle name
  const vehicleName = `${data.year} ${data.make} ${data.model}${data.trim ? ` ${data.trim}` : ''}`;
  page.drawText(vehicleName, {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: textColor
  });
  currentY -= 25;

  // Draw vehicle details in 2 columns
  const col1X = margin;
  const col2X = width / 2;
  
  // Column 1
  if (data.vin) {
    page.drawText('VIN:', {
      x: col1X,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor
    });
    page.drawText(data.vin, {
      x: col1X + 80,
      y: currentY,
      size: 10,
      font: font,
      color: textColor
    });
  }
  
  // Column 2
  if (data.mileage !== undefined) {
    page.drawText('Mileage:', {
      x: col2X,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor
    });
    page.drawText(`${data.mileage.toLocaleString()} miles`, {
      x: col2X + 80,
      y: currentY,
      size: 10,
      font: font,
      color: textColor
    });
  }
  currentY -= 20;
  
  // Next row
  if (data.condition) {
    page.drawText('Condition:', {
      x: col1X,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor
    });
    page.drawText(data.condition, {
      x: col1X + 80,
      y: currentY,
      size: 10,
      font: font,
      color: textColor
    });
  }
  
  if (data.zipCode) {
    page.drawText('Zip Code:', {
      x: col2X,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor
    });
    page.drawText(data.zipCode, {
      x: col2X + 80,
      y: currentY,
      size: 10,
      font: font,
      color: textColor
    });
  }
  currentY -= 20;

  // Additional details for premium reports
  if (data.premium || data.isPremium) {
    // Transmission
    if (data.transmission) {
      page.drawText('Transmission:', {
        x: col1X,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor
      });
      page.drawText(data.transmission, {
        x: col1X + 80,
        y: currentY,
        size: 10,
        font: font,
        color: textColor
      });
    }

    // Body Style
    if (data.bodyStyle) {
      page.drawText('Body Style:', {
        x: col2X,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor
      });
      page.drawText(data.bodyStyle, {
        x: col2X + 80,
        y: currentY,
        size: 10,
        font: font,
        color: textColor
      });
    }
    currentY -= 20;

    // Color
    if (data.color) {
      page.drawText('Color:', {
        x: col1X,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor
      });
      page.drawText(data.color, {
        x: col1X + 80,
        y: currentY,
        size: 10,
        font: font,
        color: textColor
      });
    }

    // Fuel Type
    if (data.fuelType) {
      page.drawText('Fuel Type:', {
        x: col2X,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor
      });
      page.drawText(data.fuelType, {
        x: col2X + 80,
        y: currentY,
        size: 10,
        font: font,
        color: textColor
      });
    }
    currentY -= 20;

    // Features
    if (data.features && data.features.length > 0) {
      page.drawText('Key Features:', {
        x: col1X,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;

      const featureColumns = 2;
      const featuresPerColumn = Math.ceil(data.features.length / featureColumns);
      
      for (let i = 0; i < featuresPerColumn; i++) {
        for (let col = 0; col < featureColumns; col++) {
          const featureIndex = i + col * featuresPerColumn;
          if (featureIndex < data.features.length) {
            const feature = data.features[featureIndex];
            const xPos = col === 0 ? col1X : col2X;
            
            page.drawText(`• ${feature}`, {
              x: xPos,
              y: currentY,
              size: 9,
              font: font,
              color: textColor
            });
          }
        }
        currentY -= 15;
      }
    }
  }

  // Add space after section
  currentY -= 10;

  // Draw divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw the valuation section
 */
function drawValuationSection(params: SectionParams): number {
  const { page, startY, width, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;

  // Section title
  page.drawText('Valuation', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;

  // Draw estimated value
  const formattedValue = `$${data.estimatedValue.toLocaleString()}`;
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: textColor
  });
  page.drawText(formattedValue, {
    x: margin + 150,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;

  // Draw price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    const formattedMinValue = `$${data.priceRange[0].toLocaleString()}`;
    const formattedMaxValue = `$${data.priceRange[1].toLocaleString()}`;
    
    page.drawText('Price Range:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    page.drawText(`${formattedMinValue} - ${formattedMaxValue}`, {
      x: margin + 150,
      y: currentY,
      size: 12,
      font: font,
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
      font: boldFont,
      color: textColor
    });
    
    // Draw confidence score as text
    page.drawText(`${data.confidenceScore}%`, {
      x: margin + 150,
      y: currentY,
      size: 12,
      font: font,
      color: textColor
    });
    
    // Draw confidence score as a bar
    const barWidth = 200;
    const barHeight = 15;
    const barX = margin + 150;
    const barY = currentY - 15;
    
    // Draw background bar
    page.drawRectangle({
      x: barX,
      y: barY,
      width: barWidth,
      height: barHeight,
      color: rgb(0.9, 0.9, 0.9)
    });
    
    // Draw filled portion of bar
    const fillWidth = (data.confidenceScore / 100) * barWidth;
    page.drawRectangle({
      x: barX,
      y: barY,
      width: fillWidth,
      height: barHeight,
      color: primaryColor
    });
    
    currentY -= 30;
  }

  // Add space after section
  currentY -= 10;

  // Draw divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw the adjustments section
 */
function drawAdjustmentsSection(params: SectionParams): number {
  const { page, startY, width, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;

  if (!data.adjustments || data.adjustments.length === 0) {
    return currentY;
  }

  // Section title
  page.drawText('Value Adjustments', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;

  // Draw table header
  const col1X = margin;
  const col2X = margin + 250;
  const col3X = margin + 350;
  
  page.drawText('Factor', {
    x: col1X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Description', {
    x: col2X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Impact', {
    x: col3X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  currentY -= 15;
  
  // Draw header separator line
  page.drawLine({
    start: { x: col1X, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 15;

  // Draw adjustments
  for (const adjustment of data.adjustments) {
    // Check if we need to start a new page
    if (currentY < 100) {
      // Add a new page
      const newPage = params.page.document.addPage([width, params.height || 792]);
      params.page = newPage;
      page = newPage;
      currentY = params.height ? params.height - margin : 742;
      
      // Redraw the header
      page.drawText('Value Adjustments (continued)', {
        x: margin,
        y: currentY,
        size: 18,
        font: boldFont,
        color: primaryColor
      });
      currentY -= 25;
      
      // Redraw table header
      page.drawText('Factor', {
        x: col1X,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      
      page.drawText('Description', {
        x: col2X,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      
      page.drawText('Impact', {
        x: col3X,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      
      currentY -= 15;
      
      // Draw header separator line
      page.drawLine({
        start: { x: col1X, y: currentY },
        end: { x: width - margin, y: currentY },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8)
      });
      currentY -= 15;
    }
    
    // Draw factor
    page.drawText(adjustment.factor, {
      x: col1X,
      y: currentY,
      size: 10,
      font: font,
      color: textColor
    });
    
    // Draw description (with text wrapping if needed)
    if (adjustment.description) {
      const descriptionText = adjustment.description;
      const maxWidth = col3X - col2X - 10;
      
      // Simplified text wrapping
      if (descriptionText.length > 30) {
        const firstPart = descriptionText.substring(0, 30);
        const secondPart = descriptionText.substring(30);
        
        page.drawText(firstPart, {
          x: col2X,
          y: currentY,
          size: 10,
          font: font,
          color: textColor
        });
        
        currentY -= 15;
        
        page.drawText(secondPart, {
          x: col2X,
          y: currentY,
          size: 10,
          font: font,
          color: textColor
        });
      } else {
        page.drawText(descriptionText, {
          x: col2X,
          y: currentY,
          size: 10,
          font: font,
          color: textColor
        });
      }
    }
    
    // Draw impact value
    const impactValue = adjustment.impact;
    const impactText = impactValue >= 0 
      ? `+$${impactValue.toLocaleString()}`
      : `-$${Math.abs(impactValue).toLocaleString()}`;
    
    const impactColor = impactValue >= 0
      ? rgb(0.2, 0.6, 0.2) // Green for positive
      : rgb(0.8, 0.2, 0.2); // Red for negative
      
    page.drawText(impactText, {
      x: col3X,
      y: currentY,
      size: 10,
      font: boldFont,
      color: impactColor
    });
    
    currentY -= 25;
  }

  // Draw total adjustments
  const totalAdjustment = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const totalText = totalAdjustment >= 0 
    ? `+$${totalAdjustment.toLocaleString()}`
    : `-$${Math.abs(totalAdjustment).toLocaleString()}`;
  
  const totalColor = totalAdjustment >= 0
    ? rgb(0.2, 0.6, 0.2) // Green for positive
    : rgb(0.8, 0.2, 0.2); // Red for negative
  
  // Draw a line above the total
  page.drawLine({
    start: { x: col3X, y: currentY + 10 },
    end: { x: width - margin, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  page.drawText('Total Adjustments:', {
    x: col2X,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(totalText, {
    x: col3X,
    y: currentY,
    size: 10,
    font: boldFont,
    color: totalColor
  });
  
  currentY -= 25;

  // Add space after section
  currentY -= 10;

  // Draw divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw the explanation section
 */
function drawExplanationSection(params: SectionParams): number {
  const { page, startY, width, margin, data, font, boldFont, italicFont, textColor, primaryColor } = params;
  let currentY = startY;

  if (!data.explanation) {
    return currentY;
  }

  // Section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;

  // Draw explanation text with simple word wrapping
  const explanation = data.explanation;
  const maxWidth = width - (2 * margin);
  const words = explanation.split(' ');
  let line = '';
  
  for (const word of words) {
    const testLine = line ? line + ' ' + word : word;
    const testLineWidth = font.widthOfTextAtSize(testLine, 10);
    
    if (testLineWidth > maxWidth) {
      // Draw the current line
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 10,
        font: font,
        color: textColor
      });
      currentY -= 15;
      
      // Start a new line
      line = word;
      
      // Check if we need a new page
      if (currentY < 100) {
        // Add a new page
        const newPage = params.page.document.addPage([width, params.height || 792]);
        params.page = newPage;
        page = newPage;
        currentY = params.height ? params.height - margin : 742;
        
        // Redraw the header
        page.drawText('Valuation Explanation (continued)', {
          x: margin,
          y: currentY,
          size: 18,
          font: boldFont,
          color: primaryColor
        });
        currentY -= 25;
      }
    } else {
      // Add the word to the current line
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 10,
      font: font,
      color: textColor
    });
    currentY -= 15;
  }

  // Add space after section
  currentY -= 20;

  // Draw divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw the photo assessment section
 */
function drawPhotoAssessmentSection(params: SectionParams): number {
  const { page, startY, width, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = startY;

  // Skip if no photo data
  if (!data.photoUrl || data.photoScore === undefined) {
    return currentY;
  }

  // Section title
  page.drawText('Photo Assessment', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;

  // Unfortunately we can't embed images directly with pdf-lib in this context
  // So we'll just add a placeholder and information about the photo score
  
  // Draw photo score
  page.drawText('Photo Quality Score:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(`${data.photoScore}/100`, {
    x: margin + 150,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  currentY -= 20;

  // Draw AI condition assessment if available
  if (data.aiCondition) {
    page.drawText('AI Condition Assessment:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    page.drawText(data.aiCondition.condition || 'Not available', {
      x: margin + 150,
      y: currentY,
      size: 12,
      font: font,
      color: textColor
    });
    currentY -= 20;
    
    // Add AI confidence score if available
    if (data.aiCondition.confidenceScore !== undefined) {
      page.drawText('AI Confidence:', {
        x: margin,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      
      page.drawText(`${data.aiCondition.confidenceScore}%`, {
        x: margin + 150,
        y: currentY,
        size: 12,
        font: font,
        color: textColor
      });
      currentY -= 20;
    }
    
    // Add issues detected if available
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;
      
      for (const issue of data.aiCondition.issuesDetected) {
        page.drawText(`• ${issue}`, {
          x: margin + 20,
          y: currentY,
          size: 10,
          font: font,
          color: textColor
        });
        currentY -= 15;
      }
    }
    
    // Add summary if available
    if (data.aiCondition.summary) {
      page.drawText('Summary:', {
        x: margin,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      currentY -= 15;
      
      // Simple word wrapping for summary
      const summary = data.aiCondition.summary;
      const maxWidth = width - (2 * margin) - 20;
      const words = summary.split(' ');
      let line = '';
      
      for (const word of words) {
        const testLine = line ? line + ' ' + word : word;
        const testLineWidth = font.widthOfTextAtSize(testLine, 10);
        
        if (testLineWidth > maxWidth) {
          // Draw the current line
          page.drawText(line, {
            x: margin + 20,
            y: currentY,
            size: 10,
            font: font,
            color: textColor
          });
          currentY -= 15;
          
          // Start a new line
          line = word;
        } else {
          // Add the word to the current line
          line = testLine;
        }
      }
      
      // Draw the last line
      if (line) {
        page.drawText(line, {
          x: margin + 20,
          y: currentY,
          size: 10,
          font: font,
          color: textColor
        });
        currentY -= 15;
      }
    }
  }

  // Add space after section
  currentY -= 15;

  // Draw divider
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: width - margin, y: currentY },
    thickness: 1,
    color: rgb(0.9, 0.9, 0.9)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw the footer on each page
 */
function drawFooter(params: SectionParams): void {
  const { page, startY, width, margin, data, options, font, textColor } = params;
  const footerY = startY;

  // Draw company name if available
  const companyName = data.companyName || 'Car Detective';
  page.drawText(companyName, {
    x: margin,
    y: footerY,
    size: 8,
    font: font,
    color: textColor
  });
  
  // Draw website if available
  const website = data.website || 'www.cardetective.com';
  const websiteWidth = font.widthOfTextAtSize(website, 8);
  page.drawText(website, {
    x: width - margin - websiteWidth,
    y: footerY,
    size: 8,
    font: font,
    color: textColor
  });
  
  // Draw disclaimer if available
  if (data.disclaimerText) {
    const disclaimer = data.disclaimerText;
    const disclaimerY = footerY - 15;
    
    page.drawText(disclaimer, {
      x: margin,
      y: disclaimerY,
      size: 6,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
}
