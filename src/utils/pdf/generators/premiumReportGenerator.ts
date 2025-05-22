
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ReportData, ReportOptions, SectionParams, ReportGeneratorParams } from '../types';
import { mvpPdfStyles } from '../styles';
import { drawStyledHeading, drawStyledBox } from '../styles';
import { drawHorizontalLine } from '../components/pdfCommon';

/**
 * Generate a premium valuation report
 */
export async function generatePremiumReport({ data, options }: ReportGeneratorParams): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Load fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  // Add a page
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  
  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.608, 0.529, 0.961); // MVP primary color
  
  // Set margin
  const margin = 50;
  
  // Create the parameter object for the sections
  const sectionParams: SectionParams = {
    page,
    startY: height - margin,
    width: width - (margin * 2),
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    regularFont: regularFont,
    height, // Pass height from the page size
  };
  
  // Draw report sections
  let currentY = drawHeader(sectionParams);
  
  // Update the Y position
  sectionParams.y = currentY;
  
  // Draw vehicle information section
  currentY = drawVehicleInfo(sectionParams);
  
  // Update the Y position
  sectionParams.y = currentY;
  
  // Draw valuation section
  currentY = drawValuation(sectionParams);
  
  // Update the Y position
  sectionParams.y = currentY;
  
  // Draw adjustments section if we have adjustments
  if (data.adjustments && data.adjustments.length > 0) {
    // Create a new page if needed
    if (currentY < height / 2) {
      const newPage = pdfDoc.addPage();
      sectionParams.page = newPage;
      sectionParams.y = height - margin;
      currentY = height - margin;
    }
    
    currentY = drawAdjustments(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Draw explanation section if included
  if (options.includeExplanation && data.explanation) {
    // Create a new page if needed
    if (currentY < height / 3) {
      const newPage = pdfDoc.addPage();
      sectionParams.page = newPage;
      sectionParams.y = height - margin;
      currentY = height - margin;
    }
    
    currentY = drawExplanation(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Draw photo assessment section if included
  if (options.includePhotoAssessment && data.photoUrl) {
    // Create a new page if needed
    if (currentY < height / 3) {
      const newPage = pdfDoc.addPage();
      sectionParams.page = newPage;
      sectionParams.y = height - margin;
      currentY = height - margin;
    }
    
    currentY = drawPhotoAssessment(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Draw AI condition section if available
  if (data.aiCondition) {
    // Create a new page if needed
    if (currentY < height / 3) {
      const newPage = pdfDoc.addPage();
      sectionParams.page = newPage;
      sectionParams.y = height - margin;
      currentY = height - margin;
    }
    
    currentY = drawAICondition(sectionParams);
    sectionParams.y = currentY;
  }
  
  // Draw footer on all pages
  for (let i = 0; i < pdfDoc.getPageCount(); i++) {
    const footerPage = pdfDoc.getPage(i);
    const footerParams = { ...sectionParams, page: footerPage };
    drawFooter(footerParams);
    
    // Add watermark if specified
    if (options.watermark) {
      drawWatermark({ ...footerParams, page: footerPage }, typeof options.watermark === 'string' ? options.watermark : 'SAMPLE');
    }
  }
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}

/**
 * Draw the header section
 */
function drawHeader(params: SectionParams): number {
  const { page, y, width, margin, data, primaryColor, boldFont, regularFont } = params;
  let currentY = y;
  
  // Draw report title
  page.drawText(data.reportTitle || 'Vehicle Valuation Report', {
    x: margin,
    y: currentY,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 30;
  
  // Draw generated date
  if (data.generatedAt) {
    const generatedDate = new Date(data.generatedAt);
    page.drawText(`Generated on: ${generatedDate.toLocaleDateString()}`, {
      x: margin,
      y: currentY,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
  currentY -= 20;
  
  // Draw premium badge if premium
  if (data.isPremium || data.premium) {
    const badgeWidth = 120;
    const badgeHeight = 30;
    
    page.drawRectangle({
      x: width - badgeWidth + margin,
      y: currentY - 10,
      width: badgeWidth,
      height: badgeHeight,
      color: rgb(0.988, 0.776, 0.055), // Gold color
      borderColor: rgb(0.8, 0.6, 0),
      borderWidth: 1,
      opacity: 0.9,
    });
    
    page.drawText('PREMIUM REPORT', {
      x: width - badgeWidth + margin + 12,
      y: currentY,
      size: 12,
      font: boldFont,
      color: rgb(0.4, 0.2, 0)
    });
  }
  currentY -= 30;
  
  // Draw a divider line
  drawHorizontalLine(page, margin, width + margin, currentY, 1, rgb(0.8, 0.8, 0.8));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the vehicle information section
 */
function drawVehicleInfo(params: SectionParams): number {
  const { page, y, margin, data, boldFont, regularFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;
  
  // Draw vehicle basic info
  const vehicleTitle = `${data.year} ${data.make} ${data.model}${data.trim ? ` ${data.trim}` : ''}`;
  page.drawText(vehicleTitle, {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: textColor
  });
  currentY -= 20;
  
  // Draw vehicle details in two columns
  const colWidth = 250;
  const leftCol = margin;
  const rightCol = margin + colWidth;
  
  // Left column
  page.drawText(`Mileage: ${data.mileage.toLocaleString()} miles`, {
    x: leftCol,
    y: currentY,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  // Right column
  page.drawText(`Condition: ${data.condition}`, {
    x: rightCol,
    y: currentY,
    size: 12,
    font: regularFont,
    color: textColor
  });
  currentY -= 20;
  
  // More vehicle details
  if (data.vin) {
    page.drawText(`VIN: ${data.vin}`, {
      x: leftCol,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
  }
  
  if (data.zipCode) {
    page.drawText(`Location: ${data.zipCode}${data.regionName ? ` (${data.regionName})` : ''}`, {
      x: rightCol,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
  }
  currentY -= 20;
  
  // Additional details if available
  if (data.transmission || data.bodyStyle || data.color || data.fuelType) {
    let additionalInfo = '';
    if (data.transmission) additionalInfo += `Transmission: ${data.transmission} | `;
    if (data.bodyStyle) additionalInfo += `Body: ${data.bodyStyle} | `;
    if (data.color) additionalInfo += `Color: ${data.color} | `;
    if (data.fuelType) additionalInfo += `Fuel: ${data.fuelType} | `;
    
    // Remove trailing separator
    additionalInfo = additionalInfo.replace(/\|\s$/, '');
    
    // Draw additional info with word wrapping
    const words = additionalInfo.split(' ');
    let line = '';
    let lineWidth = 0;
    const maxWidth = 400;
    
    for (const word of words) {
      const wordWidth = regularFont.widthOfTextAtSize(word + ' ', 12);
      
      if (lineWidth + wordWidth > maxWidth) {
        page.drawText(line, {
          x: leftCol,
          y: currentY,
          size: 12,
          font: regularFont,
          color: textColor
        });
        currentY -= 20;
        line = word + ' ';
        lineWidth = wordWidth;
      } else {
        line += word + ' ';
        lineWidth += wordWidth;
      }
    }
    
    if (line) {
      page.drawText(line, {
        x: leftCol,
        y: currentY,
        size: 12,
        font: regularFont,
        color: textColor
      });
      currentY -= 20;
    }
  }
  
  // Features if available
  if (data.features && data.features.length > 0) {
    currentY -= 10;
    
    page.drawText('Features:', {
      x: margin,
      y: currentY,
      size: 14,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    // Display features in a list
    const featuresPerRow = 2;
    const featureWidth = 250;
    let rowFeatures = 0;
    
    for (let i = 0; i < data.features.length; i++) {
      const feature = data.features[i];
      const col = rowFeatures % featuresPerRow;
      const x = margin + (col * featureWidth);
      
      page.drawText(`• ${feature}`, {
        x,
        y: currentY,
        size: 10,
        font: regularFont,
        color: textColor
      });
      
      rowFeatures++;
      
      if (rowFeatures % featuresPerRow === 0 || i === data.features.length - 1) {
        currentY -= 15;
      }
    }
  }
  
  currentY -= 20;
  drawHorizontalLine(page, margin, margin + params.width, currentY, 1, rgb(0.9, 0.9, 0.9));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the valuation section
 */
function drawValuation(params: SectionParams): number {
  const { page, y, margin, data, boldFont, regularFont, textColor, primaryColor } = params;
  let currentY = y;
  
  // Draw section title
  page.drawText('Valuation Summary', {
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
  
  // Measure the width of the label to place the value
  const labelWidth = boldFont.widthOfTextAtSize('Estimated Value:', 14);
  
  page.drawText(formattedValue, {
    x: margin + labelWidth + 10,
    y: currentY,
    size: 16,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;
  
  // Draw price range if available
  if (data.priceRange) {
    const [minPrice, maxPrice] = data.priceRange;
    const formattedRange = `$${minPrice.toLocaleString()} - $${maxPrice.toLocaleString()}`;
    
    page.drawText('Price Range:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    const rangeLabelWidth = boldFont.widthOfTextAtSize('Price Range:', 12);
    
    page.drawText(formattedRange, {
      x: margin + rangeLabelWidth + 10,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    currentY -= 20;
  }
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    currentY -= 20;
  }
  
  currentY -= 10;
  drawHorizontalLine(page, margin, margin + params.width, currentY, 1, rgb(0.9, 0.9, 0.9));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the adjustments section
 */
function drawAdjustments(params: SectionParams): number {
  const { page, y, margin, width, data, boldFont, regularFont, textColor, primaryColor } = params;
  let currentY = y;
  
  if (!data.adjustments || data.adjustments.length === 0) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Value Adjustments', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;
  
  // Draw explanation text
  page.drawText('The following factors were considered in determining the vehicle value:', {
    x: margin,
    y: currentY,
    size: 12,
    font: regularFont,
    color: textColor
  });
  currentY -= 25;
  
  // Draw table headers
  const colWidths = [200, 100, 200];
  const colStarts = [margin, margin + colWidths[0], margin + colWidths[0] + colWidths[1]];
  
  page.drawText('Factor', {
    x: colStarts[0],
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Impact', {
    x: colStarts[1],
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText('Description', {
    x: colStarts[2],
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  currentY -= 15;
  
  // Draw a line under the header
  drawHorizontalLine(page, margin, margin + width, currentY, 1, rgb(0.8, 0.8, 0.8));
  currentY -= 15;
  
  // Draw each adjustment
  let totalImpact = 0;
  
  for (const adjustment of data.adjustments) {
    // Factor name
    page.drawText(adjustment.factor, {
      x: colStarts[0],
      y: currentY,
      size: 11,
      font: regularFont,
      color: textColor
    });
    
    // Impact value
    const impactFormatted = (adjustment.impact >= 0 ? '+' : '') + 
                           `$${adjustment.impact.toLocaleString()}`;
    const impactColor = adjustment.impact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0);
    
    page.drawText(impactFormatted, {
      x: colStarts[1],
      y: currentY,
      size: 11,
      font: regularFont,
      color: impactColor
    });
    
    // Description (with potential wrapping)
    if (adjustment.description) {
      // Simple word wrapping for description
      const words = adjustment.description.split(' ');
      let line = '';
      let descY = currentY;
      const maxWidth = width - colStarts[2] + margin;
      
      for (const word of words) {
        const testLine = line + word + ' ';
        const lineWidth = regularFont.widthOfTextAtSize(testLine, 11);
        
        if (lineWidth > maxWidth && line !== '') {
          page.drawText(line, {
            x: colStarts[2],
            y: descY,
            size: 11,
            font: regularFont,
            color: textColor
          });
          descY -= 15;
          line = word + ' ';
        } else {
          line = testLine;
        }
      }
      
      if (line.trim() !== '') {
        page.drawText(line, {
          x: colStarts[2],
          y: descY,
          size: 11,
          font: regularFont,
          color: textColor
        });
        
        // Update currentY if description wrapped to multiple lines
        if (descY < currentY) {
          currentY = descY;
        }
      }
    }
    
    totalImpact += adjustment.impact;
    currentY -= 20;
  }
  
  // Draw total impact
  currentY -= 5;
  drawHorizontalLine(page, margin, margin + width, currentY, 1, rgb(0.8, 0.8, 0.8));
  currentY -= 20;
  
  page.drawText('Total Adjustments:', {
    x: colStarts[0],
    y: currentY,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  const totalImpactFormatted = (totalImpact >= 0 ? '+' : '') + 
                              `$${totalImpact.toLocaleString()}`;
  const totalImpactColor = totalImpact >= 0 ? rgb(0, 0.5, 0) : rgb(0.8, 0, 0);
  
  page.drawText(totalImpactFormatted, {
    x: colStarts[1],
    y: currentY,
    size: 12,
    font: boldFont,
    color: totalImpactColor
  });
  
  currentY -= 20;
  drawHorizontalLine(page, margin, margin + params.width, currentY, 1, rgb(0.9, 0.9, 0.9));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the explanation section
 */
function drawExplanation(params: SectionParams): number {
  const { page, y, margin, width, data, boldFont, regularFont, textColor, primaryColor } = params;
  let currentY = y;
  
  if (!data.explanation) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;
  
  // Draw explanation with word wrapping
  const words = data.explanation.split(' ');
  let line = '';
  const maxWidth = width;
  const lineHeight = 15;
  
  for (const word of words) {
    const testLine = line + word + ' ';
    const lineWidth = regularFont.widthOfTextAtSize(testLine, 11);
    
    if (lineWidth > maxWidth && line !== '') {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 11,
        font: regularFont,
        color: textColor
      });
      currentY -= lineHeight;
      line = word + ' ';
    } else {
      line = testLine;
    }
  }
  
  if (line.trim() !== '') {
    page.drawText(line, {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: textColor
    });
    currentY -= lineHeight;
  }
  
  currentY -= 10;
  drawHorizontalLine(page, margin, margin + width, currentY, 1, rgb(0.9, 0.9, 0.9));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the photo assessment section
 */
function drawPhotoAssessment(params: SectionParams): number {
  const { page, y, margin, width, data, boldFont, regularFont, textColor, primaryColor } = params;
  let currentY = y;
  
  if (!data.photoUrl && !data.bestPhotoUrl) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('Photo Assessment', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;
  
  // TODO: In a real implementation, we would embed the vehicle photo
  // This would require downloading the image and embedding it in the PDF
  // For now, we'll just show the photo score and a placeholder
  
  page.drawRectangle({
    x: margin,
    y: currentY - 150,
    width: 200,
    height: 150,
    color: rgb(0.9, 0.9, 0.9),
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1
  });
  
  page.drawText('Photo not embedded in sample', {
    x: margin + 20,
    y: currentY - 75,
    size: 12,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw photo score if available
  if (data.photoScore) {
    let scoreText = `Photo Quality Score: ${data.photoScore}%`;
    let scoreColor = rgb(0.8, 0, 0); // Red for poor scores
    
    if (data.photoScore >= 70) {
      scoreColor = rgb(0, 0.6, 0); // Green for good scores
    } else if (data.photoScore >= 50) {
      scoreColor = rgb(0.8, 0.6, 0); // Orange for average scores
    }
    
    page.drawText(scoreText, {
      x: margin + 220,
      y: currentY - 30,
      size: 14,
      font: boldFont,
      color: scoreColor
    });
    
    // Add assessment text based on score
    let assessmentText = 'The provided photos show clear damage that affects the vehicle\'s value.';
    
    if (data.photoScore >= 70) {
      assessmentText = 'The provided photos show a vehicle in good condition with no significant damage.';
    } else if (data.photoScore >= 50) {
      assessmentText = 'The provided photos show some minor damage or wear that slightly affects the vehicle\'s value.';
    }
    
    // Word wrap the assessment text
    const words = assessmentText.split(' ');
    let line = '';
    let textY = currentY - 60;
    const maxWidth = width - 220;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const lineWidth = regularFont.widthOfTextAtSize(testLine, 12);
      
      if (lineWidth > maxWidth && line !== '') {
        page.drawText(line, {
          x: margin + 220,
          y: textY,
          size: 12,
          font: regularFont,
          color: textColor
        });
        textY -= 20;
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    
    if (line.trim() !== '') {
      page.drawText(line, {
        x: margin + 220,
        y: textY,
        size: 12,
        font: regularFont,
        color: textColor
      });
    }
  }
  
  currentY -= 170;
  drawHorizontalLine(page, margin, margin + width, currentY, 1, rgb(0.9, 0.9, 0.9));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the AI condition section
 */
function drawAICondition(params: SectionParams): number {
  const { page, y, margin, width, data, boldFont, regularFont, textColor, primaryColor } = params;
  let currentY = y;
  
  if (!data.aiCondition) {
    return currentY;
  }
  
  // Draw section title
  page.drawText('AI Condition Assessment', {
    x: margin,
    y: currentY,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  currentY -= 25;
  
  // Draw condition
  page.drawText(`Assessed Condition: ${data.aiCondition.condition}`, {
    x: margin,
    y: currentY,
    size: 14,
    font: boldFont,
    color: textColor
  });
  currentY -= 20;
  
  // Draw confidence score
  if (data.aiCondition.confidenceScore) {
    page.drawText(`AI Trust Score: ${data.aiCondition.confidenceScore}%`, {
      x: margin,
      y: currentY,
      size: 12,
      font: regularFont,
      color: textColor
    });
    currentY -= 20;
  }
  
  // Draw issues detected
  if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
    page.drawText('Issues Detected:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    for (const issue of data.aiCondition.issuesDetected) {
      page.drawText(`• ${issue}`, {
        x: margin + 10,
        y: currentY,
        size: 11,
        font: regularFont,
        color: textColor
      });
      currentY -= 15;
    }
  } else {
    page.drawText('No significant issues detected.', {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: textColor
    });
    currentY -= 20;
  }
  
  // Draw summary
  if (data.aiCondition.summary) {
    currentY -= 10;
    page.drawText('Summary:', {
      x: margin,
      y: currentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    currentY -= 20;
    
    // Word wrap the summary
    const words = data.aiCondition.summary.split(' ');
    let line = '';
    const maxWidth = width;
    
    for (const word of words) {
      const testLine = line + word + ' ';
      const lineWidth = regularFont.widthOfTextAtSize(testLine, 11);
      
      if (lineWidth > maxWidth && line !== '') {
        page.drawText(line, {
          x: margin,
          y: currentY,
          size: 11,
          font: regularFont,
          color: textColor
        });
        currentY -= 15;
        line = word + ' ';
      } else {
        line = testLine;
      }
    }
    
    if (line.trim() !== '') {
      page.drawText(line, {
        x: margin,
        y: currentY,
        size: 11,
        font: regularFont,
        color: textColor
      });
      currentY -= 15;
    }
  }
  
  currentY -= 10;
  drawHorizontalLine(page, margin, margin + width, currentY, 1, rgb(0.9, 0.9, 0.9));
  currentY -= 20;
  
  return currentY;
}

/**
 * Draw the footer section
 */
function drawFooter(params: SectionParams): void {
  const { page, margin, width, data, regularFont } = params;
  const { height } = page.getSize();
  const footerY = 30;
  
  // Draw a line above the footer
  drawHorizontalLine(page, margin, margin + width, footerY + 15, 1, rgb(0.8, 0.8, 0.8));
  
  // Draw disclaimer text
  const disclaimerText = data.disclaimerText || 'This report provides an estimated value based on available data. Actual market value may vary.';
  page.drawText(disclaimerText, {
    x: margin,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw company name and copyright
  const currentYear = new Date().getFullYear();
  const companyName = data.companyName || 'Car Detective';
  const copyright = `© ${currentYear} ${companyName}. All Rights Reserved.`;
  
  // Calculate position to right-align
  const copyrightWidth = regularFont.widthOfTextAtSize(copyright, 8);
  
  page.drawText(copyright, {
    x: margin + width - copyrightWidth,
    y: footerY,
    size: 8,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Draw website if available
  if (data.website) {
    page.drawText(data.website, {
      x: margin,
      y: footerY - 10,
      size: 8,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.8)
    });
  }
}

/**
 * Draw watermark text across the page
 */
function drawWatermark(params: SectionParams, text: string): void {
  const { page } = params;
  const { width, height } = page.getSize();
  
  // Draw diagonal watermark text
  page.drawText(text, {
    x: width / 2 - 150,
    y: height / 2,
    size: 60,
    font: params.boldFont,
    color: rgb(0.8, 0.8, 0.8, 0.3), // Light gray with transparency
    rotate: {
      angle: Math.PI / 4, // 45 degrees in radians
      origin: {
        x: width / 2,
        y: height / 2,
      },
    },
  });
}
