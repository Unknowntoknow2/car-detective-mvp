
import { ReportData } from './types';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { mvpPdfStyles, drawStyledHeading, drawStyledBox, drawPremiumBadge } from './styles';

/**
 * Generates a valuation PDF report with MVP design specifications
 * @param data The report data
 * @returns A promise resolving to the PDF as a Uint8Array
 */
export async function generatePdf(data: ReportData): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage([612, 792]); // Letter size
  const { width, height } = page.getSize();
  
  // Embed fonts
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  
  const { margin, sectionGap } = mvpPdfStyles.spacing;
  const { colors, sizes } = mvpPdfStyles;
  
  // Draw header with logo and title
  page.drawRectangle({
    x: 0,
    y: height - 100,
    width,
    height: 100,
    color: colors.backgroundSecondary
  });
  
  page.drawText('Vehicle Valuation Report', {
    x: margin,
    y: height - 50,
    size: sizes.headingLarge,
    font: boldFont,
    color: colors.primary
  });
  
  // If premium, add badge
  if (data.isPremium) {
    drawPremiumBadge(page, width - 150, height - 40, boldFont);
  }
  
  // Draw vehicle details
  let yPosition = height - 120;
  
  page.drawText(`${data.year} ${data.make} ${data.model}`, {
    x: margin,
    y: yPosition,
    size: sizes.headingMedium,
    font: boldFont,
    color: colors.text
  });
  
  yPosition -= 30;
  
  // Draw estimated value in a highlighted box
  const valueBoxHeight = 80;
  const valueBoxWidth = width - (margin * 2);
  
  page.drawRectangle({
    x: margin,
    y: yPosition - valueBoxHeight,
    width: valueBoxWidth,
    height: valueBoxHeight,
    color: colors.highlight,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 4,
  });
  
  // Format numbers for display
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(value);
  };
  
  // Draw estimated value
  page.drawText('Estimated Value:', {
    x: margin + 20,
    y: yPosition - 25,
    size: sizes.headingSmall,
    font: boldFont,
    color: colors.textSecondary
  });
  
  page.drawText(formatCurrency(data.estimatedValue), {
    x: margin + 20,
    y: yPosition - 55,
    size: 28,
    font: boldFont,
    color: colors.primary
  });
  
  // Draw confidence score if available
  if (data.confidenceScore) {
    page.drawText(`Confidence Score: ${data.confidenceScore}%`, {
      x: margin + 220,
      y: yPosition - 25,
      size: sizes.body,
      font: regularFont,
      color: colors.textSecondary
    });
  }
  
  // Show condition - prioritize AI condition if available
  const conditionText = data.aiCondition?.condition || data.condition || 'Not Specified';
  const conditionSource = data.aiCondition ? 'AI-Verified' : 'Owner-Reported';
  
  page.drawText(`Vehicle Condition (${conditionSource}):`, {
    x: width - margin - 200,
    y: yPosition - 25,
    size: sizes.body,
    font: boldFont,
    color: colors.textSecondary
  });
  
  page.drawText(conditionText, {
    x: width - margin - 200,
    y: yPosition - 45,
    size: sizes.headingSmall,
    font: boldFont,
    color: colors.text
  });
  
  // If AI condition is available, show confidence
  if (data.aiCondition?.confidenceScore) {
    page.drawText(`AI Confidence: ${Math.round(data.aiCondition.confidenceScore)}%`, {
      x: width - margin - 200,
      y: yPosition - 65,
      size: sizes.caption,
      font: regularFont,
      color: colors.textSecondary
    });
  }
  
  yPosition = yPosition - valueBoxHeight - sectionGap;
  
  // Draw vehicle specifications section
  yPosition = drawStyledHeading(
    page, 
    'Vehicle Specifications', 
    margin, 
    yPosition, 
    sizes.headingMedium, 
    boldFont
  );
  
  const specs = [
    { label: 'VIN:', value: data.vin || 'Not specified' },
    { label: 'Mileage:', value: `${data.mileage} miles` },
    { label: 'Body Style:', value: data.bodyStyle || 'Not specified' },
    { label: 'Fuel Type:', value: data.fuelType || 'Not specified' },
    { label: 'Color:', value: data.color || 'Not specified' },
    { label: 'Location:', value: data.zipCode || 'Not specified' }
  ];
  
  yPosition -= 15;
  
  // Create a 2-column layout for specs
  const colWidth = (width - (margin * 2) - 20) / 2;
  let leftCol = margin;
  let rightCol = margin + colWidth + 20;
  
  for (let i = 0; i < specs.length; i++) {
    const spec = specs[i];
    const x = i % 2 === 0 ? leftCol : rightCol;
    
    page.drawText(spec.label, {
      x,
      y: yPosition,
      size: sizes.body,
      font: boldFont,
      color: colors.textSecondary
    });
    
    page.drawText(spec.value, {
      x: x + 80,
      y: yPosition,
      size: sizes.body,
      font: regularFont,
      color: colors.text
    });
    
    // Move to next row after every 2 items
    if (i % 2 === 1 || i === specs.length - 1) {
      yPosition -= 20;
    }
  }
  
  yPosition -= sectionGap;
  
  // Draw valuation explanation section if available
  if (data.explanation) {
    yPosition = drawStyledHeading(
      page, 
      'Valuation Explanation', 
      margin, 
      yPosition, 
      sizes.headingMedium, 
      boldFont
    );
    
    yPosition -= 15;
    
    // Split explanation into paragraphs
    const paragraphs = data.explanation.split('\n\n');
    
    for (const paragraph of paragraphs) {
      // Split paragraph into lines that fit the page width
      const words = paragraph.split(' ');
      let line = '';
      const maxWidth = width - (margin * 2);
      
      for (const word of words) {
        const testLine = line + (line ? ' ' : '') + word;
        const textWidth = regularFont.widthOfTextAtSize(testLine, sizes.body);
        
        if (textWidth > maxWidth && line) {
          page.drawText(line, {
            x: margin,
            y: yPosition,
            size: sizes.body,
            font: regularFont,
            color: colors.text
          });
          
          yPosition -= mvpPdfStyles.spacing.lineHeight;
          line = word;
        } else {
          line = testLine;
        }
      }
      
      if (line) {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: sizes.body,
          font: regularFont,
          color: colors.text
        });
        yPosition -= mvpPdfStyles.spacing.lineHeight;
      }
      
      // Add extra space between paragraphs
      yPosition -= 10;
    }
  }
  
  // Draw AI condition assessment if available
  if (data.aiCondition && data.isPremium) {
    yPosition -= sectionGap;
    
    yPosition = drawStyledHeading(
      page, 
      'AI Condition Assessment', 
      margin, 
      yPosition, 
      sizes.headingMedium, 
      boldFont
    );
    
    const conditionBoxHeight = 100;
    yPosition = drawStyledBox(
      page,
      'Condition Analysis',
      margin,
      yPosition - 15,
      width - (margin * 2),
      conditionBoxHeight,
      boldFont,
      regularFont
    );
    
    const conditionY = yPosition + conditionBoxHeight - 40;
    
    page.drawText(`Condition: ${data.aiCondition.condition || 'Not available'}`, {
      x: margin + 20,
      y: conditionY,
      size: sizes.headingSmall,
      font: boldFont,
      color: colors.text
    });
    
    page.drawText(`Confidence Score: ${data.aiCondition.confidenceScore || 0}%`, {
      x: margin + 20,
      y: conditionY - 20,
      size: sizes.body,
      font: regularFont,
      color: colors.textSecondary
    });
    
    // Draw issues detected if available
    if (data.aiCondition.issuesDetected && data.aiCondition.issuesDetected.length > 0) {
      page.drawText('Issues Detected:', {
        x: margin + width/2 - 100,
        y: conditionY,
        size: sizes.body,
        font: boldFont,
        color: colors.textSecondary
      });
      
      let issuesY = conditionY - 20;
      data.aiCondition.issuesDetected.slice(0, 3).forEach(issue => {
        page.drawText(`• ${issue}`, {
          x: margin + width/2 - 100,
          y: issuesY,
          size: sizes.body,
          font: regularFont,
          color: colors.text
        });
        issuesY -= 15;
      });
    }
  }
  
  // Add best photo if available (for premium reports)
  if (data.bestPhotoUrl && data.isPremium) {
    yPosition -= sectionGap;
    
    yPosition = drawStyledHeading(
      page, 
      'Vehicle Photo', 
      margin, 
      yPosition, 
      sizes.headingMedium, 
      boldFont
    );
    
    page.drawText('View the full report online to see all photos', {
      x: margin,
      y: yPosition - 15,
      size: sizes.caption,
      font: italicFont,
      color: colors.textSecondary
    });
  }
  
  // Add footer
  page.drawLine({
    start: { x: margin, y: 50 },
    end: { x: width - margin, y: 50 },
    thickness: 1,
    color: colors.backgroundSecondary
  });
  
  page.drawText('Generated on ' + new Date().toLocaleDateString(), {
    x: margin,
    y: 30,
    size: sizes.caption,
    font: regularFont,
    color: colors.textSecondary
  });
  
  if (data.isPremium) {
    page.drawText('Premium Report', {
      x: width - margin - 100,
      y: 30,
      size: sizes.caption,
      font: boldFont,
      color: colors.primary
    });
  }
  
  // Return PDF as Uint8Array
  return await pdfDoc.save();
}
