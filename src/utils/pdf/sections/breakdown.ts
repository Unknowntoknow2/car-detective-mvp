
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

/**
 * Add the price breakdown section to the PDF
 * @param params Section parameters
 * @returns The new Y position after adding the section
 */
export async function addBreakdownSection(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY - 150;
  
  // Draw section title
  page.drawText('Price Breakdown', {
    x: margin,
    y,
    size: 18,
    font: fonts.bold,
    color: params.textColor || rgb(0.1, 0.1, 0.1),
  });
  
  return y - 100;
}
