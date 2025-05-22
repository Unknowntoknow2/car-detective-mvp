
import { PDFDocument, rgb, StandardFonts, PDFFont, PDFPage, PDFPageDrawTextOptions } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams, ReportGeneratorParams } from '../types';

/**
 * Generate a premium report PDF
 */
export async function generatePremiumReport({ data, options }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();

  // Embed the standard fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

  // Create a new page
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  
  // Set colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0, 0.4, 0.8);
  
  // Define margins and width
  const margin = 50;
  const width = page.getWidth() - (margin * 2);
  const height = page.getHeight();

  // Initialize the current Y position for content layout
  let currentY: number = height - margin;

  // Draw premium header
  currentY = drawPremiumHeader({
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
    italicFont,
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
    italicFont,
    textColor,
    primaryColor,
    height
  });

  // Draw price breakdown
  currentY = drawPriceBreakdown({
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

  // Draw condition assessment if available
  if (data.aiCondition) {
    currentY = drawConditionAssessment({
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

  // Draw explanation if available and option is enabled
  if (data.explanation && options.includeExplanation) {
    currentY = drawExplanation({
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

  // Draw footer
  currentY = drawFooter({
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

  // Draw watermark if needed
  if (options.watermark) {
    drawWatermark({
      page,
      startY: height / 2,
      width,
      margin,
      data,
      options,
      font: boldFont,
      boldFont,
      italicFont,
      textColor: rgb(0.8, 0.8, 0.8),
      primaryColor,
      height
    });
  }

  // Serialize the PDF to bytes
  return await pdfDoc.save();
}

/**
 * Draw premium report header
 */
function drawPremiumHeader(params: SectionParams): number {
  const { page, startY, margin, width, data, boldFont, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Draw title
  page.drawText('PREMIUM VEHICLE VALUATION REPORT', {
    x: margin,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;

  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 2,
    color: primaryColor
  });
  currentY -= 10;

  // Report title if available, otherwise generate one
  const title = data.reportTitle || `${data.year} ${data.make} ${data.model} Valuation`;
  page.drawText(title, {
    x: margin,
    y: currentY,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  currentY -= 40;

  // Date generated
  if (data.generatedAt) {
    const date = new Date(data.generatedAt);
    const formattedDate = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    page.drawText(`Report Generated: ${formattedDate}`, {
      x: margin,
      y: currentY,
      size: 10,
      font: boldFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    currentY -= 20;
  }

  return currentY;
}

/**
 * Draw vehicle information
 */
function drawVehicleInfo(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Section title
  page.drawText('VEHICLE INFORMATION', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 20;

  // Draw vehicle info in a grid layout
  const col1X = margin;
  const col2X = margin + (width / 2);
  const rowHeight = 20;

  // Row 1
  page.drawText('Make:', {
    x: col1X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.make, {
    x: col1X + 100,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  
  page.drawText('Year:', {
    x: col2X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.year.toString(), {
    x: col2X + 100,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  currentY -= rowHeight;

  // Row 2
  page.drawText('Model:', {
    x: col1X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.model, {
    x: col1X + 100,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  
  page.drawText('Mileage:', {
    x: col2X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.mileage.toLocaleString(), {
    x: col2X + 100,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  currentY -= rowHeight;

  // Row 3
  page.drawText('VIN:', {
    x: col1X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.vin || 'Not Provided', {
    x: col1X + 100,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  
  page.drawText('Condition:', {
    x: col2X,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.condition, {
    x: col2X + 100,
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  currentY -= rowHeight;

  // Row 4 - Add more details if available
  if (data.transmission || data.bodyStyle || data.color || data.fuelType) {
    if (data.transmission) {
      page.drawText('Transmission:', {
        x: col1X,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      
      page.drawText(data.transmission, {
        x: col1X + 100,
        y: currentY,
        size: 12,
        font: font,
        color: textColor
      });
    }
    
    if (data.bodyStyle) {
      page.drawText('Body Style:', {
        x: col2X,
        y: currentY,
        size: 12,
        font: boldFont,
        color: textColor
      });
      
      page.drawText(data.bodyStyle, {
        x: col2X + 100,
        y: currentY,
        size: 12,
        font: font,
        color: textColor
      });
    }
    currentY -= rowHeight;
  }

  // Add some spacing after the section
  currentY -= 20;

  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw valuation section
 */
function drawValuationSection(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Section title
  page.drawText('VALUATION SUMMARY', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 20;

  // Draw valuation amount with large font
  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  currentY -= 15;

  const valueStr = `$${data.estimatedValue.toLocaleString()}`;
  page.drawText(valueStr, {
    x: margin,
    y: currentY,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;

  // Price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    page.drawText('Estimated Price Range:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 15;

    const rangeStr = `$${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`;
    page.drawText(rangeStr, {
      x: margin,
      y: currentY,
      size: 16,
      font: font,
      color: textColor
    });
    currentY -= 20;
  }

  // Confidence score if available
  if (data.confidenceScore !== undefined) {
    page.drawText('Confidence Score:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 15;

    // Draw confidence score as percentage
    const scoreStr = `${data.confidenceScore}%`;
    page.drawText(scoreStr, {
      x: margin,
      y: currentY,
      size: 16,
      font: font,
      color: textColor
    });
    
    // Draw confidence bar
    const barWidth = 200;
    const barHeight = 10;
    const filledWidth = (data.confidenceScore / 100) * barWidth;
    
    // Draw background bar
    page.drawRectangle({
      x: margin + 100,
      y: currentY,
      width: barWidth,
      height: barHeight,
      color: rgb(0.9, 0.9, 0.9)
    });
    
    // Draw filled portion
    page.drawRectangle({
      x: margin + 100,
      y: currentY,
      width: filledWidth,
      height: barHeight,
      color: primaryColor
    });
    currentY -= 30;
  }

  // Add some spacing after the section
  currentY -= 10;

  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw price breakdown
 */
function drawPriceBreakdown(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Only draw if adjustments are available
  if (!data.adjustments || data.adjustments.length === 0) {
    return currentY;
  }

  // Section title
  page.drawText('PRICE BREAKDOWN', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 20;

  // Base price row
  page.drawText('Base Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  // Calculate base price (total - all adjustments)
  const totalAdjustments = data.adjustments.reduce((sum, adj) => sum + adj.impact, 0);
  const basePrice = data.estimatedValue - totalAdjustments;
  
  // Format and draw base price
  const basePriceStr = `$${basePrice.toLocaleString()}`;
  page.drawText(basePriceStr, {
    x: margin + width - font.widthOfTextAtSize(basePriceStr, 12),
    y: currentY,
    size: 12,
    font: font,
    color: textColor
  });
  currentY -= 20;

  // Draw each adjustment
  for (const adjustment of data.adjustments) {
    page.drawText(adjustment.factor + ':', {
      x: margin + 20,
      y: currentY,
      size: 12,
      font: font,
      color: textColor
    });
    
    // Format adjustment impact
    const impactStr = (adjustment.impact >= 0 ? '+' : '') + `$${adjustment.impact.toLocaleString()}`;
    
    // Determine color based on impact
    const impactColor = adjustment.impact >= 0 ? rgb(0, 0.6, 0.3) : rgb(0.8, 0.2, 0.2);
    
    // Draw impact amount
    page.drawText(impactStr, {
      x: margin + width - font.widthOfTextAtSize(impactStr, 12),
      y: currentY,
      size: 12,
      font: font,
      color: impactColor
    });
    
    // Draw description if available
    if (adjustment.description) {
      let descY = currentY - 15;
      
      // Split long descriptions into multiple lines
      const words = adjustment.description.split(' ');
      let line = '';
      const maxWidth = width - 40;
      
      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const testWidth = font.widthOfTextAtSize(testLine, 10);
        
        if (testWidth > maxWidth && line) {
          // Draw current line and move to next
          page.drawText(line, {
            x: margin + 40,
            y: descY,
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5)
          });
          line = word;
          descY -= 12;
        } else {
          line = testLine;
        }
      }
      
      // Draw last line
      if (line) {
        page.drawText(line, {
          x: margin + 40,
          y: descY,
          size: 10,
          font: font,
          color: rgb(0.5, 0.5, 0.5)
        });
      }
      
      // Update current Y position
      currentY = Math.min(descY, currentY) - 20;
    } else {
      currentY -= 20;
    }
  }

  // Total value row
  page.drawLine({
    start: { x: margin + width - 150, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 5;

  page.drawText('Estimated Value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  const totalStr = `$${data.estimatedValue.toLocaleString()}`;
  page.drawText(totalStr, {
    x: margin + width - boldFont.widthOfTextAtSize(totalStr, 12),
    y: currentY,
    size: 12,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;

  // Add some spacing after the section
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw condition assessment
 */
function drawConditionAssessment(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Only draw if AI condition data is available
  if (!data.aiCondition) {
    return currentY;
  }

  // Section title
  page.drawText('CONDITION ASSESSMENT', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 20;

  // Condition summary
  if (data.aiCondition.summary) {
    page.drawText('Summary:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 15;
    
    // Split summary into multiple lines if needed
    const words = data.aiCondition.summary.split(' ');
    let line = '';
    const maxWidth = width;
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const testWidth = font.widthOfTextAtSize(testLine, 12);
      
      if (testWidth > maxWidth && line) {
        // Draw current line and move to next
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 12,
          font: font,
          color: textColor
        });
        line = word;
        currentY -= 15;
      } else {
        line = testLine;
      }
    }
    
    // Draw last line
    if (line) {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 12,
        font: font,
        color: textColor
      });
    }
    currentY -= 25;
  }

  // Issues detected
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 15;
    
    // List each issue
    for (const issue of data.aiCondition.issuesDetected) {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y: currentY,
        size: 12,
        font: font,
        color: textColor
      });
      currentY -= 15;
    }
    currentY -= 10;
  }

  // Photo assessment if enabled and photo score is available
  if (options.includePhotoAssessment && data.photoScore !== undefined && data.photoUrl) {
    page.drawText('Photo Assessment:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 15;
    
    // Display photo score
    const scoreText = `Quality Score: ${data.photoScore}%`;
    page.drawText(scoreText, {
      x: margin + 10,
      y: currentY,
      size: 12,
      font: font,
      color: textColor
    });
    currentY -= 30;
    
    // Add note about photo assessment
    const photoNote = 'Note: Photo quality may affect valuation accuracy. Higher quality photos enable more precise condition assessment.';
    
    // Split note into multiple lines
    const words = photoNote.split(' ');
    let line = '';
    const maxWidth = width - 20;
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const testWidth = font.widthOfTextAtSize(testLine, 10);
      
      if (testWidth > maxWidth && line) {
        // Draw current line and move to next
        page.drawText(line, {
          x: margin + 10,
          y: currentY,
          size: 10,
          font: font,
          color: rgb(0.5, 0.5, 0.5)
        });
        line = word;
        currentY -= 12;
      } else {
        line = testLine;
      }
    }
    
    // Draw last line
    if (line) {
      page.drawText(line, {
        x: margin + 10,
        y: currentY,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
    }
    currentY -= 20;
  }

  // Add some spacing after the section
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw explanation section
 */
function drawExplanation(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Only draw if explanation is available
  if (!data.explanation) {
    return currentY;
  }

  // Section title
  page.drawText('VALUATION EXPLANATION', {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 20;

  // Split explanation into multiple lines
  const words = data.explanation.split(' ');
  let line = '';
  const maxWidth = width;
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const testWidth = font.widthOfTextAtSize(testLine, 11);
    
    if (testWidth > maxWidth && line) {
      // Draw current line and move to next
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 11,
        font: font,
        color: textColor
      });
      line = word;
      currentY -= 16;
    } else {
      line = testLine;
    }
  }
  
  // Draw last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 11,
      font: font,
      color: textColor
    });
  }
  currentY -= 30;

  // Add some spacing after the section
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 20;

  return currentY;
}

/**
 * Draw footer section
 */
function drawFooter(params: SectionParams): number {
  const { page, startY, margin, width, data, font, boldFont, textColor, primaryColor, height } = params;
  
  // Ensure startY is properly initialized
  let currentY = startY;

  // Ensure we're near the bottom of the page
  if (currentY > 100) {
    currentY = 100;
  }

  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: currentY + 10 },
    end: { x: margin + width, y: currentY + 10 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  currentY -= 15;

  // Disclaimer text
  const disclaimerText = data.disclaimerText || 
    'This valuation is an estimate based on the information provided and market data. ' +
    'Actual sale prices may vary. This report is not a guarantee of sale price.';
  
  // Split disclaimer into multiple lines
  const words = disclaimerText.split(' ');
  let line = '';
  const maxWidth = width;
  
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const testWidth = font.widthOfTextAtSize(testLine, 9);
    
    if (testWidth > maxWidth && line) {
      // Draw current line and move to next
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
      line = word;
      currentY -= 11;
    } else {
      line = testLine;
    }
  }
  
  // Draw last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 9,
      font: font,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
  currentY -= 20;

  // Company info
  const companyName = data.companyName || 'Car Detective';
  page.drawText(companyName, {
    x: margin,
    y: currentY,
    size: 10,
    font: boldFont,
    color: primaryColor
  });
  
  // Website if available
  if (data.website) {
    const websiteText = `Visit us at: ${data.website}`;
    page.drawText(websiteText, {
      x: margin + width - font.widthOfTextAtSize(websiteText, 10),
      y: currentY,
      size: 10,
      font: font,
      color: primaryColor
    });
  }
  currentY -= 15;

  // Page number
  const pageText = 'Page 1 of 1';
  page.drawText(pageText, {
    x: margin + width - font.widthOfTextAtSize(pageText, 9),
    y: margin / 2,
    size: 9,
    font: font,
    color: rgb(0.5, 0.5, 0.5)
  });

  return currentY;
}

/**
 * Draw watermark
 */
function drawWatermark(params: SectionParams): void {
  const { page, startY, width, margin, options, boldFont, textColor, height } = params;
  
  // Ensure we have a valid watermark text
  const watermarkText = typeof options.watermark === 'string' ? options.watermark : 'SAMPLE';
  
  // Calculate center position
  const pageWidth = page.getWidth();
  const pageHeight = page.getHeight();
  const centerX = pageWidth / 2;
  const centerY = pageHeight / 2;
  
  // Draw rotated, semi-transparent text
  const watermarkSize = 72;
  const textWidth = boldFont.widthOfTextAtSize(watermarkText, watermarkSize);
  
  // Create the page content with transparency
  page.drawText(watermarkText, {
    x: centerX - textWidth / 2,
    y: centerY,
    size: watermarkSize,
    font: boldFont,
    color: rgb(0.8, 0.8, 0.8, 0.3),
    rotate: {
      type: 'degrees',
      angle: -45
    }
  });
}
