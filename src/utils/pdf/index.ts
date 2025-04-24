
import { convertVehicleInfoToReportData } from './dataConverter';
import { generateValuationPdf } from './pdfGeneratorService';
import type { ReportData, ValuationReportOptions } from './types';

export async function downloadPdf(vehicleInfo: any, additionalData?: ValuationReportOptions) {
  const reportData = 'mileage' in vehicleInfo && 'estimatedValue' in vehicleInfo
    ? vehicleInfo as ReportData
    : convertVehicleInfoToReportData(vehicleInfo as any, additionalData as any);

  const pdfBytes = await generateValuationPdf(reportData);
  
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `vehicle_valuation_${reportData.year}_${reportData.make}_${reportData.model}${reportData.isPremium ? '_premium' : ''}.pdf`;
  link.click();
}

export { convertVehicleInfoToReportData };
export type { ReportData, ValuationReportOptions };
