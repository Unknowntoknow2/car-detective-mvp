
import { SectionParams } from '../types';

/**
 * Draw footer section on the PDF
 */
export const drawFooterSection = (params: SectionParams) => {
  const { doc, data, pageWidth, pageHeight, margin = 40 } = params;
  
  // Calculate the Y position for the footer (near bottom of page)
  const footerY = pageHeight - margin - 30;
  
  // Draw a separator line
  doc.strokeColor('#cccccc')
     .lineWidth(1)
     .moveTo(margin, footerY)
     .lineTo(pageWidth - margin, footerY)
     .stroke();
  
  // Draw footer text
  doc.fontSize(8)
     .font('Helvetica')
     .fillColor('#666666')
     .text(
       `Report generated on ${data.reportDate.toLocaleDateString()} by ${data.companyName} | ${data.website}`,
       margin,
       footerY + 10,
       {
         width: pageWidth - (margin * 2),
         align: 'center'
       }
     );
  
  return doc.y;
};
