
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

interface FooterSectionProps {
  width: number;
  height: number;
  margin: number;
  regularFont: PDFFont;
  includeTimestamp?: boolean;
}

/**
 * Draw footer section on the PDF
 */
export async function drawFooterSection(
  page: PDFPage,
  props: FooterSectionProps
): Promise<void> {
  const { width, height, margin, regularFont, includeTimestamp = true } = props;
  const footerY = margin;
  
  // Draw branding text
  page.drawText('Report Powered by Car Price Perfector', { 
    x: margin, 
    y: footerY, 
    size: 10, 
    font: regularFont,
    color: rgb(0.3, 0.3, 0.3)
  });
  
  // Draw disclaimer text
  page.drawText('This estimate is based on market data and vehicle condition. Verify with a professional inspection.', { 
    x: margin, 
    y: footerY - 15, 
    size: 10, 
    font: regularFont, 
    color: rgb(0.5, 0.5, 0.5) 
  });
  
  // Draw timestamp if needed
  if (includeTimestamp) {
    const now = new Date();
    const timestamp = now.toLocaleString();
    const timestampWidth = regularFont.widthOfTextAtSize(timestamp, 8);
    
    page.drawText(timestamp, {
      x: width - margin - timestampWidth,
      y: footerY,
      size: 8,
      font: regularFont,
      color: rgb(0.6, 0.6, 0.6)
    });
  }
  
  // Draw page number
  const pageText = 'Page 1 of 1';
  const pageWidth = regularFont.widthOfTextAtSize(pageText, 8);
  
  page.drawText(pageText, {
    x: width - margin - pageWidth,
    y: footerY - 15,
    size: 8,
    font: regularFont,
    color: rgb(0.6, 0.6, 0.6)
  });
}
