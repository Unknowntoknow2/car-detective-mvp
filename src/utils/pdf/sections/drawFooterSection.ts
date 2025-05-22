
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export async function drawFooterSection(params: SectionParams): Promise<number> {
  const { page, fonts, options, margin, pageWidth } = params;
  const y = params.y ?? 30;
  const textColor = params.textColor || rgb(0.1, 0.1, 0.1);
  
  // Draw horizontal line
  page.drawLine({
    start: { x: margin, y: y + 15 },
    end: { x: pageWidth - margin, y: y + 15 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Draw footer text
  if (options.includeFooter && options.footerText) {
    page.drawText(options.footerText, {
      x: pageWidth / 2 - 100,
      y: y - 5,
      size: 8,
      font: fonts.regular,
      color: rgb(0.5, 0.5, 0.5),
    });
  }
  
  return y - 10;
}
