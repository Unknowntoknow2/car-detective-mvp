
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

export async function addHeaderSection(params: SectionParams): Promise<number> {
  const { page, fonts, data, margin, width, pageWidth } = params;
  const y = params.y ?? params.startY - 50;
  
  // Draw title
  page.drawText(`${data.year} ${data.make} ${data.model} Valuation Report`, {
    x: margin,
    y,
    size: 20,
    font: fonts.bold,
    color: params.textColor || rgb(0.1, 0.1, 0.1),
  });
  
  return y - 40;
}
