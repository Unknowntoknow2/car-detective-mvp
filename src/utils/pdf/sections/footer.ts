
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

/**
 * Add the footer section to the PDF
 * @param params Section parameters
 * @returns The new Y position after adding the section
 */
export async function addFooterSection(params: SectionParams): Promise<number> {
  const { page, fonts, options, margin, pageWidth } = params;
  const y = params.y ?? 30;
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: y + 15 },
    end: { x: pageWidth - margin, y: y + 15 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  return y - 10;
}
