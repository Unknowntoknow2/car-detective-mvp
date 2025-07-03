
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DealerOfferRequest {
  reportId: string;
  offerAmount: number;
  message?: string;
  userId?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: corsHeaders }
      );
    }

    // Verify the user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const { reportId, offerAmount, message, userId }: DealerOfferRequest = await req.json();

    if (!reportId || !offerAmount) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: reportId and offerAmount' }),
        { status: 400, headers: corsHeaders }
      );
    }

    // Verify the user is a dealer
    const { data: dealerData, error: dealerError } = await supabase
      .from('dealers')
      .select('verified')
      .eq('id', user.id)
      .single();

    if (dealerError || !dealerData?.verified) {
      return new Response(
        JSON.stringify({ error: 'Only verified dealers can submit offers' }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Insert the dealer offer
    const { data, error } = await supabase
      .from('dealer_offers')
      .insert({
        dealer_id: user.id,
        report_id: reportId,
        offer_amount: offerAmount,
        message: message || '',
        user_id: userId,
        status: 'sent'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Dealer offer insert failed:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to submit offer' }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log('✅ Dealer offer submitted successfully:', data);

    return new Response(
      JSON.stringify({ success: true, offer: data }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error('❌ Error in submit-dealer-offer function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
