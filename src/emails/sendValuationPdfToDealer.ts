
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
        subject: `New Premium Valuation Report for ${data.vehicleInfo.year} ${data.vehicleInfo.make} ${data.vehicleInfo.model}`
      }
    });

    if (error) {
      console.error('Error sending email to dealer:', error);
      await logEmailDelivery(data.dealerEmail, 'failed', error.message);
      return false;
    }

    console.log('Successfully sent PDF to dealer:', result);
    await logEmailDelivery(data.dealerEmail, 'sent');
    return true;
  } catch (error) {
    console.error('Failed to send email to dealer:', error);
    await logEmailDelivery(data.dealerEmail, 'failed', error instanceof Error ? error.message : 'Unknown error');
    return false;
  }
}

export async function sendPdfToVerifiedDealers(
  valuationId: string,
  pdfUrl: string,
  vehicleInfo: DealerEmailData['vehicleInfo'],
  valuationAmount: number
): Promise<{ sent: number; failed: number }> {
  try {
    // Get verified dealers from the profiles table with dealer role
    const { data: dealers, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, dealership_name')
      .eq('role', 'dealer')
      .not('email', 'is', null)
      .neq('email', '');

    if (error) {
      console.error('Error fetching dealers:', error);
      throw new Error(`Failed to fetch dealers: ${error.message}`);
    }

    if (!dealers || dealers.length === 0) {
      console.log('No verified dealers found');
      return { sent: 0, failed: 0 };
    }

    console.log(`Found ${dealers.length} verified dealers to notify`);

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

    const results = await Promise.allSettled(emailPromises);
    
    const sent = results.filter(result => result.status === 'fulfilled' && result.value === true).length;
    const failed = results.length - sent;

    console.log(`Email delivery complete: ${sent} sent, ${failed} failed`);
    
    return { sent, failed };
  } catch (error) {
    console.error('Error in sendPdfToVerifiedDealers:', error);
    throw error;
  }
}

async function logEmailDelivery(
  email: string, 
  status: 'sent' | 'failed', 
  error?: string
): Promise<void> {
  try {
    await supabase
      .from('email_logs')
      .insert({
        email,
        email_type: 'dealer_valuation_pdf',
        status,
        error: error || null
      });
  } catch (logError) {
    console.error('Failed to log email delivery:', logError);
    // Don't throw here - logging failure shouldn't break the main flow
  }
}
