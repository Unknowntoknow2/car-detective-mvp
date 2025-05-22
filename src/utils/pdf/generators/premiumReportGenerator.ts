
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams, ReportGeneratorParams } from '../types';
import { drawWatermark } from '../sections/watermark';

/**
 * Generates a premium report with all the features
 */
export async function generatePremiumReport(
  params: ReportGeneratorParams
): Promise<Uint8Array> {
  const { data, options } = params;
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Load the standard fonts
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Add a new page
  const page = pdfDoc.addPage([612, 792]); // Standard US Letter size
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.0, 0.3, 0.6);
  
  // Get page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  
  // Start position from the top of the page
  let y = height - margin;
  
  // Common parameters for all sections
  const sectionParams: SectionParams = {
    page,
    startY: y,
    width,
    margin,
    data,
    options,
    font,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    regularFont: font,
  };
  
  // Draw watermark if specified
  if (options.watermark) {
    drawWatermark(sectionParams, typeof options.watermark === 'string' ? options.watermark : 'SAMPLE REPORT');
  }
  
  // Draw header section
  y = drawHeaderSection({...sectionParams, y});
  
  // Draw vehicle info section
  y = drawVehicleInfoSection({...sectionParams, y});
  
  // Draw valuation section
  y = drawValuationSection({...sectionParams, y});
  
  // Draw adjustment table if data has adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    y = drawAdjustmentTable({...sectionParams, y});
  }
  
  // Add a page break if we're running out of space for photo assessment
  if (y < 300 && options.includePhotoAssessment && data.aiCondition) {
    // Draw footer on current page
    drawFooterSection(sectionParams);
    
    // Add a new page
    const newPage = pdfDoc.addPage([612, 792]);
    page = newPage;
    y = height - margin;
    
    // Update section params with new page
    sectionParams.page = page;
    sectionParams.startY = y;
    
    // Draw watermark on new page if needed
    if (options.watermark) {
      drawWatermark({...sectionParams}, typeof options.watermark === 'string' ? options.watermark : 'SAMPLE REPORT');
    }
  }
  
  // Draw photo assessment section if applicable
  if (options.includePhotoAssessment && data.aiCondition) {
    y = drawPhotoAssessmentSection({...sectionParams, y});
  }
  
  // Draw explanation section if applicable
  if (options.includeExplanation && data.explanation) {
    y = drawExplanationSection({...sectionParams, y});
  }
  
  // Draw disclaimer section
  y = drawDisclaimerSection({...sectionParams, y});
  
  // Draw footer section
  drawFooterSection(sectionParams);
  
  // Return the PDF as a byte array
  return await pdfDoc.save();
}

