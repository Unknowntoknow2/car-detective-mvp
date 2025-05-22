
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

/**
 * Draw a diagonal watermark across the page
 */
export function drawWatermark(params: SectionParams): number {
  const {
    page,
    width = 600, // Default width
    height = 800, // Default height
    boldFont
  } = params;

  if (!page) {
    console.warn("Page object is missing in watermark");
    return params.y;
  }

  if (!boldFont) {
    console.warn("Bold font not provided for watermark");
    return params.y;
  }

  // Determine watermark text based on whether it's a premium report
  const watermarkText = params.data.premium ? 'PREMIUM REPORT' : 'CAR DETECTIVE';
  
  // Set watermark properties
  const watermarkColor = rgb(0.8, 0.8, 0.8);
  const watermarkSize = width * 0.08; // Scale based on page width
  const watermarkRotation = Math.PI / 4; // 45 degrees in radians
  
  // Calculate position for centered watermark
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Measure text dimensions for centering
  const textWidth = boldFont && typeof boldFont.widthOfTextAtSize === 'function'
    ? boldFont.widthOfTextAtSize(watermarkText, watermarkSize)
    : watermarkSize * watermarkText.length * 0.5; // Fallback calculation
  
  const textHeight = watermarkSize;
  
  // Draw rotated watermark
  page.drawText(watermarkText, {
    x: centerX - (textWidth / 2),
    y: centerY - (textHeight / 2),
    size: watermarkSize,
    font: boldFont,
    color: watermarkColor,
    opacity: 0.2,
    rotate: {
      type: 'degrees',
      angle: 45,
      xSkew: 0,
      ySkew: 0,
    },
  });
  
  // For non-premium reports, add additional note
  if (!params.data.premium) {
    // Draw a smaller note at the bottom
    const noteText = 'Upgrade to Premium for Enhanced Report';
    const noteSize = 12;
    const noteWidth = boldFont && typeof boldFont.widthOfTextAtSize === 'function'
      ? boldFont.widthOfTextAtSize(noteText, noteSize)
      : noteSize * noteText.length * 0.5; // Fallback calculation
    
    page.drawText(noteText, {
      x: width / 2 - noteWidth / 2,
      y: 20,
      size: noteSize,
      font: boldFont,
      color: rgb(0.4, 0.4, 0.4),
      opacity: 0.7,
    });
  }
  
  // Return unchanged y position since watermark doesn't affect content flow
  return params.y;
}
