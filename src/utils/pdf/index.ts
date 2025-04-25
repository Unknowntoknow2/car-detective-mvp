
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
  if (!forecastData && reportData.estimatedValue && reportData.vin) {
    try {
      const forecast = await generateValuationForecast(reportData.vin);
      
      forecastData = {
        estimatedValueAt12Months: forecast.forecast[11].value,
        percentageChange: forecast.percentageChange,
        bestTimeToSell: forecast.bestTimeToSell,
        valueTrend: forecast.valueTrend
      };
    } catch (error) {
      console.error("Failed to generate forecast for PDF:", error);
    }
  }

  const pdfBytes = reportData.isPremium 
    ? await generatePremiumReport({
        vehicleInfo: {
          vin: reportData.vin,
          year: typeof reportData.year === 'string' ? parseInt(reportData.year, 10) : reportData.year,
          make: reportData.make,
          model: reportData.model,
          mileage: typeof reportData.mileage === 'string' ? parseInt(reportData.mileage, 10) : reportData.mileage,
          zipCode: reportData.zipCode
        },
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