// Helper function to draw the header section
function drawHeaderSection(params: SectionParams): number {
  const { page, y, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw title
  page.drawText(data.reportTitle || 'Vehicle Valuation Report', {
    x: margin,
    y: currentY,
    size: 20,
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
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY; // Return the new Y position
}

// Helper function to draw the vehicle info section
function drawVehicleInfoSection(params: SectionParams): number {
  const { page, y, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = y;
  
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
  const vehicleName = `${data.year} ${data.make} ${data.model}${data.trim ? ' ' + data.trim : ''}`;
  page.drawText(vehicleName, {
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
  
  // VIN
  if (data.vin) {
    drawDetail('VIN:', data.vin);
  }
  
  // Mileage
  if (data.mileage) {
    drawDetail('Mileage:', `${data.mileage.toLocaleString()} miles`);
  }
  
  // Transmission
  if (data.transmission) {
    drawDetail('Transmission:', data.transmission);
  }
  
  // Body Style
  if (data.bodyStyle) {
    drawDetail('Body Style:', data.bodyStyle);
  }
  
  // Condition
  if (data.condition) {
    drawDetail('Condition:', data.condition);
  }
  
  // Location
  if (data.zipCode) {
    drawDetail('Location:', `ZIP: ${data.zipCode}${data.regionName ? ' (' + data.regionName + ')' : ''}`);
  }
  
  currentY -= 10; // Add some space after the table
  
  return currentY; // Return the new Y position
}

// Helper function to draw the valuation section
function drawValuationSection(params: SectionParams): number {
  const { page, y, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Valuation Summary', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Draw the estimated value
  const estimatedValue = data.price || data.estimatedValue;
  const valueText = `$${estimatedValue.toLocaleString()}`;
  const valueWidth = boldFont.widthOfTextAtSize(valueText, 24);
  
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText(valueText, {
    x: margin,
    y: currentY - 25,
    size: 24,
    font: boldFont,
    color: primaryColor,
  });
  
  // Draw confidence indicator if available
  if (data.confidenceScore) {
    const confidenceWidth = 100;
    const confidenceHeight = 10;
    const confidenceX = margin + valueWidth + 20;
    const confidenceY = currentY - 25;
    
    // Draw the confidence bar background
    page.drawRectangle({
      x: confidenceX,
      y: confidenceY,
      width: confidenceWidth,
      height: confidenceHeight,
      color: rgb(0.9, 0.9, 0.9),
    });
    
    // Draw the confidence level
    const confidenceLevel = Math.min(100, Math.max(0, data.confidenceScore));
    page.drawRectangle({
      x: confidenceX,
      y: confidenceY,
      width: (confidenceLevel / 100) * confidenceWidth,
      height: confidenceHeight,
      color: primaryColor,
    });
    
    // Draw confidence label
    page.drawText(`${confidenceLevel}% Confidence`, {
      x: confidenceX,
      y: confidenceY + 15,
      size: 8,
      font: font,
      color: textColor,
    });
  }
  
  currentY -= 60;
  
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
      x: margin + 100,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY; // Return the new Y position
}

// Helper function to draw the adjustment table
function drawAdjustmentTable(params: SectionParams): number {
  const { page, y, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Value Adjustments', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  // Column headers
  page.drawText('Factor', {
    x: margin,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Impact', {
    x: margin + 200,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  page.drawText('Description', {
    x: margin + 300,
    y: currentY,
    size: 10,
    font: boldFont,
    color: textColor,
  });
  
  // Draw a horizontal line
  page.drawLine({
    start: { x: margin, y: currentY - 5 },
    end: { x: page.getWidth() - margin, y: currentY - 5 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 20;
  
  // Draw each adjustment
  if (data.adjustments && data.adjustments.length > 0) {
    data.adjustments.forEach((adjustment) => {
      const impactText = adjustment.impact > 0 
        ? `+$${adjustment.impact.toLocaleString()}`
        : `-$${Math.abs(adjustment.impact).toLocaleString()}`;
      
      page.drawText(adjustment.factor, {
        x: margin,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
      
      page.drawText(impactText, {
        x: margin + 200,
        y: currentY,
        size: 9,
        font: font,
        color: adjustment.impact > 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
      });
      
      if (adjustment.description) {
        page.drawText(adjustment.description, {
          x: margin + 300,
          y: currentY,
          size: 9,
          font: font,
          color: textColor,
        });
      }
      
      currentY -= 15;
    });
    
    // Draw a horizontal line
    page.drawLine({
      start: { x: margin, y: currentY - 5 },
      end: { x: page.getWidth() - margin, y: currentY - 5 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });
    
    currentY -= 10;
    
    // Draw total
    const totalAdjustment = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
    const totalText = totalAdjustment > 0 
      ? `+$${totalAdjustment.toLocaleString()}`
      : `-$${Math.abs(totalAdjustment).toLocaleString()}`;
    
    page.drawText('Total Adjustments:', {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText(totalText, {
      x: margin + 200,
      y: currentY,
      size: 10,
      font: boldFont,
      color: totalAdjustment > 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0),
    });
    
    currentY -= 30;
  }
  
  return currentY; // Return the new Y position
}

// Helper function to draw the photo assessment section
function drawPhotoAssessmentSection(params: SectionParams): number {
  const { page, y, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  if (data.aiCondition) {
    // Draw condition score
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
      
      currentY -= 20;
    }
    
    // Draw confidence score
    if (data.aiCondition.confidenceScore) {
      page.drawText('Confidence:', {
        x: margin,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      page.drawText(`${data.aiCondition.confidenceScore}%`, {
        x: margin + 150,
        y: currentY,
        size: 10,
        font: font,
        color: textColor,
      });
      
      currentY -= 20;
    }
    
    // Draw issues detected
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      currentY -= 15;
      
      data.aiCondition.issuesDetected.forEach((issue: string) => {
        page.drawText(`• ${issue}`, {
          x: margin + 20,
          y: currentY,
          size: 9,
          font: font,
          color: textColor,
        });
        
        currentY -= 15;
      });
      
      currentY -= 5;
    }
    
    // Draw summary
    if (data.aiCondition.summary) {
      page.drawText('Summary:', {
        x: margin,
        y: currentY,
        size: 10,
        font: boldFont,
        color: textColor,
      });
      
      currentY -= 15;
      
      // Simple word wrap for summary text
      const maxWidth = page.getWidth() - (margin * 2);
      const words = data.aiCondition.summary.split(' ');
      let line = '';
      
      words.forEach((word) => {
        const testLine = line ? `${line} ${word}` : word;
        const lineWidth = font.widthOfTextAtSize(testLine, 9);
        
        if (lineWidth > maxWidth) {
          page.drawText(line, {
            x: margin,
            y: currentY,
            size: 9,
            font: font,
            color: textColor,
          });
          
          currentY -= 15;
          line = word;
        } else {
          line = testLine;
        }
      });
      
      if (line) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 9,
          font: font,
          color: textColor,
        });
        
        currentY -= 20;
      }
    }
  } else {
    page.drawText('No photo assessment available.', {
      x: margin,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY; // Return the new Y position
}

// Helper function to draw the explanation section
function drawExplanationSection(params: SectionParams): number {
  const { page, y, margin, data, font, boldFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  currentY -= 25;
  
  if (data.explanation) {
    // Simple word wrap for explanation text
    const maxWidth = page.getWidth() - (margin * 2);
    const words = data.explanation.split(' ');
    let line = '';
    
    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;
      const lineWidth = font.widthOfTextAtSize(testLine, 9);
      
      if (lineWidth > maxWidth) {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 9,
          font: font,
          color: textColor,
        });
        
        currentY -= 15;
        line = word;
      } else {
        line = testLine;
      }
    });
    
    if (line) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 9,
        font: font,
        color: textColor,
      });
      
      currentY -= 20;
    }
  } else {
    page.drawText('No explanation available.', {
      x: margin,
      y: currentY,
      size: 10,
      font: font,
      color: textColor,
    });
    
    currentY -= 20;
  }
  
  return currentY; // Return the new Y position
}

// Helper function to draw the disclaimer section
function drawDisclaimerSection(params: SectionParams): number {
  const { page, y, margin, data, font, textColor } = params;
  let currentY = y;
  
  // Draw a horizontal line
  page.drawLine({
    start: { x: margin, y: currentY },
    end: { x: page.getWidth() - margin, y: currentY },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  currentY -= 20;
  
  // Get disclaimer text or use default
  const disclaimerText = data.disclaimerText || 
    'This valuation is an estimate based on available data and market conditions at the time of generation. ' +
    'Actual sale prices may vary. Not a substitute for professional appraisal.';
  
  // Simple word wrap for disclaimer text
  const maxWidth = page.getWidth() - (margin * 2);
  const words = disclaimerText.split(' ');
  let line = '';
  
  words.forEach((word) => {
    const testLine = line ? `${line} ${word}` : word;
    const lineWidth = font.widthOfTextAtSize(testLine, 8);
    
    if (lineWidth > maxWidth) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 8,
        font: font,
        color: textColor,
        opacity: 0.7,
      });
      
      currentY -= 12;
      line = word;
    } else {
      line = testLine;
    }
  });
  
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 8,
      font: font,
      color: textColor,
      opacity: 0.7,
    });
    
    currentY -= 15;
  }
  
  return currentY; // Return the new Y position
}

// Helper function to draw the footer section
function drawFooterSection(params: SectionParams): void {
  const { page, margin, font, textColor } = params;
  
  const { width, height } = page.getSize();
  const footerY = 20; // 20 points from bottom
  
  // Draw a thin line above the footer
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Company info
  const companyName = params.data.companyName || 'Car Detective';
  const copyright = `© ${new Date().getFullYear()} ${companyName}`;
  
  page.drawText(copyright, {
    x: margin,
    y: footerY,
    size: 8,
    font: font,
    color: textColor,
    opacity: 0.7,
  });
  
  // Website if available
  if (params.data.website) {
    const websiteText = params.data.website;
    const websiteWidth = font.widthOfTextAtSize(websiteText, 8);
    
    page.drawText(websiteText, {
      x: width - margin - websiteWidth,
      y: footerY,
      size: 8,
      font: font,
      color: textColor,
      opacity: 0.7,
    });
  }
}
