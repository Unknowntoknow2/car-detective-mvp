
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

/**
 * Add the summary section to the PDF
 * @param params Section parameters
 * @returns The new Y position after adding the section
 */
export async function addSummarySection(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width } = params;
  const y = params.y ?? params.startY - 50;
  
  // Draw section title
  page.drawText('Vehicle Summary', {
    x: margin,
    y,
    size: 18,
    font: fonts.bold,
    color: params.textColor || rgb(0.1, 0.1, 0.1),
  });
  
  return y - 100;
}
