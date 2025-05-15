
import { SectionParams, ReportData } from '../types';

/**
 * Draw a section heading
 * @param params Section parameters
 * @param title The heading title
 * @param yPosition Current Y position
 * @returns New Y position after drawing heading
 */
export function drawSectionHeading(
  params: SectionParams,
  title: string,
  yPosition: number
): number {
  const { page, margin, boldFont, primaryColor } = params;
  
  page.drawText(title, {
    x: margin,
    y: yPosition,
    size: 16,
    font: boldFont,
    color: primaryColor
  });
  
  return yPosition - 25; // Return new position after heading
}

/**
 * Draw a text field with label and value
 * @param params Section parameters
 * @param label Field label
 * @param value Field value
 * @param yPosition Current Y position
 * @returns New Y position after drawing field
 */
export function drawTextField(
  params: SectionParams,
  label: string,
  value: string | number,
  yPosition: number
): number {
  const { page, margin, regularFont, boldFont, textColor, secondaryColor } = params;
  
  // Draw label
  page.drawText(label, {
    x: margin,
    y: yPosition,
    size: 12,
    font: boldFont,
    color: secondaryColor
  });
  
  // Draw value (format numbers if needed)
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value.toString();
  
  page.drawText(displayValue, {
    x: margin + 150, // Offset for value
    y: yPosition,
    size: 12,
    font: regularFont,
    color: textColor
  });
  
  return yPosition - 20; // Return new position after field
}

/**
 * Draw a horizontal line
 * @param params Section parameters
 * @param yPosition Current Y position
 * @returns New Y position after drawing line
 */
export function drawHorizontalLine(
  params: SectionParams,
  yPosition: number
): number {
  const { page, margin, width, secondaryColor } = params;
  
  page.drawLine({
    start: { x: margin, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: secondaryColor
  });
  
  return yPosition - 15; // Return new position after line
}
