import { Color, PDFFont, PDFPage, rgb } from "pdf-lib";
import { ReportData, SectionParams } from "../types";
import { formatCurrency } from "@/utils/formatters";

<<<<<<< HEAD
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export async function addValuationSection(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY - 150;
  const textColor = params.textColor || rgb(0.1, 0.1, 0.1);
  const primaryColor = params.primaryColor || rgb(0.2, 0.4, 0.8);
  
  // Draw section title
  page.drawText('Vehicle Valuation', {
    x: margin,
    y,
    size: 18,
    font: fonts.bold,
    color: textColor,
=======
export const drawValuationSection = (
  params: SectionParams,
  reportData: ReportData,
): number => {
  // This is just a stub implementation to fix the error
  // The actual implementation would be more complex
  const { page, y, width, margin, boldFont, regularFont } = params;

  // Draw title
  page.drawText("Valuation", {
    x: margin,
    y: y - 20,
    size: 16,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1),
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
  
  let currentY = y - 40;
  
  // Draw estimated value in large font
  const estimatedValueText = `$${data.estimatedValue.toLocaleString()}`;
  
  page.drawText('Estimated Value:', {
    x: margin,
<<<<<<< HEAD
    y: currentY,
    size: 14,
    font: fonts.regular,
    color: textColor,
=======
    y: y - 50,
    size: 24,
    font: boldFont,
    color: rgb(0.2, 0.5, 0.8),
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  });
  
  const valueTextWidth = 180;
  
  page.drawText(estimatedValueText, {
    x: pageWidth - margin - valueTextWidth,
    y: currentY,
    size: 18,
    font: fonts.bold,
    color: primaryColor,
  });
  
  currentY -= 30;
  
  // Draw price range if available
  if (data.priceRange && Array.isArray(data.priceRange) && data.priceRange.length === 2) {
    const priceRangeValues = data.priceRange as [number, number];
    
    page.drawText('Price Range:', {
      x: margin,
      y: currentY,
      size: 14,
      font: fonts.regular,
      color: textColor,
    });
    
    const rangeText = `$${priceRangeValues[0].toLocaleString()} - $${priceRangeValues[1].toLocaleString()}`;
    
    page.drawText(rangeText, {
      x: pageWidth - margin - valueTextWidth,
      y: currentY,
      size: 14,
      font: fonts.bold,
      color: textColor,
    });
    
    currentY -= 30;
  }
  
  // Draw confidence score
  page.drawText('Confidence Score:', {
    x: margin,
    y: currentY,
    size: 14,
    font: fonts.regular,
    color: textColor,
  });
  
  page.drawText(`${data.confidenceScore}%`, {
    x: pageWidth - margin - valueTextWidth,
    y: currentY,
    size: 14,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 40;
  
  // Draw note about the valuation
  page.drawText('Note:', {
    x: margin,
    y: currentY,
    size: 10,
    font: fonts.bold,
    color: textColor,
  });
  
  currentY -= 15;
  
  const noteText = 'This valuation is based on the vehicle details provided, current market conditions, and similar vehicles in your area. Actual sale prices may vary.';
  
  page.drawText(noteText, {
    x: margin,
    y: currentY,
    size: 10,
    font: fonts.regular,
    color: textColor,
    maxWidth: pageWidth - (margin * 2),
    lineHeight: 12,
  });
  
  return currentY - 30;
}
