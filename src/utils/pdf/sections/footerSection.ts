
import { SectionParams } from '../types';
import { safeMargin, safeDimensions, contentWidth } from './sectionHelper';

/**
 * Draw footer section on the PDF
 */
export const drawFooterSection = (params: SectionParams) => {
  const { doc, data, pageWidth, pageHeight, margin } = params;
  
  // Use the safe helper functions
  const safeMarginValue = safeMargin(margin);
  const { width, height } = safeDimensions(doc);
  const safeContentWidth = contentWidth(width, safeMarginValue);
  
  // Calculate the Y position for the footer (near bottom of page)
  const footerY = height - safeMarginValue - 30;
  
  // Draw a separator line
  doc.strokeColor('#cccccc')
     .lineWidth(1)
     .moveTo(safeMarginValue, footerY)
     .lineTo(width - safeMarginValue, footerY)
     .stroke();
  
  // Draw footer text
  doc.fontSize(8)
     .font('Helvetica')
     .fillColor('#666666')
     .text(
       `Report generated on ${data.reportDate.toLocaleDateString()} by ${data.companyName} | ${data.website}`,
       safeMarginValue,
       footerY + 10,
       {
         width: safeContentWidth,
         align: 'center'
       }
     );
  
  return doc.y;
};
