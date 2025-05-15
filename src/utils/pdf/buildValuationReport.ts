
import { ReportData, SectionParams } from './types';

// Define the drawValuationSummary function 
export function drawValuationSummary(
  sectionParams: SectionParams,
  narrative: string,
  yPosition: number,
  isPremium: boolean = false,
  includeTimestamp: boolean = true
): number {
  const { 
    page, 
    margin, 
    contentWidth, 
    boldFont, 
    regularFont, 
    primaryColor, 
    textColor 
  } = sectionParams;
  
  // Draw heading
  page.drawText("Valuation Summary", {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: primaryColor
  });
  
  yPosition -= 25;
  
  // Split narrative into lines to fit within content width
  const words = narrative.split(' ');
  let currentLine = '';
  const lines: string[] = [];
  
  // Mock calculation for line width if font object doesn't have widthOfTextAtSize
  const calculateTextWidth = (text: string, fontSize: number) => {
    // Simple approximation: assume each character is ~0.6 times the font size wide
    return text.length * fontSize * 0.6;
  };
  
  const getTextWidth = typeof regularFont === 'string' 
    ? (text: string) => calculateTextWidth(text, 12)
    : (text: string) => (regularFont as any).widthOfTextAtSize(text, 12);
  
  for (const word of words) {
    const testLine = currentLine + word + ' ';
    if (getTextWidth(testLine) > contentWidth) {
      lines.push(currentLine);
      currentLine = word + ' ';
    } else {
      currentLine = testLine;
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  // Draw each line of text
  for (const line of lines) {
    page.drawText(line, {
      x: margin,
      y: yPosition,
      size: 12,
      font: regularFont,
      color: textColor
    });
    yPosition -= 18;
  }
  
  // Add timestamp if requested
  if (includeTimestamp) {
    yPosition -= 10;
    page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: margin,
      y: yPosition,
      size: 10,
      font: regularFont,
      color: textColor
    });
    yPosition -= 15;
  }
  
  return yPosition; // Return updated position
}

// Export a function that shows how to use drawValuationSummary
export function buildValuationSummarySection(sectionParams: SectionParams, reportData: ReportData): number {
  // Use height and margins in a safely way
  const startY = sectionParams.height ? sectionParams.height - (sectionParams.margins?.top || sectionParams.margin || 40) - 100 : 700;
  
  // Generate narrative if not provided
  const narrative = reportData.narrative || 
    `This valuation report for your ${reportData.year} ${reportData.make} ${reportData.model} ` +
    `provides an estimated market value of $${reportData.estimatedValue?.toLocaleString() || reportData.price.toLocaleString()} ` +
    `based on vehicle condition, mileage, and local market factors.`;
  
  // Call the function with all required parameters
  const yPosition = drawValuationSummary(
    sectionParams, 
    narrative, 
    startY,
    reportData.isPremium,
    true // includeTimestamp 
  );
  
  return yPosition;
}
