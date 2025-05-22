
/**
 * Draw a disclaimer section on the PDF
 */
export const drawDisclaimerSection = (doc: any, options: { disclaimerText: string }) => {
  // Mock implementation
  doc.fontSize(8)
     .font('Helvetica')
     .text(options.disclaimerText, 50, doc.page.height - 50, { width: 500 });
  
  return doc.y;
};
