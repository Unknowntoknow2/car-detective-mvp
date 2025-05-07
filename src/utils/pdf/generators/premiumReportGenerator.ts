import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts, PageSizes, PDFImage } from 'pdf-lib';
import { ReportData, ReportOptions } from '../types';

interface PremiumReportContext {
  pdfDoc: PDFDocument;
  page: PDFPage;
  width: number;
  height: number;
  margin: number;
  regularFont: PDFFont;
  boldFont: PDFFont;
  reportData: ReportData;
  options: ReportOptions;
  yPosition: number;
}

/**
 * Generates a premium PDF report with enhanced data and styling
 * @param reportData The data for the report
 * @param options Options for report generation
 * @returns Promise resolving to PDF document as Uint8Array
 */
export async function generatePremiumReport(
  reportData: ReportData,
  options: ReportOptions = {
    includeBranding: true,
    includeAIScore: true,
    includeFooter: true,
    includeTimestamp: true,
    includePhotoAssessment: true
  }
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage(PageSizes.LETTER);
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set drawing parameters
  const margin = 50;
  
  // Initialize the context
  const context: PremiumReportContext = {
    pdfDoc,
    page,
    width,
    height,
    margin,
    regularFont,
    boldFont,
    reportData,
    options,
    yPosition: height - margin
  };
  
  // Draw the header
  context.yPosition = await drawHeader(context);
  
  // Draw vehicle information
  context.yPosition = await drawVehicleInfo(context);
  
  // Draw valuation details
  context.yPosition = await drawValuationDetails(context);
  
  // Draw AI condition assessment
  if (reportData.bestPhotoUrl && options.includePhotoAssessment) {
    context.yPosition = await drawAICondition(context);
  }
  
  // Draw explanation section
  context.yPosition = await drawExplanation(context);
  
  // Draw adjustments
  context.yPosition = await drawAdjustments(context);
  
  // Draw footer
  await drawFooter(context);
  
  // Serialize the PDF to bytes
  return pdfDoc.save();
}

/**
 * Draws the header section
 */
