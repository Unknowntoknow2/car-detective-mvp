
import { convertVehicleInfoToReportData } from './dataConverter';
import { generateValuationPdf, generatePremiumReport } from './pdfGeneratorService';
import type { ReportData, ValuationReportOptions, PremiumReportInput, ForecastData } from './types';
import { generateValuationForecast } from '../forecasting/valuation-forecast';

export async function downloadPdf(vehicleInfo: any, additionalData?: ValuationReportOptions) {
  const reportData = 'mileage' in vehicleInfo && 'estimatedValue' in vehicleInfo
    ? vehicleInfo as ReportData
    : convertVehicleInfoToReportData(vehicleInfo as any, additionalData as any);
  
  // Generate forecast data if not already provided
  let forecastData: ForecastData | undefined = additionalData?.forecast;
  if (!forecastData && reportData.estimatedValue) {
    const forecast = generateValuationForecast(
      reportData.estimatedValue,
      reportData.bodyType || 'sedan',
      {
        vehicleAge: new Date().getFullYear() - (reportData.year || 2020),
        mileage: reportData.mileage || 50000,
      }
    );
    
    forecastData = {
      estimatedValueAt12Months: forecast.forecast[11].value,
      percentageChange: forecast.percentageChange,
      bestTimeToSell: forecast.bestTimeToSell,
      valueTrend: forecast.valueTrend
    };
  }

  const pdfBytes = reportData.isPremium 
    ? await generatePremiumReport({
        vehicleInfo: reportData,
        valuation: {
          basePrice: reportData.estimatedValue,
          estimatedValue: reportData.estimatedValue,
          priceRange: [
            Math.round(reportData.estimatedValue * 0.95),
            Math.round(reportData.estimatedValue * 1.05)
          ],
          confidenceScore: reportData.confidenceScore || 0,
          adjustments: reportData.adjustments || []
        },
        carfaxData: reportData.carfaxData,
        forecast: forecastData
      })
    : await generateValuationPdf(reportData);
  
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `vehicle_valuation_${reportData.year}_${reportData.make}_${reportData.model}${reportData.isPremium ? '_premium' : ''}.pdf`;
  link.click();
}

export { convertVehicleInfoToReportData };
export type { ReportData, ValuationReportOptions, PremiumReportInput, ForecastData };
