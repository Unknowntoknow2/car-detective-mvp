
import { jsPDF } from 'jspdf';
import { ReportData, SectionParams, ReportGeneratorParams } from '../types';

// Function to generate a premium PDF report
export async function generatePremiumReport({ data, options }: ReportGeneratorParams): Promise<Uint8Array> {
  // Initialize PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4'
  });

  // Set up document properties
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - (margin * 2);

  // Set up fonts
  const regularFont = 'helvetica';
  const boldFont = 'helvetica-bold';
  const italicFont = 'helvetica-oblique'; // Add italic font
  
  // Create a fonts object to pass to sections
  const fonts = {
    regular: regularFont,
    bold: boldFont,
    italic: italicFont
  };

  // Colors
  const textColor = '#333333';
  const primaryColor = '#0056b3';

  // Start position for content
  let y = margin;

  // Create first page
  const page = doc.getPage(1);

  // Add header section
  y = await addHeaderSection({
    page,
    startY: y,
    width: contentWidth,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    fonts,
    height: pageHeight
  });

  // Add some spacing
  y += 20;

  // Check if we need a new page
  if (y > pageHeight - margin * 2) {
    doc.addPage();
    y = margin;
  }

  // Add vehicle details section
  y = await addVehicleDetailsSection({
    page,
    startY: y,
    width: contentWidth,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    fonts,
    height: pageHeight
  });

  // Add some spacing
  y += 30;

  // Check if we need a new page
  if (y > pageHeight - margin * 2) {
    doc.addPage();
    y = margin;
  }

  // Add valuation section
  y = await addValuationSection({
    page,
    startY: y,
    width: contentWidth,
    margin,
    data,
    options,
    font: regularFont,
    boldFont,
    italicFont,
    textColor,
    primaryColor,
    fonts,
    height: pageHeight
  });

  // Add more sections as needed...

  // Add footer to all pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    await addFooterSection({
      page,
      startY: pageHeight - margin,
      width: contentWidth,
      margin,
      data,
      options,
      font: regularFont,
      boldFont,
      italicFont,
      textColor,
      primaryColor,
      fonts,
      height: pageHeight
    });
  }

  // Return PDF as buffer
  return doc.output('arraybuffer');
}

// Header section
async function addHeaderSection({
  page,
  startY,
  width,
  margin,
  data,
  options,
  font,
  boldFont,
  textColor,
  primaryColor,
  fonts,
  height
}: SectionParams): Promise<number> {
  const doc = page.doc;
  let currentY = startY;

  // Use fonts with null checks
  const italicFontToUse = fonts?.italic || fonts?.regular || font;
  const regularFontToUse = fonts?.regular || font;
  const boldFontToUse = fonts?.bold || boldFont;

  // Title
  doc.setFont(boldFontToUse);
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  
  const title = data.reportTitle || `${data.year} ${data.make} ${data.model} Valuation Report`;
  doc.text(title, margin, currentY);
  currentY += 30;

  // Subtitle with date
  doc.setFont(italicFontToUse);
  doc.setFontSize(12);
  doc.setTextColor(textColor);
  
  const date = data.generatedAt ? new Date(data.generatedAt).toLocaleDateString() : new Date().toLocaleDateString();
  doc.text(`Generated on ${date}`, margin, currentY);
  currentY += 20;

  // If premium, add premium badge
  if (data.isPremium || options.isPremium) {
    doc.setFillColor(primaryColor);
    doc.roundedRect(margin, currentY, 120, 30, 5, 5, 'F');
    doc.setFont(boldFontToUse);
    doc.setTextColor('#FFFFFF');
    doc.setFontSize(14);
    doc.text('PREMIUM REPORT', margin + 15, currentY + 20);
    currentY += 40;
  }

  // Add a horizontal line
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(1);
  doc.line(margin, currentY, margin + width, currentY);
  currentY += 20;

  return currentY;
}