async function drawHeader(context: PremiumReportContext): Promise<number> {
  const { page, width, margin, regularFont, boldFont } = context;
  let { yPosition } = context;
  
  // Add title
  page.drawText('PREMIUM VEHICLE VALUATION REPORT', {
    x: margin,
    y: yPosition,
    size: 20,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 24;
  
  // Add subtitle with date
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  page.drawText(`Generated on ${dateStr}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  yPosition -= 36;
  
  // Draw a line to separate the header from the content
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  yPosition -= 24;
  
  return yPosition;
}

/**
 * Draws the vehicle information section
 */
async function drawVehicleInfo(context: PremiumReportContext): Promise<number> {
  const { page, margin, regularFont, boldFont, reportData } = context;
  let { yPosition } = context;
  
  // Section title
  page.drawText('Vehicle Information', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 20;
  
  // Vehicle details
  const details = [
    `VIN: ${reportData.vin}`,
    `Make: ${reportData.make}`,
    `Model: ${reportData.model}`,
    `Year: ${reportData.year}`,
    `Mileage: ${reportData.mileage}`,
    `Color: ${reportData.color}`,
    `Body Style: ${reportData.bodyStyle}`,
    `Fuel Type: ${reportData.fuelType}`,
    `Transmission: ${reportData.transmission || 'Not Specified'}`
  ];
  
  const lineHeight = 14;
  let x = margin;
  
  for (const detail of details) {
    page.drawText(detail, {
      x,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    yPosition -= lineHeight;
    x += 180; // Adjust horizontal spacing
    
    if (x > 400) {
      x = margin;
    }
  }
  
  yPosition -= 20;
  
  return yPosition;
}

/**
 * Draws the valuation details section
 */
async function drawValuationDetails(context: PremiumReportContext): Promise<number> {
  const { page, width, margin, regularFont, boldFont, reportData } = context;
  let { yPosition } = context;
  
  // Section title
  page.drawText('Valuation Details', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 20;
  
  // Estimated Value
  page.drawText(`Estimated Value: $${reportData.estimatedValue.toLocaleString()}`, {
    x: margin,
    y: yPosition,
    size: 14,
    font: boldFont,
    color: rgb(0.2, 0.6, 0.2)
  });
  
  yPosition -= 20;
  
  // Confidence Score
  page.drawText(`Confidence Score: ${reportData.confidenceScore}%`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  yPosition -= 20;
  
  // Price Range
  const priceRange = reportData.priceRange || [
    Math.round(reportData.estimatedValue * 0.95),
    Math.round(reportData.estimatedValue * 1.05)
  ];
  
  page.drawText(`Price Range: $${priceRange[0].toLocaleString()} - $${priceRange[1].toLocaleString()}`, {
    x: margin,
    y: yPosition,
    size: 12,
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  yPosition -= 20;
  
  // Draw a line to separate this section
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  yPosition -= 20;
  
  return yPosition;
}

/**
 * Draws the AI condition assessment section with photo
 */
async function drawAICondition(context: PremiumReportContext): Promise<number> {
  const { page, width, margin, regularFont, boldFont, reportData, pdfDoc } = context;
  let { yPosition } = context;
  
  // Section title
  page.drawText('AI Condition Assessment', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 20;
  
  // Add best photo if available
  if (reportData.bestPhotoUrl) {
    try {
      // Fetch the image data
      const imageData = await fetch(reportData.bestPhotoUrl).then(res => res.arrayBuffer());
      
      // Embed the image
      const image = await pdfDoc.embedPng(imageData);
      
      // Calculate image dimensions
      const imageWidth = Math.min(width - margin * 2, 200);
      const imageHeight = (imageWidth / image.width) * image.height;
      
      // Draw the image
      page.drawImage(image, {
        x: margin,
        y: yPosition - imageHeight,
        width: imageWidth,
        height: imageHeight
      });
      
      yPosition -= imageHeight + 10;
    } catch (error) {
      console.error("Error embedding image:", error);
      // Handle the error appropriately, e.g., display a placeholder
      page.drawText('Unable to load image', {
        x: margin,
        y: yPosition,
        size: 10,
        font: regularFont,
        color: rgb(0.8, 0.2, 0.2)
      });
      yPosition -= 20;
    }
  }
  
  // If there's a photo explanation, add it
  if (reportData.photoExplanation) {
    const explanationLines = wrapText(
      reportData.photoExplanation,
      regularFont,
      12,
      width - margin * 2
    );
    
    page.drawText('AI Observation:', {
      x: margin,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    
    yPosition -= 16;
    
    for (const line of explanationLines) {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: 12,
        font: regularFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      yPosition -= 14;
    }
  }
  
  yPosition -= 20;
  
  return yPosition;
}

/**
 * Draws the explanation section
 */
async function drawExplanation(context: PremiumReportContext): Promise<number> {
  const { page, width, margin, regularFont, boldFont, reportData } = context;
  let { yPosition } = context;
  
  // Section title
  page.drawText('Explanation', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 20;
  
  // Explanation text
  const explanationLines = wrapText(
    reportData.explanation,
    regularFont,
    12,
    width - margin * 2
  );
  
  for (const line of explanationLines) {
    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });
    yPosition -= 14;
  }
  
  yPosition -= 20;
  
  return yPosition;
}

/**
 * Draws the adjustments section
 */
async function drawAdjustments(context: PremiumReportContext): Promise<number> {
  const { page, width, margin, regularFont, boldFont, reportData } = context;
  let { yPosition } = context;
  
  // Section title
  page.drawText('Adjustments', {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });
  
  yPosition -= 20;
  
  if (reportData.adjustments && reportData.adjustments.length > 0) {
    for (const adjustment of reportData.adjustments) {
      page.drawText(`${adjustment.factor}: ${adjustment.impact > 0 ? '+' : ''}${adjustment.impact}%`, {
        x: margin,
        y: yPosition,
        size: 12,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3)
      });
      
      yPosition -= 16;
      
      const descriptionLines = wrapText(
        adjustment.description,
        regularFont,
        10,
        width - margin * 2
      );
      
      for (const line of descriptionLines) {
        page.drawText(line, {
          x: margin + 20,
          y: yPosition,
          size: 10,
          font: regularFont,
          color: rgb(0.5, 0.5, 0.5)
        });
        yPosition -= 12;
      }
      
      yPosition -= 10;
    }
  } else {
    page.drawText('No adjustments available.', {
      x: margin,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
    yPosition -= 20;
  }
  
  yPosition -= 20;
  
  return yPosition;
}

/**
 * Draws the footer section
 */
async function drawFooter(context: PremiumReportContext): Promise<void> {
  const { page, width, height, margin, regularFont, options } = context;
  
  // Add footer text
  const footerText = 'This valuation report is for informational purposes only.';
  
  page.drawText(footerText, {
    x: margin,
    y: margin,
    size: 10,
    font: regularFont,
    color: rgb(0.5, 0.5, 0.5)
  });
  
  // Add timestamp if enabled
  if (options.includeTimestamp) {
    const now = new Date();
    const timestamp = now.toLocaleString();
    
    page.drawText(`Generated on ${timestamp}`, {
      x: width - margin - 150,
      y: margin,
      size: 10,
      font: regularFont,
      color: rgb(0.5, 0.5, 0.5)
    });
  }
}

/**
 * Wraps text to fit within a given width
 */
function wrapText(
  text: string,
  font: PDFFont,
  fontSize: number,
  maxWidth: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    
    if (width <= maxWidth) {
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
