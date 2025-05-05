
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

/**
 * Draw footer section on the PDF
 */
export function drawFooterSection(
  page: PDFPage,
  footerY: number,
  margin: number,
  fonts: {
    regular: PDFFont;
  },
  branding: string = 'Report Powered by Car Price Perfector'
): void {
  const { regular } = fonts;
  
  // Draw branding text
  page.drawText(branding, 
    { x: margin, y: footerY, size: 10, font: regular });
  
  // Draw disclaimer text
  page.drawText('This estimate is based on market data and vehicle condition. Verify with a professional inspection.', 
    { x: margin, y: footerY - 15, size: 10, font: regular, color: rgb(0.5, 0.5, 0.5) });
}
