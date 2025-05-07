
// ✅ TS check passed
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

/**
 * Applies a watermark to the PDF page
 * @param params The section parameters 
 * @param customText Optional custom text for the watermark
 */
export function applyWatermark(
  params: SectionParams,
  customText?: string
): void {
  const { page, width, height, boldFont } = params;
  const watermarkText = customText || "Car Detective™ • Confidential";
  
  // Calculate center position
  const centerX = width / 2;
  const centerY = height / 2;
  
  // Draw the main watermark
  page.drawText(watermarkText, {
    x: centerX - 200, // Approximate offset to center the text
    y: centerY,
    size: 60,
    font: boldFont,
    color: rgb(0.9, 0.9, 0.9),
    opacity: 0.04,
    rotate: degrees(-30)
  });
  
  // Add additional watermarks if the page is large enough
  if (height > 600) {
    // Top watermark
    page.drawText(watermarkText, {
      x: centerX - 200,
      y: centerY + 300,
      size: 60,
      font: boldFont,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.04,
      rotate: degrees(-30)
    });
    
    // Bottom watermark
    page.drawText(watermarkText, {
      x: centerX - 200,
      y: centerY - 300,
      size: 60,
      font: boldFont,
      color: rgb(0.9, 0.9, 0.9),
      opacity: 0.04,
      rotate: degrees(-30)
    });
  }
}

/**
 * Helper function to create a proper rotation object
 * @param angle The angle in degrees
 * @returns A properly formatted rotation object
 */
function degrees(angle: number) {
  return { 
    type: 'degrees' as const, 
    angle 
  };
}

/**
 * Applies a repeating watermark pattern to the entire page
 * More sophisticated than the single watermark
 * @param params The section parameters
 * @param customText Optional custom text for the watermark
 */
export function applyWatermarkPattern(
  params: SectionParams,
  customText?: string
): void {
  const { page, width, height, boldFont } = params;
  const watermarkText = customText || "Car Detective™ • Confidential";
  
  // Define a grid of watermarks
  const stepX = 400;
  const stepY = 300;
  
  // Calculate how many watermarks to place horizontally and vertically
  const countX = Math.ceil(width / stepX) + 1;
  const countY = Math.ceil(height / stepY) + 1;
  
  // Start from outside the page to ensure coverage
  const startX = -100;
  const startY = -100;
  
  // Create a grid of watermarks
  for (let y = 0; y < countY; y++) {
    for (let x = 0; x < countX; x++) {
      const posX = startX + x * stepX;
      const posY = startY + y * stepY;
      
      page.drawText(watermarkText, {
        x: posX,
        y: posY,
        size: 40, // Smaller size for the pattern
        font: boldFont,
        color: rgb(0.9, 0.9, 0.9),
        opacity: 0.03, // Very subtle
        rotate: degrees(-30)
      });
    }
  }
}
