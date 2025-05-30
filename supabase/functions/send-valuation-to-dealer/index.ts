
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DealerEmailRequest {
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
  subject: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      dealerEmail,
      dealerName,
      vehicleInfo,
      pdfUrl,
      valuationAmount,
      subject
    }: DealerEmailRequest = await req.json();

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Premium Valuation Report</h2>
        
        <p>Dear ${dealerName},</p>
        
        <p>A new premium valuation report has been generated that may be of interest to your dealership:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e40af;">Vehicle Details</h3>
          <p><strong>Vehicle:</strong> ${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}</p>
          ${vehicleInfo.vin ? `<p><strong>VIN:</strong> ${vehicleInfo.vin}</p>` : ''}
          <p><strong>Estimated Value:</strong> $${valuationAmount.toLocaleString()}</p>
        </div>
        
        <p>
          <a href="${pdfUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Download Premium Report
          </a>
        </p>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
          This report contains comprehensive valuation data, market analysis, and AI-generated insights.
          The download link is valid for 24 hours.
        </p>
        
        <p style="color: #6b7280; font-size: 14px;">
          Best regards,<br>
          The CarPerfector Team
        </p>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: 'CarPerfector <reports@cardetective.dev>',
      to: [dealerEmail],
      subject: subject,
      html: emailHtml,
    });

    return new Response(
      JSON.stringify({ success: true, emailId: emailResponse.data?.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error sending dealer email:', error);
    
    return new Response(
      JSON.stringify({ error: 'Failed to send email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
