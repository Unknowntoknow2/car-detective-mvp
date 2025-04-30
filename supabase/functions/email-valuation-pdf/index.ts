
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

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
    const { email, formData, pdfBase64 } = await req.json();
    
    // In a real implementation, we would use an email service like Resend
    // For now, just log the request
    console.log(`Sending email to ${email} with valuation report for ${formData.year} ${formData.make} ${formData.model}`);
    
    // In production, replace with actual email sending logic:
    // const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    // await resend.emails.send({
    //   from: "Valuation <noreply@yourapp.com>",
    //   to: email,
    //   subject: `Your ${formData.year} ${formData.make} ${formData.model} Valuation Report`,
    //   html: `<p>Your valuation report is attached.</p>`,
    //   attachments: [
    //     {
    //       filename: "valuation-report.pdf",
    //       content: pdfBase64,
    //     },
    //   ],
    // });

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
