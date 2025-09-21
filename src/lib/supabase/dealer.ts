
import { supabase } from '@/integrations/supabase/client';

export interface VerifiedDealer {
  id: string;
  email: string;
  dealership_name: string;
  coverage_zip_codes: string[];
  is_premium_dealer: boolean;
}

export async function getVerifiedDealersInZip(zipCode: string): Promise<VerifiedDealer[]> {
  try {
    // Query profiles table for verified dealers in the given ZIP code
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        dealership_name,
        is_premium_dealer
      `)
      .eq('role', 'dealer')
      .eq('is_premium_dealer', true); // Only premium dealers get notifications

    if (error) {
      console.error('❌ Error fetching dealers:', error);
      return [];
    }

    if (!data || data.length === 0) {
      return [];
    }

    // Get user emails from auth.users via the dealers table
    const dealerIds = data.map(d => d.id);
    
    const { data: dealersData, error: dealersError } = await supabase
      .from('dealers')
      .select('id, email, business_name')
      .in('id', dealerIds)
      .eq('verified', true);

    if (dealersError) {
      console.error('❌ Error fetching dealer emails:', dealersError);
      return [];
    }

    // Combine the data
    const verifiedDealers: VerifiedDealer[] = data
      .map(profile => {
        const dealerInfo = dealersData?.find(d => d.id === profile.id);
        if (!dealerInfo) return null;

        return {
          id: profile.id,
          email: dealerInfo.email,
          dealership_name: profile.dealership_name || dealerInfo.business_name || 'Unknown Dealership',
          coverage_zip_codes: [zipCode], // For now, we'll notify all dealers regardless of ZIP
          is_premium_dealer: profile.is_premium_dealer
        };
      })
      .filter(Boolean) as VerifiedDealer[];

    return verifiedDealers;
  } catch (error) {
    console.error('❌ Unexpected error in getVerifiedDealersInZip:', error);
    return [];
  }
}

export async function markDealerAsNotified(
  dealerId: string, 
  valuationId: string
): Promise<void> {
  try {
    // Log the notification in dealer_leads table
    const { error } = await supabase
      .from('dealer_leads')
      .insert({
        user_id: dealerId,
        valuation_id: valuationId,
        status: 'notified'
      });

    if (error) {
      console.error('❌ Error logging dealer notification:', error);
    }
  } catch (error) {
    console.error('❌ Unexpected error in markDealerAsNotified:', error);
  }
}
