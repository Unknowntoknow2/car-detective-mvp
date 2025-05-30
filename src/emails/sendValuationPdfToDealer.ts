
import { supabase } from '@/integrations/supabase/client';

export interface DealerEmailData {
  dealerEmail: string;
  dealerName: string;
  vehicleInfo: {
    year: number;
    make: string;
    model: string;
    vin?: string;
  };
  pdfUrl: string;
  valuationAmount: number;
}

export async function sendValuationPdfToDealer(data: DealerEmailData): Promise<boolean> {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-valuation-to-dealer', {
      body: {
        dealerEmail: data.dealerEmail,
        dealerName: data.dealerName,
        vehicleInfo: data.vehicleInfo,
        pdfUrl: data.pdfUrl,
        valuationAmount: data.valuationAmount,
        subject: `New Premium Valuation Report for VIN ${data.vehicleInfo.vin || 'N/A'}`
      }
    });

    if (error) {
      console.error('Error sending email to dealer:', error);
      return false;
    }

    console.log('Successfully sent PDF to dealer:', result);
    return true;
  } catch (error) {
    console.error('Failed to send email to dealer:', error);
    return false;
  }
}

export async function sendPdfToVerifiedDealers(
  valuationId: string,
  pdfUrl: string,
  vehicleInfo: DealerEmailData['vehicleInfo'],
  valuationAmount: number
): Promise<void> {
  try {
    // Get verified dealers from the database
    const { data: dealers, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, dealership_name')
      .eq('role', 'dealer')
      .eq('verified', true);

    if (error) {
      console.error('Error fetching dealers:', error);
      return;
    }

    if (!dealers || dealers.length === 0) {
      console.log('No verified dealers found');
      return;
    }

    // Send email to each verified dealer
    const emailPromises = dealers.map(dealer => 
      sendValuationPdfToDealer({
        dealerEmail: dealer.email,
        dealerName: dealer.dealership_name || dealer.full_name || 'Dealer',
        vehicleInfo,
        pdfUrl,
        valuationAmount
      })
    );

    await Promise.allSettled(emailPromises);
    console.log(`Sent PDF to ${dealers.length} verified dealers`);
  } catch (error) {
    console.error('Error sending PDF to dealers:', error);
  }
}
