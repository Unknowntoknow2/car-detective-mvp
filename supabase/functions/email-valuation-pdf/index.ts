
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from 'npm:resend@2.0.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    // Step 1: Parse and validate request body
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

    // Step 2: Validate email format using basic regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Step 3: Create Supabase admin client for data access
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } },
    );

    // Step 4: Check for required Resend API key
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.warn('RESEND_API_KEY not configured - email functionality disabled');
      
      // Still log the email attempt
      const { error: logError } = await supabaseAdmin
        .from("email_logs")
        .insert({
          email: email,
          valuation_id: valuationId,
          email_type: "valuation_pdf",
          status: "failed",
          error: "RESEND_API_KEY not configured"
        });

      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Email service not configured" 
        }),
        {
          status: 503,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Step 5: Fetch valuation data with user profile information
    const { data: valuationData, error: valuationError } = await supabaseAdmin
      .from("valuations")
      .select(`
        *,
        profiles (email, full_name)
      `)
      .eq('id', valuationId)
      .single();

    if (valuationError || !valuationData) {
      console.error('Failed to fetch valuation data:', valuationError);
      
      await supabaseAdmin
        .from("email_logs")
        .insert({
          email: email,
          valuation_id: valuationId,
          email_type: "valuation_pdf",
          status: "failed",
          error: "Valuation not found"
        });

      return new Response(
        JSON.stringify({ error: "Valuation not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Step 6: Generate PDF using existing PDF generation edge function
    const pdfGenerationResponse = await supabaseAdmin.functions.invoke('generate-valuation-pdf', {
      body: {
        reportData: {
          id: valuationData.id,
          vin: valuationData.vin,
          make: valuationData.make,
          model: valuationData.model,
          year: valuationData.year,
          trim: valuationData.trim,
          mileage: valuationData.mileage,
          condition: valuationData.condition,
          estimatedValue: valuationData.estimated_value,
          price: valuationData.estimated_value,
          confidenceScore: valuationData.confidence_score,
          zipCode: valuationData.zip_code || valuationData.state,
          adjustments: valuationData.adjustments || [],
          generatedAt: new Date().toISOString(),
          isPremium: valuationData.valuation_type === 'premium'
        }
      }
    });

    if (pdfGenerationResponse.error) {
      console.error('PDF generation failed:', pdfGenerationResponse.error);
      
      await supabaseAdmin
        .from("email_logs")
        .insert({
          email: email,
          valuation_id: valuationId,
          email_type: "valuation_pdf",
          status: "failed",
          error: "PDF generation failed"
        });

      return new Response(
        JSON.stringify({ error: "PDF generation failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Step 7: Initialize Resend client
    const resend = new Resend(resendApiKey);

    // Step 8: Send email with PDF attachment
    try {
      const emailResponse = await resend.emails.send({
        from: 'Car Detective <noreply@cardetective.ai>',
        to: [email],
        subject: `Your Vehicle Valuation Report - ${valuationData.year} ${valuationData.make} ${valuationData.model}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Your Vehicle Valuation Report</h1>
            <p>Hello ${userName || valuationData.profiles?.full_name || 'there'},</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1e40af; margin-top: 0;">Vehicle Details</h2>
              <p><strong>Vehicle:</strong> ${valuationData.year} ${valuationData.make} ${valuationData.model}</p>
              ${valuationData.vin ? `<p><strong>VIN:</strong> ${valuationData.vin}</p>` : ''}
              <p><strong>Estimated Value:</strong> $${valuationData.estimated_value?.toLocaleString()}</p>
              <p><strong>Confidence Score:</strong> ${valuationData.confidence_score}%</p>
            </div>
            
            <p>Your comprehensive vehicle valuation report is attached to this email as a PDF. This report includes:</p>
            <ul>
              <li>Detailed value breakdown and adjustments</li>
              <li>Market analysis and comparable vehicles</li>
              <li>Confidence scoring methodology</li>
              <li>Full audit trail of data sources</li>
            </ul>
            
            <p>Thank you for using Car Detective for your vehicle valuation needs.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px;">
                Best regards,<br>
                The Car Detective Team<br>
                <a href="https://cardetective.ai" style="color: #2563eb;">cardetective.ai</a>
              </p>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `CarDetective_${valuationData.year}_${valuationData.make}_${valuationData.model}_${valuationData.id}.pdf`,
            // Ensure PDF buffer is in correct format for Resend (handles both Buffer and base64)
            content: pdfGenerationResponse.data.pdfBuffer
          }
        ]
      });

      if (emailResponse.error) {
        throw new Error(emailResponse.error.message);
      }

      // Step 9: Log successful email delivery
      await supabaseAdmin
        .from("email_logs")
        .insert({
          email: email,
          valuation_id: valuationId,
          email_type: "valuation_pdf",
          status: "sent",
        });

      console.log('✅ Email sent successfully:', emailResponse.data?.id);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Valuation report sent to ${email}`,
          emailId: emailResponse.data?.id
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );

    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      
      await supabaseAdmin
        .from("email_logs")
        .insert({
          email: email,
          valuation_id: valuationId,
          email_type: "valuation_pdf",
          status: "failed",
          error: emailError.message
        });

      return new Response(
        JSON.stringify({ error: "Failed to send email: " + emailError.message }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }
  } catch (err) {
    console.error("Error in email-valuation-pdf function:", err);

    return new Response(
      JSON.stringify({ error: "Failed to email PDF report" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
