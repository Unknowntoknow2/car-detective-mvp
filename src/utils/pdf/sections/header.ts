
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

/**
 * Add the header section to the PDF
 * @param params Section parameters
 * @returns The new Y position after adding the section
 */
export async function addHeaderSection(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY;
  
  // Draw title
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y,
    size: 24,
    font: fonts.bold,
    color: params.textColor || rgb(0.1, 0.1, 0.1),
  });
  
  return y - 50;
}
