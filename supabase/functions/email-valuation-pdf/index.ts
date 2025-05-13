
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.24.0';

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";

const supabase = createClient(supabaseUrl, serviceRoleKey);
const resend = new Resend(resendApiKey);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailValuationPdfRequest {
  valuationId: string;
  email: string;
  userName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { valuationId, email, userName }: EmailValuationPdfRequest = await req.json();

    if (!valuationId || !email) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: valuationId, email" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Fetch the valuation data
    const { data: valuationData, error: valuationError } = await supabase
      .from("valuations")
      .select("*")
      .eq("id", valuationId)
      .single();

    if (valuationError || !valuationData) {
      console.error("Error fetching valuation:", valuationError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch valuation data" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Determine condition from condition score
    const condition = valuationData.condition_score 
      ? (valuationData.condition_score >= 90 
          ? 'Excellent' 
          : valuationData.condition_score >= 75 
            ? 'Good' 
            : valuationData.condition_score >= 60 
              ? 'Fair' 
              : 'Poor') 
      : 'Good';

    // Save this email in the email_logs table
    const { error: logError } = await supabase
      .from("email_logs")
      .insert({
        email: email,
        email_type: "valuation_pdf",
        status: "sent",
        valuation_id: valuationId,
        user_id: valuationData.user_id
      });

    if (logError) {
      console.error("Error logging email:", logError);
      // Continue anyway, this is not critical
    }

    // Send the email
    const emailResponse = await resend.emails.send({
      from: "Car Detective <no-reply@resend.dev>",
      to: [email],
      subject: `Your ${valuationData.year} ${valuationData.make} ${valuationData.model} Valuation Report`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Your Vehicle Valuation Report</h1>
          <p>Hello ${userName || "there"},</p>
          <p>Here is your vehicle valuation report for:</p>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">${valuationData.year} ${valuationData.make} ${valuationData.model}</h2>
            <p><strong>Mileage:</strong> ${valuationData.mileage?.toLocaleString() || "N/A"}</p>
            <p><strong>Condition:</strong> ${condition}</p>
            <p><strong>Estimated Value:</strong> $${valuationData.estimated_value?.toLocaleString() || "N/A"}</p>
            <p><strong>Confidence Score:</strong> ${valuationData.confidence_score || "N/A"}%</p>
          </div>
          
          <p>For a detailed breakdown and to view your full report, please click the button below:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${supabaseUrl.replace(".supabase.co", "")}/valuation-result/${valuationId}" style="background-color: #4a6cf7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              View Full Report
            </a>
          </div>
          
          <p>Thank you for using Car Detective!</p>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />
          <p style="color: #999; font-size: 12px;">
            This email was sent automatically. Please do not reply to this email.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Valuation PDF email sent successfully",
        data: emailResponse
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in email-valuation-pdf function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
