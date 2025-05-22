
import { SectionParams } from '../types';
import { safeString } from './sectionHelper';

/**
 * Draw a watermark on the PDF
 */
export const drawWatermark = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  const pageWidth = params.pageWidth || doc.page.width;
  const pageHeight = params.pageHeight || doc.page.height;
  
  // Only draw watermark for non-premium reports
  if (data.isPremium) {
    return doc.y;
  }
  
  // Set up watermark text
  const watermarkText = 'DRAFT VALUATION';
  
  // Save the current graphics state
  doc.save();
  
  // Set up transparency and rotation for watermark
  doc.opacity(0.2);
  doc.rotate(45, {
    origin: [pageWidth / 2, pageHeight / 2]
  });
  
  // Draw the watermark text
  doc.fontSize(60)
     .fillColor('#999999')
     .text(watermarkText, 
           0, 
           pageHeight / 2 - 30, 
           {
             align: 'center',
             width: pageWidth
           });
  
  // Restore the graphics state
  doc.restore();
  
  return doc.y;
};

/**
 * Draw a premium watermark on the PDF
 */
export const drawPremiumWatermark = (params: SectionParams): number => {
  const { doc, data, margin = 40 } = params;
  const pageWidth = params.pageWidth || doc.page.width;
  const pageHeight = params.pageHeight || doc.page.height;
  
  // Only draw premium watermark for premium reports
  if (!data.isPremium) {
    return doc.y;
  }
  
  // Set up watermark text
  const watermarkText = 'PREMIUM REPORT';
  
  // Save the current graphics state
  doc.save();
  
  // Draw small premium indicator in the top-right corner
  doc.opacity(0.7);
  doc.fontSize(10)
     .fillColor('#007bff')
     .text('PREMIUM', 
           pageWidth - 80, 
           20, 
           {
             align: 'right'
           });
  
  // Restore the graphics state
  doc.restore();
  
  return doc.y;
};
