
import { serve } from "https://deno.land/std@0.170.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReferralRequest {
  action: "generate" | "process" | "mark-earned" | "claim";
  referralToken?: string;
  userId?: string;
  referredEmail?: string;
  rewardType?: string;
  rewardAmount?: number;
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
    const { action, referralToken, userId, referredEmail, rewardType, rewardAmount, referralId } = await req.json() as ReferralRequest;
    
    let result;
    
    // Process different actions
    switch (action) {
      case "generate":
        // Generate a new referral token
        const { data: tokenData } = await supabase.rpc("generate_referral_token");
        const newToken = tokenData;
        
        // Insert new referral record
        const { data, error } = await supabase
          .from("referrals")
          .insert({
            inviter_id: user.id,
            referral_token: newToken,
            referred_email: referredEmail
          })
          .select()
          .single();
          
        if (error) throw error;
        result = { referralToken: newToken, referral: data };
        break;
        
      case "process":
        if (!referralToken || !userId) {
          throw new Error("Missing required parameters");
        }
        
        // Process the referral for a new user signup
        await supabase.rpc("process_referral", {
          token: referralToken,
          new_user_id: userId
        });
        
        // Get the updated referral
        const { data: processedReferral, error: processError } = await supabase
          .from("referrals")
          .select("*")
          .eq("referral_token", referralToken)
          .single();
          
        if (processError) throw processError;
        result = { referral: processedReferral };
        break;
        
      case "mark-earned":
        if (!userId) {
          throw new Error("Missing required parameters");
        }
        
        // Mark referral as earned
        await supabase.rpc("mark_referral_earned", {
          user_id: userId,
          reward_type: rewardType || "valuation",
          reward_amount: rewardAmount || 5.00
        });
        
        // Get user's referral
        const { data: earnedReferral, error: earnedError } = await supabase
          .from("referrals")
          .select("*")
          .eq("referred_user_id", userId)
          .single();
          
        if (earnedError && earnedError.code !== "PGRST116") {
          // Only throw if it's not a "no rows returned" error
          throw earnedError;
        }
        
        result = { referral: earnedReferral || null };
        break;
        
      case "claim":
        if (!referralId) {
          throw new Error("Missing required parameters");
        }
        
        // Claim the reward
        const { data: claimResult, error: claimError } = await supabase
          .rpc("claim_referral_reward", {
            referral_id: referralId
          });
          
        if (claimError) throw claimError;
        
        // Get the updated referral
        const { data: claimedReferral, error: fetchError } = await supabase
          .from("referrals")
          .select("*")
          .eq("id", referralId)
          .single();
          
        if (fetchError) throw fetchError;
        
        result = { 
          success: claimResult, 
          referral: claimedReferral,
          message: claimResult ? "Reward claimed successfully" : "Maximum reward limit reached"
        };
        break;
        
      default:
        throw new Error("Invalid action");
    }
    
    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing referral:", error.message);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
