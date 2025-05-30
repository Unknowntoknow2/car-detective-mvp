
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { VinForecast } from '@/services/vinForecastService';

interface InjectForecastParams {
  pdfBytes: Uint8Array;
  forecast: VinForecast;
  estimatedValue: number;
}

export async function injectForecastToPDF({
  pdfBytes,
  forecast,
  estimatedValue
}: InjectForecastParams): Promise<Uint8Array> {
  try {
    console.log('📈 Injecting forecast into PDF');

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const page = pdfDoc.getPages()[0];
    const { height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const xStart = 50;
    let y = height - 300; // Position above marketplace section

    // Section title
    page.drawText('📈 AIN Market Forecast', {
      x: xStart,
      y,
      size: 16,
      font: boldFont,
      color: rgb(0.12, 0.46, 0.70),
    });
    y -= 25;

    // Trend indicator
    const trendIcon = forecast.forecast_trend === 'up' ? '📈' : 
                     forecast.forecast_trend === 'down' ? '📉' : '🔄';
    const trendColor = forecast.forecast_trend === 'up' ? rgb(0.2, 0.7, 0.2) : 
                      forecast.forecast_trend === 'down' ? rgb(0.8, 0.2, 0.2) : 
                      rgb(0.5, 0.5, 0.5);

    // Main forecast text
    const direction = forecast.forecast_trend === 'up' ? 'gain' : 
                     forecast.forecast_trend === 'down' ? 'lose' : 'remain stable';
    const amount = Math.abs(forecast.predicted_delta);
    
    let mainText: string;
    if (forecast.forecast_trend === 'stable') {
      mainText = `${trendIcon} Expected to remain stable over the next ${forecast.timeframe_days} days`;
    } else {
      mainText = `${trendIcon} Your vehicle may ${direction} $${amount.toLocaleString()} in the next ${forecast.timeframe_days} days`;
    }

    page.drawText(mainText, {
      x: xStart,
      y,
      size: 12,
      font: boldFont,
      color: trendColor,
    });
    y -= 20;

    // Reasoning
    page.drawText(`Reason: ${forecast.reasoning}`, {
      x: xStart,
      y,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
    y -= 15;

    // Confidence
    const confidencePercent = Math.round(forecast.confidence * 100);
    page.drawText(`Confidence: ${confidencePercent}%`, {
      x: xStart,
      y,
      size: 10,
      font,
      color: rgb(0.4, 0.4, 0.4),
    });
    y -= 15;

    // Market factors summary
    const factors = forecast.market_factors;
    if (factors) {
      const factorText = `Based on ${factors.auctionCount} auction records and ${factors.marketplaceListingCount} marketplace listings`;
      page.drawText(factorText, {
        x: xStart,
        y,
        size: 9,
        font,
        color: rgb(0.5, 0.5, 0.5),
      });
    }

    const modifiedPdfBytes = await pdfDoc.save();
    console.log('✅ Forecast injection completed');
    return modifiedPdfBytes;

  } catch (error) {
    console.error('❌ Error injecting forecast into PDF:', error);
    return pdfBytes;
  }
}
