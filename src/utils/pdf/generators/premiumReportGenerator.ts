
import { rgb } from 'pdf-lib';
import { ReportData, ReportOptions, ReportGeneratorParams } from '../types';
import { drawHeaderSection } from '../sections/headerSection';
import { drawVehicleInfoSection } from '../sections/vehicleInfoSection';
import { drawValuationSection } from '../sections/valuationSection';
import { drawExplanationSection } from '../sections/explanationSection';
import { drawPhotoAssessmentSection } from '../sections/photoAssessmentSection';
import { drawProfessionalOpinionSection } from '../sections/professionalOpinionSection';
import { drawDisclaimerSection } from '../sections/disclaimerSection';
import { drawWatermark } from '../sections/watermark';

/**
 * Generate a premium valuation PDF report
 */
export const generatePremiumReport = async (params: ReportGeneratorParams): Promise<Uint8Array> => {
  const { data, options, document: PDFDocument } = params;

  // Create a new PDF document
  const doc = await PDFDocument.create();

  // Set metadata
  doc.setTitle(`${data.year} ${data.make} ${data.model} Valuation Report`);
  doc.setAuthor('Car Detective');
  doc.setSubject('Vehicle Valuation Report');
  doc.setKeywords(['valuation', 'vehicle', 'car', 'report', data.make, data.model]);
  doc.setCreator('Car Detective Valuation Engine');
  doc.setProducer('Car Detective PDF Generator');

  // Add a page
  const page = doc.addPage();
  const { width, height } = page.getSize();
  
  // Standard margins
  const margin = 50;
  const contentWidth = width - (margin * 2);

  // Define colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.2, 0.4, 0.8);
  const secondaryColor = rgb(0.3, 0.6, 0.9);
  
  // Load fonts
  const standardFontData = await fetch('/fonts/Roboto-Regular.ttf').then(res => res.arrayBuffer()).catch(() => null);
  const boldFontData = await fetch('/fonts/Roboto-Bold.ttf').then(res => res.arrayBuffer()).catch(() => null);
  const italicFontData = await fetch('/fonts/Roboto-Italic.ttf').then(res => res.arrayBuffer()).catch(() => null);
  
  // Fallback to standard fonts if custom fonts can't be loaded
  let regularFont;
  let boldFont;
  let italicFont;
  
  try {
    if (standardFontData) {
      regularFont = await doc.embedFont(standardFontData);
    } else {
      regularFont = await doc.embedFont('Helvetica');
    }
    
    if (boldFontData) {
      boldFont = await doc.embedFont(boldFontData);
    } else {
      boldFont = await doc.embedFont('Helvetica-Bold');
    }
    
    if (italicFontData) {
      italicFont = await doc.embedFont(italicFontData);
    } else {
      italicFont = await doc.embedFont('Helvetica-Oblique');
    }
  } catch (error) {
    console.error('Error loading fonts:', error);
    regularFont = await doc.embedFont('Helvetica');
    boldFont = await doc.embedFont('Helvetica-Bold');
    italicFont = await doc.embedFont('Helvetica-Oblique');
  }

  // Draw watermark if specified
  if (options.watermark) {
    drawWatermark({
      page,
      data,
      width,
      height,
      boldFont,
      doc
    });
  }

  // Initialize the current Y position for content placement
  let currentY = height - margin;

  // Draw report header
  currentY = drawHeader({
    page,
    data,
    y: currentY,
    width,
    margin,
    textColor,
    primaryColor,
    regularFont,
    boldFont
  });

  // Draw vehicle information section
  currentY = drawVehicleInfo({
    page,
    data,
    y: currentY - 40,
    width: contentWidth,
    margin,
    textColor,
    regularFont,
    boldFont
  });

  // Draw valuation section
  currentY = drawValuation({
    page,
    data,
    y: currentY - 40,
    width: contentWidth,
    margin,
    textColor,
    primaryColor,
    regularFont,
    boldFont
  });

  // Draw explanation section if included
  if (options.includeExplanation) {
    currentY = drawExplanation({
      page,
      data,
      y: currentY - 40,
      width: contentWidth,
      margin,
      textColor,
      regularFont,
      boldFont,
      italicFont
    });
  }

  // Draw photo assessment section if included
  if (options.includePhotoAssessment && (data.photoUrl || data.bestPhotoUrl || data.aiCondition)) {
    currentY = drawPhotoAssessment({
      page,
      data,
      y: currentY - 40,
      width: contentWidth,
      margin,
      textColor,
      regularFont,
      boldFont
    });
  }

  // Draw professional opinion if premium
  if (data.premium) {
    currentY = drawProfessionalOpinion({
      page,
      data,
      y: currentY - 40,
      width: contentWidth,
      margin,
      textColor,
      regularFont,
      boldFont
    });
  }

  // Draw disclaimer at the bottom
  currentY = drawDisclaimer({
    page,
    data,
    y: 100, // Fixed position near the bottom
    width: contentWidth,
    margin,
    textColor: rgb(0.5, 0.5, 0.5),
    regularFont,
    italicFont
  });

  // Draw footer
  drawFooter({
    page,
    data,
    y: 50, // Fixed position at the bottom
    width,
    margin,
    textColor: rgb(0.5, 0.5, 0.5),
    regularFont
  });

  // Serialize the PDF to bytes
  const pdfBytes = await doc.save();
  return pdfBytes;
};

