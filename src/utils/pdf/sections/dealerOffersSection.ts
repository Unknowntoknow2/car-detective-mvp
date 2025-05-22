
/**
 * Draw dealer offers section on the PDF
 */
export const drawDealerOffersSection = (doc: any, data: any, y: number) => {
  // Mock implementation
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Dealer Offers', 50, y);
  
  return doc.y + 20; // Return the new Y position
};