// Vehicle details section
async function addVehicleDetailsSection({
  page,
  startY,
  width,
  margin,
  data,
  options,
  font,
  boldFont,
  textColor,
  primaryColor,
  fonts,
  height
}: SectionParams): Promise<number> {
  const doc = page.doc;
  let currentY = startY;

  // Use fonts with null checks
  const italicFontToUse = fonts?.italic || fonts?.regular || font;
  const regularFontToUse = fonts?.regular || font;
  const boldFontToUse = fonts?.bold || boldFont;

  // Section title
  doc.setFont(boldFontToUse);
  doc.setFontSize(18);
  doc.setTextColor(primaryColor);
  doc.text('Vehicle Information', margin, currentY);
  currentY += 25;

  // Vehicle details in a 2-column layout
  doc.setFont(regularFontToUse);
  doc.setFontSize(12);
  doc.setTextColor(textColor);

  const detailsLeft = [
    { label: 'Make:', value: data.make },
    { label: 'Model:', value: data.model },
    { label: 'Year:', value: data.year.toString() },
    { label: 'Mileage:', value: `${data.mileage.toLocaleString()} miles` },
    { label: 'Condition:', value: data.condition }
  ];

  const detailsRight = [
    { label: 'VIN:', value: data.vin || 'Not provided' },
    { label: 'Trim:', value: data.trim || 'Standard' },
    { label: 'Body Style:', value: data.bodyStyle || 'Not specified' },
    { label: 'Transmission:', value: data.transmission || 'Not specified' },
    { label: 'Color:', value: data.color || 'Not specified' }
  ];

  // Calculate column width
  const colWidth = width / 2 - 10;
  
  // Draw left column
  detailsLeft.forEach(detail => {
    doc.setFont(boldFontToUse);
    doc.text(detail.label, margin, currentY);
    doc.setFont(regularFontToUse);
    doc.text(detail.value, margin + 70, currentY);
    currentY += 20;
  });

  // Reset Y position for right column
  currentY = startY + 25;
  
  // Draw right column
  detailsRight.forEach(detail => {
    doc.setFont(boldFontToUse);
    doc.text(detail.label, margin + colWidth + 20, currentY);
    doc.setFont(regularFontToUse);
    doc.text(detail.value, margin + colWidth + 90, currentY);
    currentY += 20;
  });

  // Advance Y to the bottom of the tallest column
  currentY = startY + 25 + (Math.max(detailsLeft.length, detailsRight.length) * 20) + 10;

  // Add vehicle photo if available
  if (data.bestPhotoUrl || data.photoUrl) {
    try {
      // This is a placeholder for image loading logic
      // In a real implementation, you'd load the image and add it to the PDF
      doc.text('Vehicle Photo Would Appear Here', margin, currentY);
      currentY += 200; // Space for the photo
    } catch (error) {
      console.error('Failed to load vehicle image:', error);
    }
  }

  return currentY;
}

// Valuation section
async function addValuationSection({
  page,
  startY,
  width,
  margin,
  data,
  options,
  font,
  boldFont,
  textColor,
  primaryColor,
  fonts,
  height
}: SectionParams): Promise<number> {
  const doc = page.doc;
  let currentY = startY;

  // Use fonts with null checks
  const italicFontToUse = fonts?.italic || fonts?.regular || font;
  const regularFontToUse = fonts?.regular || font;
  const boldFontToUse = fonts?.bold || boldFont;

  // Section title
  doc.setFont(boldFontToUse);
  doc.setFontSize(18);
  doc.setTextColor(primaryColor);
  doc.text('Valuation Summary', margin, currentY);
  currentY += 25;

  // Valuation price
  doc.setFont(boldFontToUse);
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text(`$${data.estimatedValue.toLocaleString()}`, margin, currentY);
  currentY += 30;

  // Confidence score if available
  if (data.confidenceScore) {
    doc.setFont(regularFontToUse);
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`Confidence Score: ${data.confidenceScore}%`, margin, currentY);
    currentY += 20;
  }

  // Price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    doc.setFont(regularFontToUse);
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text(`Estimated Value Range: $${data.priceRange[0].toLocaleString()} - $${data.priceRange[1].toLocaleString()}`, margin, currentY);
    currentY += 20;
  }

  // Add some spacing
  currentY += 10;

  // Price adjustments table
  if (data.adjustments && data.adjustments.length > 0) {
    doc.setFont(boldFontToUse);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Price Adjustments', margin, currentY);
    currentY += 20;

    // Table headers
    const colWidths = [200, 100, 200];
    doc.setFont(boldFontToUse);
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    doc.text('Factor', margin, currentY);
    doc.text('Impact', margin + colWidths[0], currentY);
    doc.text('Description', margin + colWidths[0] + colWidths[1], currentY);
    currentY += 15;

    // Horizontal line below headers
    doc.setDrawColor(textColor);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY - 5, margin + width, currentY - 5);

    // Table rows
    doc.setFont(regularFontToUse);
    data.adjustments.forEach(adjustment => {
      // Check if we need a new page
      if (currentY > (height || 800) - margin * 2) {
        doc.addPage();
        currentY = margin;
        
        // Redraw headers on new page
        doc.setFont(boldFontToUse);
        doc.text('Factor', margin, currentY);
        doc.text('Impact', margin + colWidths[0], currentY);
        doc.text('Description', margin + colWidths[0] + colWidths[1], currentY);
        currentY += 15;
        
        // Horizontal line below headers
        doc.line(margin, currentY - 5, margin + width, currentY - 5);
        
        doc.setFont(regularFontToUse);
      }

      doc.text(adjustment.factor, margin, currentY);
      
      const impactText = adjustment.impact >= 0 ? 
        `+$${adjustment.impact.toLocaleString()}` : 
        `-$${Math.abs(adjustment.impact).toLocaleString()}`;
      
      doc.text(impactText, margin + colWidths[0], currentY);
      
      if (adjustment.description) {
        doc.text(adjustment.description, margin + colWidths[0] + colWidths[1], currentY);
      }
      
      currentY += 20;
    });

    // Horizontal line after table
    doc.setDrawColor(textColor);
    doc.setLineWidth(0.5);
    doc.line(margin, currentY, margin + width, currentY);
    currentY += 20;
  }

  // Add explanation section if included
  if (options.includeExplanation && data.explanation) {
    doc.setFont(boldFontToUse);
    doc.setFontSize(14);
    doc.setTextColor(primaryColor);
    doc.text('Valuation Explanation', margin, currentY);
    currentY += 20;

    doc.setFont(regularFontToUse);
    doc.setFontSize(12);
    doc.setTextColor(textColor);
    
    // Split explanation into lines
    const splitText = doc.splitTextToSize(data.explanation, width);
    
    // Check if text fits on current page
    if (currentY + splitText.length * 15 > (height || 800) - margin * 2) {
      doc.addPage();
      currentY = margin;
      
      // Redraw section title on new page
      doc.setFont(boldFontToUse);
      doc.setFontSize(14);
      doc.setTextColor(primaryColor);
      doc.text('Valuation Explanation (Continued)', margin, currentY);
      currentY += 20;
      
      doc.setFont(regularFontToUse);
      doc.setFontSize(12);
      doc.setTextColor(textColor);
    }
    
    doc.text(splitText, margin, currentY);
    currentY += splitText.length * 15 + 20;
  }

  return currentY;
}

