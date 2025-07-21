import { PDFDocument, PDFPage, rgb, StandardFonts } from 'pdf-lib';
import { formatCurrency } from '@/utils/formatters/formatCurrency';
import { formatDate } from '@/utils/formatters/formatDate';
import type { UnifiedValuationResult } from '@/types/valuation';

export async function generateValuationPdf(result: UnifiedValuationResult): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([612, 792]); // US Letter size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  const { width, height } = page.getSize();
  const margin = 50;
  let yPosition = height - margin;

  // Colors
  const primaryColor = rgb(0.2, 0.4, 0.8);
  const successColor = rgb(0.1, 0.6, 0.1);
  const textColor = rgb(0.1, 0.1, 0.1);
  const lightGray = rgb(0.9, 0.9, 0.9);

  // Helper function to add text
  const addText = (text: string, options: {
    x?: number;
    y?: number;
    size?: number;
    font?: any;
    color?: any;
    align?: 'left' | 'center' | 'right';
  } = {}) => {
    const {
      x = margin,
      y = yPosition,
      size = 12,
      font: textFont = font,
      color = textColor,
      align = 'left'
    } = options;

    let xPos = x;
    if (align === 'center') {
      const textWidth = textFont.widthOfTextAtSize(text, size);
      xPos = (width - textWidth) / 2;
    } else if (align === 'right') {
      const textWidth = textFont.widthOfTextAtSize(text, size);
      xPos = width - margin - textWidth;
    }

    page.drawText(text, {
      x: xPos,
      y: y,
      size,
      font: textFont,
      color,
    });

    if (y === yPosition) {
      yPosition -= size + 8;
    }
  };

  // Helper function to add section divider
  const addDivider = () => {
    yPosition -= 10;
    page.drawLine({
      start: { x: margin, y: yPosition },
      end: { x: width - margin, y: yPosition },
      thickness: 1,
      color: lightGray,
    });
    yPosition -= 20;
  };

  // Header
  page.drawRectangle({
    x: 0,
    y: height - 80,
    width: width,
    height: 80,
    color: primaryColor,
  });

  addText('VEHICLE VALUATION REPORT', {
    y: height - 35,
    size: 24,
    font: boldFont,
    color: rgb(1, 1, 1),
    align: 'center'
  });

  addText('Professional Vehicle Appraisal', {
    y: height - 55,
    size: 12,
    color: rgb(0.9, 0.9, 0.9),
    align: 'center'
  });

  yPosition = height - 120;

  // Vehicle Information Section
  addText('VEHICLE INFORMATION', { font: boldFont, size: 16, color: primaryColor });
  yPosition -= 5;

  const vehicleInfo = [
    ['Vehicle:', `${result.vehicle.year} ${result.vehicle.make} ${result.vehicle.model} ${result.vehicle.trim || ''}`],
    ['Mileage:', `${result.mileage?.toLocaleString() || 'N/A'} miles`],
    ['Location:', `ZIP ${result.zip}`],
    ['Fuel Type:', result.vehicle.fuelType || 'N/A'],
    ['Report Date:', formatDate(new Date(result.timestamp))]
  ];

  vehicleInfo.forEach(([label, value]) => {
    addText(label, { size: 10, font: boldFont });
    addText(value, { x: margin + 100, y: yPosition + 10 + 8, size: 10 });
  });

  addDivider();

  // Enhanced Title & Safety Information (if available)
  if (result.titleRecallInfo || result.titleStatus || (result.recalls && result.recalls.length > 0)) {
    addText('TITLE & SAFETY INFORMATION', { font: boldFont, size: 16, color: primaryColor });
    yPosition -= 5;

    // Enhanced title information from titleRecallInfo
    if (result.titleRecallInfo) {
      const titleColor = result.titleRecallInfo.titleStatus === 'Clean' ? successColor : rgb(0.8, 0.2, 0.2);
      addText('Title Status:', { size: 10, font: boldFont });
      addText(result.titleRecallInfo.titleStatus, { 
        x: margin + 100, 
        y: yPosition + 10 + 8, 
        size: 10, 
        color: titleColor 
      });
      
      if (result.titleRecallInfo.brandedDetails) {
        addText('Details:', { size: 10, font: boldFont });
        const details = result.titleRecallInfo.brandedDetails.length > 50 
          ? result.titleRecallInfo.brandedDetails.substring(0, 47) + '...'
          : result.titleRecallInfo.brandedDetails;
        addText(details, { 
          x: margin + 100, 
          y: yPosition + 10 + 8, 
          size: 9 
        });
      }

      // Enhanced recall information
      if (result.titleRecallInfo.recalls.length > 0) {
        addText('Safety Recalls:', { size: 10, font: boldFont });
        addText(`${result.titleRecallInfo.recalls.length} recall(s) found`, { 
          x: margin + 100, 
          y: yPosition + 10 + 8, 
          size: 10, 
          color: rgb(0.8, 0.2, 0.2) 
        });
        
        // List first 3 recalls with risk levels
        result.titleRecallInfo.recalls.slice(0, 3).forEach((recall, index) => {
          const riskColor = recall.riskLevel === 'Critical' ? rgb(0.8, 0.1, 0.1) : 
                           recall.riskLevel === 'Important' ? rgb(0.8, 0.5, 0.1) : 
                           rgb(0.3, 0.3, 0.3);
          
          const truncatedSummary = recall.summary.length > 45 ? recall.summary.substring(0, 42) + '...' : recall.summary;
          addText(`• [${recall.riskLevel}] ${truncatedSummary}`, { 
            x: margin + 20, 
            y: yPosition + 10 + 8 - ((index + 1) * 12), 
            size: 9,
            color: riskColor
          });
        });
        
        if (result.titleRecallInfo.recalls.length > 3) {
          yPosition -= (3 * 12);
          addText(`... and ${result.titleRecallInfo.recalls.length - 3} more recall(s)`, { 
            x: margin + 20, 
            size: 9, 
            color: rgb(0.5, 0.5, 0.5) 
          });
        }
        
        // Add data verification note
        addText('Data verified by OpenAI Web Intelligence', { 
          x: margin, 
          size: 8, 
          color: rgb(0.4, 0.4, 0.4) 
        });
      }
    } 
    // Fallback to legacy title/recall data
    else {
      if (result.titleStatus) {
        const titleColor = result.titleStatus === 'clean' ? successColor : rgb(0.8, 0.2, 0.2);
        addText('Title Status:', { size: 10, font: boldFont });
        addText(result.titleStatus.charAt(0).toUpperCase() + result.titleStatus.slice(1), { 
          x: margin + 100, 
          y: yPosition + 10 + 8, 
          size: 10, 
          color: titleColor 
        });
      }

      if (result.recalls && result.recalls.length > 0) {
        addText('Open Recalls:', { size: 10, font: boldFont });
        addText(`${result.recalls.length} active recall(s)`, { 
          x: margin + 100, 
          y: yPosition + 10 + 8, 
          size: 10, 
          color: rgb(0.8, 0.2, 0.2) 
        });
        
        // List first 3 recalls
        result.recalls.slice(0, 3).forEach((recall, index) => {
          const truncatedRecall = recall.length > 60 ? recall.substring(0, 57) + '...' : recall;
          addText(`• ${truncatedRecall}`, { 
            x: margin + 20, 
            y: yPosition + 10 + 8 - ((index + 1) * 12), 
            size: 9 
          });
        });
        
        if (result.recalls.length > 3) {
          yPosition -= (3 * 12);
          addText(`... and ${result.recalls.length - 3} more recall(s)`, { 
            x: margin + 20, 
            size: 9, 
            color: rgb(0.5, 0.5, 0.5) 
          });
        } else {
          yPosition -= ((result.recalls.length - 1) * 12);
        }
      }
    }

    addDivider();
  }

  // Enhanced Market Listings section (if available)
  const enhancedListings = result.listings?.filter(listing => 
    ['facebook', 'craigslist', 'offerup', 'ebay', 'amazon'].includes(listing.source?.toLowerCase() || '')
  ) || [];

  if (enhancedListings.length > 0) {
    addText('ENHANCED MARKET ANALYSIS', { font: boldFont, size: 16, color: primaryColor });
    yPosition -= 5;

    // Platform breakdown
    const platformCounts: Record<string, number> = {};
    enhancedListings.forEach(listing => {
      const platform = listing.source?.toLowerCase() || 'other';
      platformCounts[platform] = (platformCounts[platform] || 0) + 1;
    });

    const platformSummary = Object.entries(platformCounts)
      .map(([platform, count]) => `${count} ${platform.charAt(0).toUpperCase() + platform.slice(1)}`)
      .join(', ');

    addText('Enhanced Listings:', { size: 10, font: boldFont });
    addText(platformSummary, { 
      x: margin + 100, 
      y: yPosition + 10 + 8, 
      size: 10 
    });

    // Price range from enhanced listings
    if (enhancedListings.length > 1) {
      const prices = enhancedListings.map(l => l.price).sort((a, b) => a - b);
      addText('Price Range:', { size: 10, font: boldFont });
      addText(`$${prices[0].toLocaleString()} - $${prices[prices.length - 1].toLocaleString()}`, { 
        x: margin + 100, 
        y: yPosition + 10 + 8, 
        size: 10 
      });
    }

    addText('Data Verified by:', { size: 10, font: boldFont });
    addText('OpenAI Web Intelligence', { 
      x: margin + 100, 
      y: yPosition + 10 + 8, 
      size: 10, 
      color: primaryColor 
    });

    addDivider();
  }

  // Valuation Summary
  addText('VALUATION SUMMARY', { font: boldFont, size: 16, color: primaryColor });
  yPosition -= 5;

  // Final Value (highlighted)
  page.drawRectangle({
    x: margin,
    y: yPosition - 25,
    width: width - 2 * margin,
    height: 35,
    color: rgb(0.95, 0.98, 1),
  });

  addText('ESTIMATED MARKET VALUE', { font: boldFont, size: 12, y: yPosition - 8 });
  addText(formatCurrency(result.finalValue), {
    font: boldFont,
    size: 20,
    color: successColor,
    align: 'right',
    y: yPosition - 8
  });

  yPosition -= 45;

  addText(`Confidence Score: ${result.confidenceScore}%`, { size: 10 });
  yPosition -= 5;

  addDivider();

  // Value Breakdown
  addText('VALUE BREAKDOWN', { font: boldFont, size: 16, color: primaryColor });
  yPosition -= 5;

  addText('Base Value', { size: 10, font: boldFont });
  addText(formatCurrency(result.baseValue), { align: 'right', size: 10, y: yPosition + 10 + 8 });

  result.adjustments.forEach((adj) => {
    const sign = adj.amount >= 0 ? '+' : '';
    const color = adj.amount >= 0 ? successColor : rgb(0.8, 0.2, 0.2);
    
    addText(`${adj.label} - ${adj.reason}`, { size: 10 });
    addText(`${sign}${formatCurrency(adj.amount)}`, {
      align: 'right',
      size: 10,
      color,
      y: yPosition + 10 + 8
    });
  });

  // Final calculation line
  yPosition -= 5;
  page.drawLine({
    start: { x: width - margin - 150, y: yPosition },
    end: { x: width - margin, y: yPosition },
    thickness: 1,
    color: textColor,
  });
  yPosition -= 15;

  addText('FINAL ESTIMATED VALUE', { font: boldFont, size: 12 });
  addText(formatCurrency(result.finalValue), {
    align: 'right',
    font: boldFont,
    size: 12,
    color: successColor,
    y: yPosition + 12 + 8
  });

  addDivider();

  // Market Data Section
  if (result.listingRange && result.listingCount > 0) {
    addText('MARKET ANALYSIS', { font: boldFont, size: 16, color: primaryColor });
    yPosition -= 5;

    addText(`${result.listingCount} comparable listings analyzed`, { size: 10 });
    addText(`Market Range: ${formatCurrency(result.listingRange.min)} - ${formatCurrency(result.listingRange.max)}`, { size: 10 });
    addText(`Market Status: ${result.marketSearchStatus}`, { size: 10 });

    addDivider();
  }

  // AI Explanation
  addText('VALUATION ANALYSIS', { font: boldFont, size: 16, color: primaryColor });
  yPosition -= 5;

  // Split explanation into lines that fit
  const explanationLines = splitTextIntoLines(result.aiExplanation || 'No explanation available', width - 2 * margin, font, 10);
  explanationLines.forEach((line) => {
    if (yPosition < 100) {
      // Add new page if needed
      const newPage = pdfDoc.addPage([612, 792]);
      Object.assign(page, newPage);
      yPosition = height - margin;
    }
    addText(line, { size: 10 });
  });

  addDivider();

  // Data Sources
  addText('DATA SOURCES', { font: boldFont, size: 12, color: primaryColor });
  yPosition -= 5;

  result.sources.forEach((source) => {
    addText(`• ${source}`, { size: 9 });
  });

  // Footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: 60,
    color: lightGray,
  });

  addText('This report is generated using advanced AI valuation algorithms and real-time market data.', {
    y: 35,
    size: 8,
    align: 'center'
  });

  addText(`Generated on ${formatDate(new Date(), 'PPp')} | Report ID: ${result.timestamp}`, {
    y: 20,
    size: 8,
    align: 'center'
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: 'application/pdf' });
}

// Helper function to split text into lines
function splitTextIntoLines(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  words.forEach((word) => {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
      }
      currentLine = word;
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

export async function downloadValuationPdf(result: UnifiedValuationResult): Promise<void> {
  const pdfBlob = await generateValuationPdf(result);
  const url = URL.createObjectURL(pdfBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `valuation-report-${result.vehicle.year}-${result.vehicle.make}-${result.vehicle.model}-${Date.now()}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}