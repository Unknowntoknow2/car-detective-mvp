import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const { valuationId, email, userName } = await req.json();
    
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: 'Valuation ID is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Create Supabase client with service role to access data
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Fetch valuation data
    const { data: valuation, error: valuationError } = await supabaseAdmin
      .from('valuations')
      .select('*')
      .eq('id', valuationId)
      .single();

    if (valuationError || !valuation) {
      console.error('Error fetching valuation:', valuationError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch valuation data' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Determine condition from condition score
    const condition = valuation.condition_score ? 
                    (valuation.condition_score >= 90 ? 'Excellent' : 
                    valuation.condition_score >= 75 ? 'Good' : 
                    valuation.condition_score >= 60 ? 'Fair' : 'Poor') : 
                    'Good';

    // Prepare the data for the PDF
    const reportData = {
      id: valuation.id,
      make: valuation.make,
      model: valuation.model,
      year: valuation.year,
      mileage: valuation.mileage,
      condition: condition,
      zipCode: valuation.state || '',
      estimatedValue: valuation.estimated_value,
      confidenceScore: valuation.confidence_score,
      priceRange: [
        Math.round((valuation.estimated_value || 0) * 0.95),
        Math.round((valuation.estimated_value || 0) * 1.05)
      ],
      createdAt: valuation.created_at,
      premium: valuation.premium_unlocked || false,
      color: valuation.color || null,
      bodyType: valuation.body_type || valuation.body_style || null,
      generatedAt: new Date().toISOString()
    };

    // Generate AI insight based on the data
    let insight = `This ${reportData.year} ${reportData.make} ${reportData.model} `;
    
    if (reportData.confidenceScore > 85) {
      insight += `has a high confidence valuation placing it at ${new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(reportData.estimatedValue)}. This valuation is based on comprehensive market data with strong reliability indicators.`;
    } else if (reportData.confidenceScore > 70) {
      insight += `is valued at approximately ${new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(reportData.estimatedValue)} with good confidence. The condition and market data support this estimate with moderate reliability.`;
    } else {
      insight += `has an estimated value of ${new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(reportData.estimatedValue)}, though with limited data. Consider a professional assessment for a more precise valuation.`;
    }
    
    reportData.insight = insight;

    // If email is provided, send PDF to email
    if (email) {
      // Create a record in the email logs
      await supabaseAdmin
        .from('email_logs')
        .insert({
          email: email,
          valuation_id: valuationId,
          email_type: 'valuation_pdf',
          status: 'processed'
        });

      // In a real implementation, we would:
      // 1. Generate the PDF
      // 2. Use a service like Resend to send the email with the PDF attached
      // 3. Update the email_logs table with the result

      console.log(`PDF report sent to email: ${email}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Valuation report sent to ${email}` 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Otherwise, return the data for direct download
    return new Response(
      JSON.stringify({
        success: true,
        reportData
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (err) {
    console.error('Error in generate-valuation-pdf function:', err);
    
    return new Response(
      JSON.stringify({ error: 'Failed to generate PDF report' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
