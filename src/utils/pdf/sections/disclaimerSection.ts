
import { SectionParams } from '../types';
import { rgb } from 'pdf-lib';

export async function addDisclaimerSection(params: SectionParams): Promise<number> {
  const { page, startY, width, fonts, textColor, margin } = params;
  
  const disclaimerText = "This valuation is an estimate based on market data and should not be considered as a guaranteed price.";
  
  page.drawText(disclaimerText, {
    x: margin,
    y: startY - 50,
    size: 10,
    font: fonts.regular,
    color: textColor || rgb(0.4, 0.4, 0.4),
  });
  
  return startY - 80;
}
