
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Resend } from 'npm:resend@2.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DealerNotificationRequest {
  dealerEmail: string;
  dealerName: string;
  vehicle: {
    year: number;
    make: string;
    model: string;
    estimatedValue: number;
    mileage: number;
    condition: string;
    vin?: string;
  };
  zipCode: string;
  pdfBuffer: number[]; // Uint8Array converted to regular array
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const {
      dealerEmail,
      dealerName,
      vehicle,
      zipCode,
      pdfBuffer
    }: DealerNotificationRequest = await req.json();

    // Convert array back to Uint8Array for PDF attachment
    const pdfData = new Uint8Array(pdfBuffer);

    // Create professional HTML email
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
            .content { padding: 20px; background: #f9fafb; }
            .vehicle-info { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .price { font-size: 24px; font-weight: bold; color: #059669; }
            .cta { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
            .footer { font-size: 12px; color: #6b7280; padding: 20px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚗 New Vehicle Valuation Alert</h1>
            </div>
            
            <div class="content">
              <h2>Hello ${dealerName},</h2>
              
              <p>A new vehicle valuation has been completed in your area (ZIP: ${zipCode}). This could be a potential lead for your dealership.</p>
              
              <div class="vehicle-info">
                <h3>Vehicle Details:</h3>
                <p><strong>Vehicle:</strong> ${vehicle.year} ${vehicle.make} ${vehicle.model}</p>
                <p><strong>Mileage:</strong> ${vehicle.mileage?.toLocaleString()} miles</p>
                <p><strong>Condition:</strong> ${vehicle.condition}</p>
                ${vehicle.vin ? `<p><strong>VIN:</strong> ${vehicle.vin}</p>` : ''}
                <p class="price">Estimated Value: $${vehicle.estimatedValue?.toLocaleString()}</p>
              </div>
              
              <p>The complete valuation report is attached to this email with detailed market analysis, auction data, and pricing intelligence.</p>
              
              <a href="https://xltxqqzattxogxtqrggt.supabase.co/dashboard" class="cta">
                View Dealer Dashboard
              </a>
              
              <p><em>This notification was sent because you're a verified dealer in our network. The vehicle owner may be interested in selling or trading.</em></p>
            </div>
            
            <div class="footer">
              <p>Car Detective Dealer Network</p>
              <p>This email was sent to verified dealers only. To unsubscribe or manage preferences, contact support.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email with PDF attachment
    const emailResponse = await resend.emails.send({
      from: 'Car Detective <noreply@resend.dev>',
      to: [dealerEmail],
      subject: `🚗 New Vehicle Valuation - ${vehicle.year} ${vehicle.make} ${vehicle.model} (${zipCode})`,
      html: htmlContent,
      attachments: [
        {
          filename: `CarDetective_Valuation_${vehicle.year}_${vehicle.make}_${vehicle.model}_${Date.now()}.pdf`,
          content: pdfData,
        },
      ],
    });

    console.log('✅ Dealer notification email sent:', emailResponse);

    return new Response(
      JSON.stringify({ 
        success: true, 
        messageId: emailResponse.data?.id 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('❌ Error sending dealer notification:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send dealer notification',
        details: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
