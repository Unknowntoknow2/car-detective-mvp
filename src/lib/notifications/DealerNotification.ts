
import { getVerifiedDealersInZip } from '@/lib/supabase/dealer';
import { generateValuationPdf } from '@/utils/pdf/generateValuationPdf';
import { ReportData } from '@/utils/pdf/types';

export async function notifyDealersOfNewValuation(
  valuationData: ReportData,
  zipCode: string
): Promise<void> {
  try {
    console.log(`🔔 Checking for dealers in ZIP: ${zipCode}`);
    
    const dealers = await getVerifiedDealersInZip(zipCode);
    if (!dealers?.length) {
      console.log(`📭 No verified dealers found in ZIP: ${zipCode}`);
      return;
    }

    console.log(`📧 Found ${dealers.length} verified dealers to notify`);

    // Generate PDF buffer for attachment
    const pdfBuffer = await generateValuationPdf(valuationData, {
      isPremium: true,
      includeAuctionData: true,
      includeCompetitorPricing: true,
      includeAINSummary: true
    });

    // Send notifications to each dealer
    for (const dealer of dealers) {
      try {
        await sendDealerNotificationEmail({
          dealerEmail: dealer.email,
          dealerName: dealer.dealership_name || 'Dealer',
          valuationData,
          zipCode,
          pdfBuffer
        });
        
        console.log(`✅ Notification sent to: ${dealer.email}`);
      } catch (error) {
        console.error(`❌ Failed to notify dealer ${dealer.email}:`, error);
      }
    }
  } catch (error) {
    console.error('❌ Dealer notification system error:', error);
  }
}

async function sendDealerNotificationEmail({
  dealerEmail,
  dealerName,
  valuationData,
  zipCode,
  pdfBuffer
}: {
  dealerEmail: string;
  dealerName: string;
  valuationData: ReportData;
  zipCode: string;
  pdfBuffer: Uint8Array;
}): Promise<void> {
  // This will trigger the Supabase edge function for email sending
  const response = await fetch('/api/send-dealer-notification', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      dealerEmail,
      dealerName,
      vehicle: {
        year: valuationData.year,
        make: valuationData.make,
        model: valuationData.model,
        estimatedValue: valuationData.estimatedValue,
        mileage: valuationData.mileage,
        condition: valuationData.condition,
        vin: valuationData.vin
      },
      zipCode,
      pdfBuffer: Array.from(pdfBuffer) // Convert Uint8Array to regular array for JSON
    })
  });

  if (!response.ok) {
    throw new Error(`Failed to send dealer notification: ${response.statusText}`);
  }
}
