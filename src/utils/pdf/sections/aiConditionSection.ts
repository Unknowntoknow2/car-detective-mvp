
// This function draws the AI condition section in the PDF report
export const drawAIConditionSection = (
  doc: any,
  data: any,
  startY: number,
  options: any = {},
  endY: number = 0
) => {
  // Default options
  const defaultOptions = {
    pageWidth: doc.internal.pageSize.width,
    margin: 40,
    textColor: '#333333',
    headingColor: '#023047',
    subheadingColor: '#00b894',
    lineHeight: 12,
    fontSize: 10,
    headingFontSize: 14,
    subheadingFontSize: 12
  };

  // Merge options
  const opts = { ...defaultOptions, ...options };
  
  let currentY = startY + 10;
  
  // Check if we have AI condition data
  if (!data?.aiCondition) {
    // If no data, just return the current Y position
    return currentY;
  }
  
  // Extract AI condition data
  const { condition, confidenceScore, issuesDetected, aiSummary } = data.aiCondition;
  
  // Draw section header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(opts.headingFontSize);
  doc.setTextColor(opts.headingColor);
  doc.text('AI Condition Assessment', opts.margin, currentY);
  currentY += opts.lineHeight;
  
  // Draw horizontal line
  doc.setDrawColor(200, 200, 200);
  doc.line(opts.margin, currentY, opts.pageWidth - opts.margin, currentY);
  currentY += opts.lineHeight;
  
  // Draw condition score
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(opts.fontSize);
  doc.setTextColor(opts.textColor);
  
  if (condition) {
    doc.text(`Condition: ${condition}`, opts.margin, currentY);
    currentY += opts.lineHeight;
  }
  
  if (confidenceScore) {
    doc.text(`Confidence Score: ${confidenceScore}%`, opts.margin, currentY);
    currentY += opts.lineHeight;
  }
  
  // Draw AI summary if available
  if (aiSummary) {
    currentY += opts.lineHeight / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(opts.subheadingFontSize);
    doc.setTextColor(opts.subheadingColor);
    doc.text('AI Assessment Summary', opts.margin, currentY);
    currentY += opts.lineHeight;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(opts.fontSize);
    doc.setTextColor(opts.textColor);
    
    // Split long text into multiple lines
    const textLines = doc.splitTextToSize(aiSummary, opts.pageWidth - (opts.margin * 2));
    
    // Check if we need to create a new page
    if (endY > 0 && currentY + (textLines.length * opts.lineHeight) > endY) {
      doc.addPage();
      currentY = opts.margin + opts.lineHeight;
    }
    
    textLines.forEach((line: string) => {
      doc.text(line, opts.margin, currentY);
      currentY += opts.lineHeight;
    });
  }
  
  // Draw issues detected if available
  if (issuesDetected && issuesDetected.length > 0) {
    currentY += opts.lineHeight / 2;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(opts.subheadingFontSize);
    doc.setTextColor(opts.subheadingColor);
    doc.text('Issues Detected', opts.margin, currentY);
    currentY += opts.lineHeight;
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(opts.fontSize);
    doc.setTextColor(opts.textColor);
    
    issuesDetected.forEach((issue: string, index: number) => {
      doc.text(`${index + 1}. ${issue}`, opts.margin + 5, currentY);
      currentY += opts.lineHeight;
    });
  }
  
  return currentY;
};
