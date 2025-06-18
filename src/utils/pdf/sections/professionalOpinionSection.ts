
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

export async function addProfessionalOpinionSection(params: SectionParams): Promise<number> {
  const { page, startY, width, data, fonts, textColor, primaryColor, options, margin } = params;
  
  const opinionText = `Based on our analysis, this ${data.year} ${data.make} ${data.model} is valued at $${data.estimatedValue.toLocaleString()}.`;
  
  page.drawText('Professional Opinion', {
    x: margin,
    y: startY - 50,
    size: 16,
    font: fonts.bold,
    color: primaryColor || rgb(0.2, 0.4, 0.8),
  });
  
  page.drawText(opinionText, {
    x: margin,
    y: startY - 80,
    size: 12,
    font: fonts.regular,
    color: textColor || rgb(0.1, 0.1, 0.1),
  });
  
  return startY - 120;
}
