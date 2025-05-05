
import { PDFPage, rgb, PDFFont } from 'pdf-lib';

interface ForecastData {
  estimatedValueAt12Months: number;
  percentageChange: number;
  bestTimeToSell: string;
  valueTrend: 'increasing' | 'decreasing' | 'stable';
}

/**
 * Draw 12-month forecast section on the PDF
 * Returns the new Y position after drawing the section
 */
export function drawForecastSection(
  forecast: ForecastData | undefined,
  page: PDFPage,
  yPosition: number,
  margin: number,
  fonts: {
    regular: PDFFont;
    bold: PDFFont;
  }
): number {
  if (!forecast) {
    return yPosition;
  }
  
  let currentY = yPosition;
  const { regular, bold } = fonts;
  const primaryColor = rgb(0.12, 0.46, 0.70);
  
  // Draw section title
  page.drawText('12-Month Value Forecast', { 
    x: margin, 
    y: currentY, 
    size: 16, 
    font: bold, 
    color: primaryColor 
  });
  currentY -= 25;
  
  // Draw forecast information
  const forecastInfo = [
    `Projected Value (12 months): $${forecast.estimatedValueAt12Months.toLocaleString()}`,
    `Projected Change: ${forecast.percentageChange >= 0 ? '+' : ''}${forecast.percentageChange.toFixed(1)}%`,
    `Best Time to Sell: ${forecast.bestTimeToSell}`,
    `Market Trend: ${forecast.valueTrend === 'increasing' ? 'Appreciating' : 
                          forecast.valueTrend === 'decreasing' ? 'Depreciating' : 'Stable'}`
  ];
  
  forecastInfo.forEach(info => {
    page.drawText(info, { x: margin, y: currentY, size: 12, font: regular });
    currentY -= 20;
  });
  
  return currentY - 15; // Return new Y position with some additional padding
}
