
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawFooterSection(params: SectionParams): void {
  const { page, margin, width, fonts, textColor, options } = params;
  
  const { height } = page.getSize();
  const footerY = 20; // 20 points from bottom
  
  // Draw a thin line above the footer
  page.drawLine({
    start: { x: margin, y: footerY + 10 },
    end: { x: width - margin, y: footerY + 10 },
    thickness: 0.5,
    color: rgb(0.8, 0.8, 0.8),
  });
  
  // Draw copyright text
  const copyrightText = '© ' + new Date().getFullYear() + ' Car Detective - All Rights Reserved';
  
  page.drawText(copyrightText, {
    x: margin,
    y: footerY,
    size: 8,
    font: fonts.regular,
    color: textColor,
    opacity: 0.7,
  });
  
  // Draw page number on the right
  const pageText = 'Page 1';
  const pageTextWidth = fonts.regular.widthOfTextAtSize(pageText, 8);
  
  page.drawText(pageText, {
    x: width - margin - pageTextWidth,
    y: footerY,
    size: 8,
    font: fonts.regular,
    color: textColor,
    opacity: 0.7,
  });
}
