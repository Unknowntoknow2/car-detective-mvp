
import { SectionParams } from '../types';

export const drawDisclaimerSection = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  
  // Current Y position
  const currentY = doc.y + 20;
  
  // Draw disclaimer text
  doc.fontSize(9)
     .font('Helvetica-Italic')
     .fillColor('#888888')
     .text(
       data.disclaimerText || 'This valuation is an estimate based on market data and may not reflect the actual value of this specific vehicle. Factors such as actual condition, local market variations, and unique vehicle history can affect the real-world value.',
       margin,
       currentY,
       {
         width: doc.page.width - (margin * 2),
         align: 'left'
       }
     );
  
  return doc.y + 10;
};
