
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";

// Initialize Resend with API key
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email template types
type EmailType = 
  | 'abandoned_valuation' 
  | 'premium_upsell' 
  | 'dealer_offer_followup' 
  | 'photo_upload_prompt' 
  | 'reactivation';

// Email template configuration
const emailTemplates = {
  abandoned_valuation: {
    subject: "Complete Your Car Valuation",
    fromName: "Car Detective",
    preheader: "Your car valuation is waiting to be completed",
  },
  premium_upsell: {
    subject: "Unlock Premium Features for Your Valuation",
    fromName: "Car Detective Premium",
    preheader: "Get a comprehensive valuation report with premium features",
  },
  dealer_offer_followup: {
    subject: "🚘 You've received a new dealer offer!",
    fromName: "Car Detective Marketplace",
    preheader: "Dealers are interested in your vehicle",
  },
  photo_upload_prompt: {
    subject: "Add Photos to Improve Your Valuation",
    fromName: "Car Detective",
    preheader: "Photos can help increase the accuracy of your valuation",
  },
  reactivation: {
    subject: "We Miss You at Car Detective",
    fromName: "Car Detective Team",
    preheader: "Check out what's new with your car valuation",
  }
};

// Helper to generate email content
async function generateEmailContent(
  emailType: EmailType, 
  userData: any, 
  valuationData?: any,
  req?: Request
): Promise<{ html: string; text: string }> {
  // Default fallback values
  const userName = userData?.full_name || userData?.email?.split('@')[0] || "there";
  
  let html = '';
  let text = '';
  
  switch (emailType) {
    case 'abandoned_valuation':
      const valuationUrl = `https://car-detective.app/valuation/continue?id=${valuationData?.id}`;
      
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Complete Your Car Valuation</h1>
          <p>Hi ${userName},</p>
          <p>We noticed you started a valuation for your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model} but didn't complete it.</p>
          <p>Your valuation is just a few steps away from being completed.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${valuationUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Continue Your Valuation</a>
          </div>
          <p>If you have any questions or need assistance, just reply to this email.</p>
          <p>Best regards,<br>The Car Detective Team</p>
        </div>
      `;
      
      text = `Hi ${userName},\n\nWe noticed you started a valuation for your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model} but didn't complete it.\n\nYour valuation is just a few steps away from being completed. Continue here: ${valuationUrl}\n\nBest regards,\nThe Car Detective Team`;
      break;
      
    case 'premium_upsell':
      const premiumUrl = `https://car-detective.app/premium?id=${valuationData?.id}`;
      
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Unlock Premium Features</h1>
          <p>Hi ${userName},</p>
          <p>Thank you for using Car Detective to value your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model}.</p>
          <p>Upgrade to our Premium Report to get:</p>
          <ul>
            <li>CARFAX® Vehicle History integration</li>
            <li>Market comparison analysis</li>
            <li>Price prediction for the next 12 months</li>
            <li>Detailed AI condition assessment</li>
            <li>Direct dealer offers</li>
          </ul>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${premiumUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Upgrade to Premium</a>
          </div>
          <p>Best regards,<br>The Car Detective Team</p>
        </div>
      `;
      
      text = `Hi ${userName},\n\nThank you for using Car Detective to value your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model}.\n\nUpgrade to our Premium Report to get:\n- CARFAX® Vehicle History integration\n- Market comparison analysis\n- Price prediction for the next 12 months\n- Detailed AI condition assessment\n- Direct dealer offers\n\nUpgrade here: ${premiumUrl}\n\nBest regards,\nThe Car Detective Team`;
      break;
      
    case 'dealer_offer_followup':
      // Check if we have a secure token for this valuation
      let offerViewUrl = `https://car-detective.app/my-valuations`;
      
      // Try to find a secure token for this valuation in dealer_leads
      if (valuationData?.id && req?.supabaseClient) {
        const { data: leadData, error: leadError } = await req.supabaseClient
          .from('dealer_leads')
          .select('secure_token')
          .eq('valuation_id', valuationData.id)
          .single();
          
        if (!leadError && leadData?.secure_token) {
          offerViewUrl = `https://car-detective.app/view-offer/${leadData.secure_token}`;
        }
      }
      
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">New Dealer Offers Available</h1>
          <p>Hi ${userName},</p>
          <p>Good news! Dealers in your area have expressed interest in your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model}.</p>
          <p>You have new offers waiting to be reviewed.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${offerViewUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Dealer Offers</a>
          </div>
          <p>No account is required to view these offers. Simply click the button above.</p>
          <p>Best regards,<br>The Car Detective Team</p>
        </div>
      `;
      
      text = `Hi ${userName},\n\nGood news! Dealers in your area have expressed interest in your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model}.\n\nYou have new offers waiting to be reviewed.\n\nView offers here: ${offerViewUrl}\n\nNo account is required to view these offers.\n\nBest regards,\nThe Car Detective Team`;
      break;
      
    case 'photo_upload_prompt':
      const photoUploadUrl = `https://car-detective.app/valuation/photos?id=${valuationData?.id}`;
      
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">Add Photos to Your Valuation</h1>
          <p>Hi ${userName},</p>
          <p>Did you know that adding photos to your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model} valuation can improve its accuracy?</p>
          <p>Our AI system can analyze your vehicle's condition from photos and provide a more accurate estimate.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${photoUploadUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Add Photos Now</a>
          </div>
          <p>Best regards,<br>The Car Detective Team</p>
        </div>
      `;
      
      text = `Hi ${userName},\n\nDid you know that adding photos to your ${valuationData?.year} ${valuationData?.make} ${valuationData?.model} valuation can improve its accuracy?\n\nOur AI system can analyze your vehicle's condition from photos and provide a more accurate estimate.\n\nAdd photos here: ${photoUploadUrl}\n\nBest regards,\nThe Car Detective Team`;
      break;
      
    case 'reactivation':
      const dashboardUrl = `https://car-detective.app/dashboard`;
      
      html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4F46E5;">We Miss You!</h1>
          <p>Hi ${userName},</p>
          <p>It's been a while since you visited Car Detective.</p>
          <p>The used car market is constantly changing, and your vehicle's value may have changed too. Would you like to get an updated valuation?</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${dashboardUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Check Your Dashboard</a>
          </div>
          <p>Best regards,<br>The Car Detective Team</p>
        </div>
      `;
      
      text = `Hi ${userName},\n\nIt's been a while since you visited Car Detective.\n\nThe used car market is constantly changing, and your vehicle's value may have changed too. Would you like to get an updated valuation?\n\nCheck your dashboard here: ${dashboardUrl}\n\nBest regards,\nThe Car Detective Team`;
      break;
  }
  
  return { html, text };
}

// Email sending logic
async function sendEmail(
  emailType: EmailType,
  userEmail: string,
  userData: any,
  valuationData?: any,
  req?: Request
) {
  try {
    const template = emailTemplates[emailType];
    const { html, text } = await generateEmailContent(emailType, userData, valuationData, req);
    
    const { data, error } = await resend.emails.send({
      from: `${template.fromName} <noreply@car-detective.app>`,
      to: [userEmail],
      subject: template.subject,
      html: html,
      text: text,
    });
    
    if (error) {
      console.error(`Error sending ${emailType} email to ${userEmail}:`, error);
      return { success: false, error };
    }
    
    console.log(`Successfully sent ${emailType} email to ${userEmail}:`, data);
    return { success: true, data };
  } catch (err) {
    console.error(`Exception sending ${emailType} email to ${userEmail}:`, err);
    return { success: false, error: err.message };
  }
}

// Endpoint handling
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { emailType, userId, valuationId, email } = await req.json();
    
    if (!emailType || !email) {
      throw new Error("Missing required parameters: emailType, email");
    }
    
    // Get user data
    const { data: userData, error: userError } = await req.supabaseClient
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (userError && userId) {
      console.error('Error fetching user data:', userError);
    }
    
    // Get valuation data if provided
    let valuationData = null;
    if (valuationId) {
      const { data: valuation, error: valError } = await req.supabaseClient
        .from('valuations')
        .select('*')
        .eq('id', valuationId)
        .single();
        
      if (!valError) {
        valuationData = valuation;
      } else {
        console.error('Error fetching valuation data:', valError);
      }
    }
    
    // Send email
    const result = await sendEmail(emailType, email, userData || { email }, valuationData, req);
    
    // Log the email send
    await req.supabaseClient
      .from('email_logs')
      .insert({
        user_id: userId,
        email_type: emailType,
        email: email,
        valuation_id: valuationId,
        status: result.success ? 'sent' : 'failed',
        error: result.success ? null : JSON.stringify(result.error)
      });
    
    return new Response(
      JSON.stringify({ success: result.success, message: result.success ? 'Email sent successfully' : 'Failed to send email' }),
      { 
        status: result.success ? 200 : 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error in trigger-email-campaign function:", error);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
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
