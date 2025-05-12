
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

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
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { email, formData, pdfBase64 } = await req.json();
    
    if (!email) {
      throw new Error("Email is required");
    }
    
    const result = await resend.emails.send({
      from: "Car Detective <notifications@car-detective.app>",
      to: email,
      subject: `Your ${formData.year} ${formData.make} ${formData.model} Valuation Report`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Your Car Detective Valuation Report</h1>
          <p>Hello,</p>
          <p>Thank you for using Car Detective to value your ${formData.year} ${formData.make} ${formData.model}.</p>
          <p>Please find your comprehensive valuation report attached to this email.</p>
          <p>Best regards,<br>The Car Detective Team</p>
        </div>
      `,
      attachments: [
        {
          filename: `${formData.year}_${formData.make}_${formData.model}_valuation.pdf`,
          content: pdfBase64,
        },
      ],
    });

    console.log("Email sent successfully:", result);
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully" }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
    
  } catch (error) {
    console.error("Error sending email:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to send email" 
      }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  }
});
