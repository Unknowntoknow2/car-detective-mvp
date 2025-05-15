
import { PDFPage, PDFFont, Color, rgb } from 'pdf-lib';
import { ReportData, SectionParams, AdjustmentBreakdown } from '../types';
import { formatCurrency } from '@/utils/formatters';

export const drawAdjustmentTable = (
  params: SectionParams,
  reportData: ReportData
): number => {
  const { margin, contentWidth, regularFont, boldFont } = params;
  const { page, y } = params;
  const { adjustments = [] } = reportData;

  // Draw section title
  page.drawText('Value Adjustments', {
    x: margin,
    y: y - 30,
    size: 14,
    font: boldFont,
    color: rgb(0.1, 0.1, 0.1)
  });

  // Just a stub implementation
  let currentY = y - 60;

  // Draw adjustments
  adjustments.forEach(adjustment => {
    // Draw factor
    page.drawText(adjustment.factor, {
      x: margin,
      y: currentY,
      size: 11,
      font: regularFont,
      color: rgb(0.3, 0.3, 0.3)
    });

    // Draw impact
    const impactText = formatCurrency(adjustment.impact);
    page.drawText(impactText, {
      x: margin + contentWidth - 80,
      y: currentY,
      size: 11,
      font: boldFont,
      color: adjustment.impact >= 0 ? rgb(0.2, 0.6, 0.3) : rgb(0.8, 0.2, 0.2)
    });

    // Draw description
    if (adjustment.description) {
      page.drawText(adjustment.description, {
        x: margin + 10,
        y: currentY - 20,
        size: 9,
        font: regularFont,
        color: rgb(0.5, 0.5, 0.5)
      });
      currentY -= 40;
    } else {
      currentY -= 25;
    }
  });

  return currentY;
};
