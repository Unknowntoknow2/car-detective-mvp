
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
  
  for (const word of words) {
    const testLine = currentLine + word + ' ';
    if (regularFont.widthOfTextAtSize(testLine, 12) > contentWidth) {
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
  let yPosition = sectionParams.height - sectionParams.margin - 100; // Starting position
  
  // Generate narrative if not provided
  const narrative = reportData.narrative || 
    `This valuation report for your ${reportData.year} ${reportData.make} ${reportData.model} ` +
    `provides an estimated market value of $${reportData.estimatedValue.toLocaleString()} ` +
    `based on vehicle condition, mileage, and local market factors.`;
  
  // Call the function with all required parameters
  yPosition = drawValuationSummary(
    sectionParams, 
    narrative, 
    yPosition,
    reportData.isPremium,
    true // includeTimestamp 
  );
  
  return yPosition;
}