// Helper function to draw the header
function drawHeader({ page, data, y, width, margin, textColor, primaryColor, regularFont, boldFont }) {
  // Logo position (if we had a logo)
  // page.drawImage(...)
  
  // Report title
  page.drawText(data.reportTitle || 'Premium Vehicle Valuation Report', {
    x: margin,
    y,
    size: 24,
    font: boldFont,
    color: primaryColor
  });
  
  // Date
  const dateStr = data.generatedDate instanceof Date 
    ? data.generatedDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) 
    : new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
  
  page.drawText(`Generated on ${dateStr}`, {
    x: margin,
    y: y - 30,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: y - 45 },
    end: { x: width - margin, y: y - 45 },
    thickness: 1,
    color: rgb(0.8, 0.8, 0.8)
  });
  
  return y - 60;
}

// Helper function to draw vehicle info
function drawVehicleInfo({ page, data, y, width, margin, textColor, regularFont, boldFont }) {
  // Section title
  page.drawText('Vehicle Information', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: textColor
  });
  
  // Calculate column widths for 2-column layout
  const col1X = margin;
  const col2X = margin + width/2;
  
  // Row 1
  page.drawText('Make:', {
    x: col1X,
    y: y - 30,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.make || 'N/A', {
    x: col1X + 100,
    y: y - 30,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  page.drawText('Model:', {
    x: col2X,
    y: y - 30,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.model || 'N/A', {
    x: col2X + 100,
    y: y - 30,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  // Row 2
  page.drawText('Year:', {
    x: col1X,
    y: y - 50,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.year?.toString() || 'N/A', {
    x: col1X + 100,
    y: y - 50,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  page.drawText('Mileage:', {
    x: col2X,
    y: y - 50,
    size: 12,
    font: boldFont,
    color: textColor
  });
  
  page.drawText(data.mileage ? data.mileage.toLocaleString() + ' miles' : 'N/A', {
    x: col2X + 100,
    y: y - 50,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  // Row 3 - only shown for premium reports
  if (data.premium) {
    page.drawText('VIN:', {
      x: col1X,
      y: y - 70,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    page.drawText(data.vin || 'N/A', {
      x: col1X + 100,
      y: y - 70,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    page.drawText('Trim:', {
      x: col2X,
      y: y - 70,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    page.drawText(data.trim || 'N/A', {
      x: col2X + 100,
      y: y - 70,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    // Row 4 for premium
    page.drawText('Body Style:', {
      x: col1X,
      y: y - 90,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    page.drawText(data.bodyStyle || data.bodyType || 'N/A', {
      x: col1X + 100,
      y: y - 90,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    page.drawText('Color:', {
      x: col2X,
      y: y - 90,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    page.drawText(data.color || 'N/A', {
      x: col2X + 100,
      y: y - 90,
      size: 12,
      font: regularFont,
      color: textColor
    });
    
    return y - 110;
  }
  
  return y - 70;
}

// Helper function to draw valuation section
function drawValuation({ page, data, y, width, margin, textColor, primaryColor, regularFont, boldFont }) {
  // Section title
  page.drawText('Valuation', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: textColor
  });
  
  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Estimated value (large)
  page.drawText('Estimated Value:', {
    x: margin,
    y: y - 30,
    size: 14,
    font: boldFont,
    color: textColor
  });
  
  // Value amount (large and prominent)
  const valueText = formatCurrency(data.estimatedValue);
  
  // Calculate dynamic text size based on string length to avoid overflow
  // Default characters per line calculation
  const charsPerLine = 20;
  
  page.drawText(valueText, {
    x: margin + 150,
    y: y - 30,
    size: 18,
    font: boldFont,
    color: primaryColor
  });
  
  // Price range
  if (Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    page.drawText('Price Range:', {
      x: margin,
      y: y - 55,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    const rangeText = `${formatCurrency(data.priceRange[0])} - ${formatCurrency(data.priceRange[1])}`;
    
    page.drawText(rangeText, {
      x: margin + 150,
      y: y - 55,
      size: 12,
      font: regularFont,
      color: textColor
    });
  }
  
  // Confidence score if available
  if (data.confidenceScore !== undefined) {
    page.drawText('Confidence Score:', {
      x: margin,
      y: y - 75,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    const scoreText = `${data.confidenceScore}%`;
    
    page.drawText(scoreText, {
      x: margin + 150,
      y: y - 75,
      size: 12,
      font: regularFont,
      color: textColor
    });
  }
  
  // Adjustment factors (only for premium reports)
  if (data.premium && data.adjustments && data.adjustments.length > 0) {
    page.drawText('Value Adjustments:', {
      x: margin,
      y: y - 100,
      size: 14,
      font: boldFont,
      color: textColor
    });
    
    let adjustmentY = y - 120;
    const lineHeight = 20;
    
    // Draw table header
    page.drawText('Factor', {
      x: margin,
      y: adjustmentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    page.drawText('Impact', {
      x: margin + width - 100,
      y: adjustmentY,
      size: 12,
      font: boldFont,
      color: textColor
    });
    
    adjustmentY -= lineHeight;
    
    // Draw adjustments
    for (const adjustment of data.adjustments) {
      // Factor name
      page.drawText(adjustment.factor, {
        x: margin,
        y: adjustmentY,
        size: 11,
        font: regularFont,
        color: textColor
      });
      
      // Impact value
      const impactText = formatCurrency(adjustment.impact);
      const textWidth = regularFont.widthOfTextAtSize(impactText, 11);
      
      page.drawText(impactText, {
        x: margin + width - 100,
        y: adjustmentY,
        size: 11,
        font: regularFont,
        color: adjustment.impact >= 0 ? rgb(0.2, 0.6, 0.2) : rgb(0.8, 0.2, 0.2)
      });
      
      adjustmentY -= lineHeight;
    }
    
    return adjustmentY - 20;
  }
  
  return y - 95;
}

// Helper function to draw explanation section
function drawExplanation({ page, data, y, width, margin, textColor, regularFont, boldFont, italicFont }) {
  if (!data.explanation) {
    return y;
  }
  
  // Section title
  page.drawText('Valuation Explanation', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: textColor
  });
  
  // Split explanation into paragraphs
  const paragraphs = data.explanation.split('\n\n');
  let explanationY = y - 30;
  
  // Draw each paragraph with proper wrapping
  for (const paragraph of paragraphs) {
    if (paragraph.trim().length === 0) continue;
    
    // Get words
    const words = paragraph.split(' ');
    let line = '';
    let lineY = explanationY;
    
    // Simple text wrapping
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const lineWidth = regularFont.widthOfTextAtSize(testLine, 11);
      
      if (lineWidth > width) {
        // Draw the current line
        page.drawText(line, {
          x: margin,
          y: lineY,
          size: 11,
          font: regularFont,
          color: textColor
        });
        
        // Start a new line
        line = word;
        lineY -= 18;
      } else {
        line = testLine;
      }
    }
    
    // Draw the last line
    if (line) {
      page.drawText(line, {
        x: margin,
        y: lineY,
        size: 11,
        font: regularFont,
        color: textColor
      });
      explanationY = lineY - 24;
    }
  }
  
  return explanationY;
}

// Helper function to draw photo assessment
function drawPhotoAssessment({ page, data, y, width, margin, textColor, regularFont, boldFont }) {
  // Just call the existing function
  return drawPhotoAssessmentSection({
    page,
    data,
    y,
    width,
    margin,
    textColor,
    regularFont,
    boldFont,
    doc: null // This is not used in our implementation
  });
}

// Helper function to draw professional opinion
function drawProfessionalOpinion({ page, data, y, width, margin, textColor, regularFont, boldFont }) {
  // Section title
  page.drawText('Professional Opinion', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: textColor
  });
  
  // Placeholder opinion text
  const opinionText = 'Based on our professional analysis, this vehicle is priced appropriately for its condition, mileage, and the current market. The estimated value represents a fair private party sale price.';
  
  // Split into lines
  const words = opinionText.split(' ');
  let line = '';
  let lineY = y - 30;
  
  // Simple text wrapping
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const lineWidth = regularFont.widthOfTextAtSize(testLine, 11);
    
    if (lineWidth > width) {
      // Draw the current line
      page.drawText(line, {
        x: margin,
        y: lineY,
        size: 11,
        font: regularFont,
        color: textColor
      });
      
      // Start a new line
      line = word;
      lineY -= 18;
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: lineY,
      size: 11,
      font: regularFont,
      color: textColor
    });
  }
  
  return lineY - 20;
}

// Helper function to draw disclaimer
function drawDisclaimer({ page, data, y, width, margin, textColor, regularFont, italicFont }) {
  const disclaimerText = data.disclaimerText || 'This valuation is an estimate based on market data and may not reflect the actual value of this specific vehicle. Factors such as actual condition, local market variations, and unique vehicle history can affect the real-world value.';
  
  // Split into lines
  const words = disclaimerText.split(' ');
  let line = '';
  let lineY = y;
  
  // Simple text wrapping
  for (const word of words) {
    const testLine = line + (line ? ' ' : '') + word;
    const lineWidth = italicFont.widthOfTextAtSize(testLine, 9);
    
    if (lineWidth > width) {
      // Draw the current line
      page.drawText(line, {
        x: margin,
        y: lineY,
        size: 9,
        font: italicFont,
        color: textColor
      });
      
      // Start a new line
      line = word;
      lineY -= 14;
    } else {
      line = testLine;
    }
  }
  
  // Draw the last line
  if (line) {
    page.drawText(line, {
      x: margin,
      y: lineY,
      size: 9,
      font: italicFont,
      color: textColor
    });
  }
  
  return lineY - 20;
}

// Helper function to draw footer
function drawFooter({ page, data, y, width, margin, textColor, regularFont }) {
  const footerText = data.companyName || 'Car Detective';
  const websiteText = data.website || 'www.cardetective.com';
  
  // Company name
  page.drawText(footerText, {
    x: margin,
    y,
    size: 9,
    font: regularFont,
    color: textColor
  });
  
  // Website
  page.drawText(websiteText, {
    x: width - margin - regularFont.widthOfTextAtSize(websiteText, 9),
    y,
    size: 9,
    font: regularFont,
    color: textColor
  });
  
  // Page number
  const pageText = 'Page 1 of 1';
  page.drawText(pageText, {
    x: width / 2 - regularFont.widthOfTextAtSize(pageText, 9) / 2,
    y,
    size: 9,
    font: regularFont,
    color: textColor
  });
  
  return y - 20;
}
