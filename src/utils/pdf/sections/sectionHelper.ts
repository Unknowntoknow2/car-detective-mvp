
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawSectionTitle(params: SectionParams, title: string, y: number): number {
  const { page, fonts, margin } = params;
  
  page.drawText(title, {
    x: margin,
    y,
    size: 16,
    font: fonts.bold,
    color: params.primaryColor || rgb(0.2, 0.4, 0.8),
  });
  
  return y - 25;
}

export function drawSectionDivider(params: SectionParams, y: number): number {
  const { page, margin, width } = params;
  
  page.drawRectangle({
    x: margin,
    y: y - 5,
    width: width,
    height: 1,
    color: params.textColor || params.secondaryColor || rgb(0.8, 0.8, 0.8),
  });
  
  return y - 15;
}

export function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  // Simple text wrapping - split by words and fit within maxWidth
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';
  
  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    // Approximate character width calculation
    const approximateWidth = testLine.length * fontSize * 0.6;
    
    if (approximateWidth <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
      }
    }
  }
  
  if (currentLine) {
    lines.push(currentLine);
  }
  
  return lines;
}

export function drawWrappedText(params: SectionParams, text: string, x: number, y: number, fontSize: number): number {
  const { page, fonts, width, secondaryColor } = params;
  const lines = wrapText(text, width - x, fontSize);
  let currentY = y;
  
  lines.forEach(line => {
    page.drawText(line, {
      x,
      y: currentY,
      size: fontSize,
      font: fonts.regular,
      color: secondaryColor || rgb(0.3, 0.3, 0.3),
    });
    currentY -= fontSize + 4;
  });
  
  return currentY;
}
