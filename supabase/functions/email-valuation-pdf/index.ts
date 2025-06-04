<<<<<<< HEAD

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.20.0";
=======
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
// Import Resend package - this would be implemented in a real application
// import { Resend } from 'npm:resend@1.0.0';
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
<<<<<<< HEAD
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
=======
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
  }
  
  try {
<<<<<<< HEAD
    const { valuationId, email } = await req.json();
    
    if (!valuationId || !email) {
      return new Response(
        JSON.stringify({ error: 'Valuation ID and email are required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Create a Supabase client with the auth context of the logged in user
    const authHeader = req.headers.get('Authorization')!;
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has premium access to this valuation
    const { data: premiumValuation, error: premiumError } = await supabase
      .from('premium_valuations')
      .select('*')
      .eq('valuation_id', valuationId)
      .eq('user_id', user.id)
      .maybeSingle();
    
    // Also check if the valuation itself is marked as premium
    const { data: valuation, error: valuationError } = await supabase
      .from('valuations')
      .select('premium_unlocked, make, model, year')
      .eq('id', valuationId)
      .single();
    
    if (valuationError) {
      return new Response(
        JSON.stringify({ error: 'Valuation not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if user has premium access
    const hasPremiumAccess = premiumValuation || valuation.premium_unlocked;
    
    if (!hasPremiumAccess) {
      return new Response(
        JSON.stringify({ error: 'Premium access required' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // In a real implementation, we would generate the PDF here
    // and then send it via email using a service like Resend, SendGrid, etc.
    // For this example, we'll just log the request and return success
    
    console.log(`Sending PDF report for ${valuation.year} ${valuation.make} ${valuation.model} to ${email}`);
    
    // Log the email send attempt
    await supabase
      .from('email_logs')
=======
    // Get the request body
    const { valuationId, email, userName } = await req.json();

    if (!valuationId || !email) {
      return new Response(
        JSON.stringify({ error: "Valuation ID and email are required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Create Supabase client with service role to access data
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // In a real implementation, we would:
    // 1. Fetch the valuation data from Supabase
    // 2. Generate the PDF
    // 3. Use Resend to send the email with the PDF attached
    // For now, we'll just simulate this by logging and creating an email log

    console.log(
      `Sending valuation PDF for ID ${valuationId} to email: ${email}`,
    );

    // Create a record in the email logs
    const { error: logError } = await supabaseAdmin
      .from("email_logs")
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
      .insert({
        user_id: user.id,
        email: email,
        valuation_id: valuationId,
<<<<<<< HEAD
        email_type: 'pdf_report',
        status: 'sent'
      });
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending PDF email:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
=======
        email_type: "valuation_pdf",
        status: "processed",
      });

    if (logError) {
      console.error("Error logging email:", logError);
    }

    // In a real implementation with Resend:
    /*
    const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

    const emailResponse = await resend.emails.send({
      from: 'CarDetective <no-reply@cardetective.ai>',
      to: [email],
      subject: 'Your Vehicle Valuation Report',
      html: `
        <h1>Your Vehicle Valuation Report</h1>
        <p>Hello ${userName || 'there'},</p>
        <p>Thank you for using CarDetective. Your vehicle valuation report is attached.</p>
        <p>Best regards,<br>The CarDetective Team</p>
      `,
      attachments: [
        {
          filename: 'ValuationReport.pdf',
          content: pdfBuffer // This would be the generated PDF
        }
      ]
    });
    */

    return new Response(
      JSON.stringify({
        success: true,
        message: `Valuation report sent to ${email}`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("Error in email-valuation-pdf function:", err);

    return new Response(
      JSON.stringify({ error: "Failed to email PDF report" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
>>>>>>> 17b22333 (Committing 1400+ updates: bug fixes, file sync, cleanup)
    );
  }
});
