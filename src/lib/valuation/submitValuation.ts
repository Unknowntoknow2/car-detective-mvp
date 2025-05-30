
import { notifyDealersOfNewValuation } from '@/lib/notifications/DealerNotification';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData, ReportOptions } from '@/utils/pdf/types';

interface ValuationSubmissionData {
  vin?: string;
  zipCode: string;
  reportData: ReportData;
  isPremium?: boolean;
  notifyDealers?: boolean;
}

export async function submitValuation({
  vin,
  zipCode,
  reportData,
  isPremium = false,
  notifyDealers = true
}: ValuationSubmissionData) {
  try {
    console.log('🔄 Processing valuation submission:', { vin, zipCode, isPremium });

    // Generate PDF with appropriate options
    const pdfOptions: ReportOptions = {
      isPremium,
      includeAuctionData: isPremium,
      includeCompetitorPricing: isPremium,
      includeAINSummary: isPremium,
      notifyDealers: notifyDealers && !!vin && reportData.estimatedValue >= 8000
    };

    const pdfBuffer = await generateValuationPdf(reportData, pdfOptions);
    console.log('✅ PDF generated successfully');

    // Trigger dealer notifications for high-value vehicles
    if (notifyDealers && vin && reportData.estimatedValue >= 8000) {
      console.log('🔔 Triggering dealer notifications for high-value vehicle');
      await notifyDealersOfNewValuation(reportData, zipCode);
    }

    return {
      success: true,
      pdfBuffer,
      notificationsSent: notifyDealers && vin && reportData.estimatedValue >= 8000
    };
  } catch (error) {
    console.error('❌ Valuation submission failed:', error);
    throw error;
  }
}
