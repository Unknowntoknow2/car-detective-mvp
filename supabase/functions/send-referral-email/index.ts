
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { Resend } from "https://esm.sh/resend@1.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const appUrl = "https://car-detective.app"; // Replace with your actual app URL

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: "invite" | "earned" | "reminder";
  referralToken?: string;
  inviterName?: string;
  referredEmail?: string;
  referralId?: string;
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get JWT token from request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing Authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Get user from JWT
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token or user not found" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    // Parse request
    const { type, referralToken, inviterName, referredEmail, referralId } = await req.json() as EmailRequest;
    
    let referralData;
    let inviterData;
    let recipientEmail;
    let subject;
    let html;
    
    switch (type) {
      case "invite":
        if (!referralToken || !referredEmail) {
          throw new Error("Missing required parameters");
        }
        
        // Get inviter's profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
          
        const senderName = profile?.full_name || 'Your friend';
        
        // Create invite email
        recipientEmail = referredEmail;
        subject = `${senderName} invited you to try Car Detective`;
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Car Detective - Vehicle Valuation</h1>
            <p>${senderName} thinks you'd benefit from using Car Detective to get an accurate valuation for your vehicle.</p>
            <p>Car Detective uses advanced AI technology to provide you with the most accurate vehicle valuation possible.</p>
            <div style="margin: 30px 0;">
              <a href="${appUrl}/signup?ref=${referralToken}" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Get Your Free Valuation</a>
            </div>
            <p>Benefits of Car Detective:</p>
            <ul>
              <li>Accurate AI-powered valuations</li>
              <li>CARFAX® integration for comprehensive history</li>
              <li>Market analysis and price prediction</li>
              <li>Dealer competitive offers</li>
            </ul>
            <p style="font-size: 12px; color: #666;">This invitation was sent by a Car Detective user. If you don't want to receive these emails, you can ignore this message.</p>
          </div>
        `;
        break;
        
      case "earned":
        if (!referralId) {
          throw new Error("Missing required parameters");
        }
        
        // Get referral data
        const { data: earnedReferral, error: earnedError } = await supabase
          .from("referrals")
          .select("*")
          .eq("id", referralId)
          .single();
          
        if (earnedError) throw earnedError;
        referralData = earnedReferral;
        
        // Get inviter data
        const { data: inviter, error: inviterError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", referralData.inviter_id)
          .single();
          
        if (inviterError) throw inviterError;
        inviterData = inviter;
        
        // Create earned reward email
        recipientEmail = user.email;
        subject = "You've earned a reward on Car Detective!";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Congratulations!</h1>
            <p>Good news! Your friend has completed their first valuation using your referral link.</p>
            <p>You've earned a reward of $${referralData.reward_amount} in Car Detective credits!</p>
            <div style="margin: 30px 0;">
              <a href="${appUrl}/dashboard/referrals" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View & Claim Your Reward</a>
            </div>
            <p>Thank you for spreading the word about Car Detective!</p>
            <p style="font-size: 12px; color: #666;">You're receiving this email because you're a Car Detective user who referred a friend.</p>
          </div>
        `;
        break;
        
      case "reminder":
        if (!referralId) {
          throw new Error("Missing required parameters");
        }
        
        // Get referral data
        const { data: reminderReferral, error: reminderError } = await supabase
          .from("referrals")
          .select("*")
          .eq("id", referralId)
          .single();
          
        if (reminderError) throw reminderError;
        referralData = reminderReferral;
        
        // Get inviter email
        const { data: reminderInviter } = await supabase.auth.admin.getUserById(referralData.inviter_id);
        
        if (!reminderInviter || !reminderInviter.user) {
          throw new Error("Inviter not found");
        }
        
        // Create reminder email
        recipientEmail = reminderInviter.user.email;
        subject = "Don't forget to claim your Car Detective reward!";
        html = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Reminder: You Have an Unclaimed Reward</h1>
            <p>Just a friendly reminder that you have an unclaimed reward of $${referralData.reward_amount} in Car Detective credits!</p>
            <div style="margin: 30px 0;">
              <a href="${appUrl}/dashboard/referrals" style="background-color: #4f46e5; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Claim Your Reward Now</a>
            </div>
            <p>These credits can be used toward premium valuation reports and other Car Detective services.</p>
            <p style="font-size: 12px; color: #666;">You're receiving this email because you have an unclaimed reward on Car Detective.</p>
          </div>
        `;
        break;
        
      default:
        throw new Error("Invalid email type");
    }
    
    // Send the email
    const { data: emailResult, error: emailError } = await resend.emails.send({
      from: "Car Detective <referrals@car-detective.app>",
      to: [recipientEmail],
      subject: subject,
      html: html,
    });
    
    if (emailError) throw emailError;
    
    return new Response(
      JSON.stringify({ success: true, message: "Email sent successfully", data: emailResult }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error sending referral email:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
