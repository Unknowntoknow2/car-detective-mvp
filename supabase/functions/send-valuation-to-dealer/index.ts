
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #2563eb; margin: 0;">CarPerfector</h1>
          <p style="color: #6b7280; margin: 5px 0;">Premium Vehicle Valuations</p>
        </div>
        
        <h2 style="color: #1f2937; margin-bottom: 20px;">New Premium Valuation Report Available</h2>
        
        <p style="color: #374151; font-size: 16px;">Dear ${dealerName},</p>
        
        <p style="color: #374151; font-size: 16px;">
          A new premium valuation report has been generated that may be of interest to your dealership. 
          This comprehensive report includes market analysis, condition assessment, and pricing insights.
        </p>
        
        <div style="background-color: #f8fafc; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #2563eb;">
          <h3 style="margin-top: 0; color: #1e40af; font-size: 18px;">Vehicle Details</h3>
          <table style="width: 100%; border-spacing: 0;">
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Vehicle:</td>
              <td style="padding: 8px 0; color: #1f2937; font-weight: 700;">${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}</td>
            </tr>
            ${vehicleInfo.vin ? `
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">VIN:</td>
              <td style="padding: 8px 0; color: #1f2937; font-family: monospace;">${vehicleInfo.vin}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; color: #6b7280; font-weight: 600;">Estimated Value:</td>
              <td style="padding: 8px 0; color: #059669; font-weight: 700; font-size: 18px;">$${valuationAmount.toLocaleString()}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
          <a href="${pdfUrl}" 
             style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 600; font-size: 16px;">
            📄 Download Premium Report
          </a>
        </div>
        
        <div style="background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e; font-size: 14px;">
            <strong>📋 Report Features:</strong> Comprehensive market analysis, AI-powered condition assessment, 
            auction data insights, and professional valuation breakdown.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
          <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">
            This report contains comprehensive valuation data, market analysis, and AI-generated insights.
            The download link is valid for 24 hours.
          </p>
          
          <p style="color: #6b7280; font-size: 14px; margin: 20px 0 5px 0;">
            Best regards,<br>
            <strong>The CarPerfector Team</strong><br>
            <a href="https://carperfector.com" style="color: #2563eb;">CarPerfector.com</a>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            This email was sent to verified dealers. If you received this in error, please contact support.
          </p>
        </div>
      </div>
    `;

    const emailResponse = await resend.emails.send({
      from: 'CarPerfector <reports@cardetective.dev>',
      to: [dealerEmail],
      subject: subject,
      html: emailHtml,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: 'Email sent successfully'
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error('Error sending dealer email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
