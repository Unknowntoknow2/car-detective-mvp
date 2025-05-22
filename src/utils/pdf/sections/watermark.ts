
import { rgb } from 'pdf-lib';
import { SectionParams } from '../types';

export function drawWatermark(params: SectionParams, text: string): void {
  const { page, data, options } = params;
  
  if (!options.watermarkText && !options.showPremiumWatermark) return;
  
  const { width, height } = page.getSize();
  const watermarkText = options.watermarkText || text;
  
  // Draw diagonal watermark
  page.drawText(watermarkText, {
    x: width / 2 - 150,
    y: height / 2,
    size: 60,
    font: params.fonts.regular,
    color: rgb(0.85, 0.85, 0.85), // Light gray
    opacity: 0.3,
    rotate: {
      type: 'degrees',
      angle: -45
    },
  });
}
