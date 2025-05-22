import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ReportData, ReportOptions } from '../types';

/**
 * Generate a premium PDF report for a vehicle valuation
 * with enhanced features and visuals
 */
export async function generatePremiumReport(
  data: ReportData,
  options: ReportOptions
): Promise<Uint8Array> {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page to the document
  const page = pdfDoc.addPage();
  
  // Get the standard font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Set up colors
  const textColor = rgb(0.1, 0.1, 0.1);
  const primaryColor = rgb(0.2, 0.4, 0.8);
  const accentColor = rgb(0.9, 0.5, 0.1);
  
  // Page dimensions
  const { width, height } = page.getSize();
  const margin = 50;
  const contentWidth = width - (margin * 2);
  
  // Y position tracker (start from top)
  let y = height - margin;
  
  // Add premium header with logo
  // Add header section with logo and premium styling
  page.drawText('PREMIUM VEHICLE VALUATION REPORT', {
    x: margin,
    y,
    size: 18,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 30;
  
  // Add vehicle information with enhanced styling
  page.drawText(`${data.year} ${data.make} ${data.model} ${data.trim || ''}`, {
    x: margin,
    y,
    size: 16,
    font: boldFont,
    color: textColor,
  });
  
  y -= 25;
  
  // Add vehicle details in a styled box
  page.drawRectangle({
    x: margin,
    y: y - 80,
    width: contentWidth,
    height: 80,
    color: rgb(0.95, 0.95, 0.95),
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 1,
  });
  
  // Add vehicle details
  page.drawText(`VIN: ${data.vin || 'Not provided'}`, {
    x: margin + 10,
    y: y - 20,
    size: 10,
    font,
    color: textColor,
  });
  
  page.drawText(`Mileage: ${data.mileage.toLocaleString()} miles`, {
    x: margin + 10,
    y: y - 40,
    size: 10,
    font,
    color: textColor,
  });
  
  page.drawText(`Location: ${data.zipCode || 'Not provided'}`, {
    x: margin + 10,
    y: y - 60,
    size: 10,
    font,
    color: textColor,
  });
  
  // Add details on the right side
  page.drawText(`Color: ${data.color || 'Not provided'}`, {
    x: margin + contentWidth / 2,
    y: y - 20,
    size: 10,
    font,
    color: textColor,
  });
  
  page.drawText(`Transmission: ${data.transmission || 'Not provided'}`, {
    x: margin + contentWidth / 2,
    y: y - 40,
    size: 10,
    font,
    color: textColor,
  });
  
  page.drawText(`Fuel Type: ${data.fuelType || 'Not provided'}`, {
    x: margin + contentWidth / 2,
    y: y - 60,
    size: 10,
    font,
    color: textColor,
  });
  
  y -= 100;
  
  // Add valuation section with chart
  page.drawText('ESTIMATED VALUE', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 20;
  
  // Draw a box for the estimated value
  page.drawRectangle({
    x: margin,
    y: y - 40,
    width: contentWidth,
    height: 40,
    color: rgb(0.9, 0.95, 1),
    borderColor: primaryColor,
    borderWidth: 2,
  });
  
  // Add the estimated value with currency formatting
  const formattedValue = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(data.estimatedValue);
  
  page.drawText(formattedValue, {
    x: margin + contentWidth / 2 - 50, // Approximate center
    y: y - 25,
    size: 18,
    font: boldFont,
    color: rgb(0.2, 0.6, 0.2),
  });
  
  y -= 60;
  
  // Add price range if available
  if (data.priceRange && data.priceRange.length === 2) {
    page.drawText('PRICE RANGE', {
      x: margin,
      y,
      size: 12,
      font: boldFont,
      color: textColor,
    });
    
    y -= 15;
    
    const minPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(data.priceRange[0]);
    
    const maxPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(data.priceRange[1]);
    
    page.drawText(`${minPrice} - ${maxPrice}`, {
      x: margin,
      y,
      size: 12,
      font,
      color: textColor,
    });
    
    y -= 25;
  }

  // Add adjustments table with enhanced styling
  if (data.adjustments && data.adjustments.length > 0) {
    // Draw adjustments table header
    page.drawText('VALUE ADJUSTMENTS', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Draw table header
    page.drawRectangle({
      x: margin,
      y: y - 20,
      width: contentWidth,
      height: 20,
      color: rgb(0.9, 0.9, 0.95),
      borderColor: rgb(0.8, 0.8, 0.8),
      borderWidth: 1,
    });
    
    // Draw header text
    page.drawText('Factor', {
      x: margin + 10,
      y: y - 15,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Impact', {
      x: margin + contentWidth - 150,
      y: y - 15,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    page.drawText('Description', {
      x: margin + contentWidth - 80,
      y: y - 15,
      size: 10,
      font: boldFont,
      color: textColor,
    });
    
    y -= 20;
    
    // Draw each adjustment row
    for (const adjustment of data.adjustments) {
      // Draw row background
      page.drawRectangle({
        x: margin,
        y: y - 20,
        width: contentWidth,
        height: 20,
        color: rgb(1, 1, 1),
        borderColor: rgb(0.9, 0.9, 0.9),
        borderWidth: 0.5,
      });
      
      // Draw factor
      page.drawText(adjustment.factor, {
        x: margin + 10,
        y: y - 15,
        size: 9,
        font,
        color: textColor,
      });
      
      // Format and draw impact
      const impact = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(adjustment.impact);
      
      // Use green for positive, red for negative
      const impactColor = adjustment.impact >= 0 
        ? rgb(0.2, 0.6, 0.2) 
        : rgb(0.8, 0.2, 0.2);
      
      page.drawText(impact, {
        x: margin + contentWidth - 150,
        y: y - 15,
        size: 9,
        font,
        color: impactColor,
      });
      
      // Draw description (truncate if too long)
      const description = adjustment.description || '';
      const truncatedDescription = description.length > 30 
        ? description.substring(0, 27) + '...' 
        : description;
      
      page.drawText(truncatedDescription, {
        x: margin + contentWidth - 80,
        y: y - 15,
        size: 9,
        font,
        color: textColor,
      });
      
      y -= 20;
    }
    
    y -= 10;
  }

  // Add photo assessment if included in options
  if (options.includePhotoAssessment && data.photoAssessment) {
    page.drawText('PHOTO ASSESSMENT', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // If there's a photo URL, we would embed the image here
    if (data.photoUrl || data.bestPhotoUrl) {
      // In a real implementation, we would fetch and embed the image
      page.drawText('Vehicle Photo Available', {
        x: margin,
        y,
        size: 10,
        font: font,
        color: textColor,
      });
      
      y -= 20;
    }
    
    // Add photo assessment sections
    const sections = ['exterior', 'interior', 'mechanical'];
    
    for (const section of sections) {
      if (data.photoAssessment[section] && data.photoAssessment[section].length > 0) {
        // Capitalize first letter of section name
        const sectionName = section.charAt(0).toUpperCase() + section.slice(1);
        
        page.drawText(`${sectionName} Assessment:`, {
          x: margin,
          y,
          size: 11,
          font: boldFont,
          color: textColor,
        });
        
        y -= 15;
        
        // Add each assessment point
        for (const point of data.photoAssessment[section]) {
          page.drawText(`• ${point}`, {
            x: margin + 10,
            y,
            size: 9,
            font: font,
            color: textColor,
          });
          
          y -= 12;
        }
        
        y -= 10;
      }
    }
  }
  
  // Add market comparison section
  page.drawText('MARKET COMPARISON', {
    x: margin,
    y,
    size: 14,
    font: boldFont,
    color: primaryColor,
  });
  
  y -= 20;
  
  page.drawText('This valuation is based on current market data for similar vehicles in your area.', {
    x: margin,
    y,
    size: 10,
    font: font,
    color: textColor,
  });
  
  y -= 30;
  
  // Add explanation with enhanced styling
  if (options.includeExplanation && data.explanation) {
    page.drawText('VALUATION EXPLANATION', {
      x: margin,
      y,
      size: 14,
      font: boldFont,
      color: primaryColor,
    });
    
    y -= 20;
    
    // Split explanation into lines to fit the page width
    const words = data.explanation.split(' ');
    let line = '';
    const maxLineWidth = contentWidth;
    
    for (const word of words) {
      const testLine = line + (line ? ' ' : '') + word;
      const lineWidth = font.widthOfTextAtSize(testLine, 10);
      
      if (lineWidth > maxLineWidth) {
        // Draw the current line and start a new one
        page.drawText(line, {
          x: margin,
          y,
          size: 10,
          font: font,
          color: textColor,
        });
        
        y -= 15;
        line = word;
      } else {
        line = testLine;
      }
    }
    
    // Draw the last line
    if (line) {
      page.drawText(line, {
        x: margin,
        y,
        size: 10,
        font: font,
        color: textColor,
      });
      
      y -= 20;
    }
  }
  
  // Add footer with date and page number
  const footerY = 30;
  
  page.drawText(`Generated on: ${new Date().toLocaleDateString()}`, {
    x: margin,
    y: footerY,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  page.drawText('Page 1 of 1', {
    x: width - margin - 40,
    y: footerY,
    size: 8,
    font: font,
    color: rgb(0.5, 0.5, 0.5),
  });
  
  // Return the PDF as a buffer
  return await pdfDoc.save();
}