// Footer section
async function addFooterSection({
  page,
  startY,
  width,
  margin,
  data,
  options,
  font,
  boldFont,
  textColor,
  primaryColor,
  fonts,
  height
}: SectionParams): Promise<number> {
  const doc = page.doc;
  const currentY = startY;

  // Use fonts with null checks
  const italicFontToUse = fonts?.italic || fonts?.regular || font;
  const regularFontToUse = fonts?.regular || font;

  // Add a horizontal line
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(1);
  doc.line(margin, currentY - 20, margin + width, currentY - 20);

  // Footer text
  doc.setFont(italicFontToUse);
  doc.setFontSize(9);
  doc.setTextColor(textColor);
  
  const pageNumber = doc.getCurrentPageInfo().pageNumber;
  const totalPages = doc.getNumberOfPages();
  const pageText = `Page ${pageNumber} of ${totalPages}`;
  
  // Add company info if provided
  if (data.companyName) {
    doc.text(`© ${new Date().getFullYear()} ${data.companyName}`, margin, currentY);
    
    // Page number on the right
    const pageWidth = doc.getTextWidth(pageText);
    doc.text(pageText, margin + width - pageWidth, currentY);
    
    // Website if provided
    if (data.website) {
      doc.text(data.website, margin, currentY + 15);
    }
  } else {
    // Just add page number if no company info
    const pageWidth = doc.getTextWidth(pageText);
    doc.text(pageText, margin + width - pageWidth, currentY);
  }
  
  // Add disclaimer if provided
  if (data.disclaimerText) {
    doc.setFontSize(8);
    const splitText = doc.splitTextToSize(data.disclaimerText, width);
    doc.text(splitText, margin, currentY + 30);
  }

  // Add watermark if specified
  if (options.watermark) {
    const watermarkText = typeof options.watermark === 'string' ? options.watermark : 'SAMPLE';
    
    doc.saveGraphicsState();
    doc.setGState(doc.GState({ opacity: 0.3 }));
    doc.setFont(boldFontToUse);
    doc.setFontSize(60);
    doc.setTextColor('#999999');
    
    // Center watermark on page
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const textWidth = doc.getTextWidth(watermarkText);
    
    // Calculate positions for centered, rotated text
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Save the current transformation matrix
    doc.saveGraphicsState();
    
    // Move to center point, rotate, then draw text
    doc.translate(centerX, centerY);
    doc.rotate(-45);
    doc.text(watermarkText, -textWidth / 2, 0);
    
    // Restore the transformation matrix
    doc.restoreGraphicsState();
    
    // Restore original graphics state
    doc.restoreGraphicsState();
  }

  return currentY;
}
