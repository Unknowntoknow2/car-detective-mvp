
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.8.0";

// Initialize Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Set up CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to find users with abandoned valuations
async function findAbandonedValuations() {
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  
  // Find valuations that were started but not completed
  // (no estimated_value generated) from 2-7 days ago
  const { data, error } = await supabase
    .from('valuations')
    .select(`
      id,
      user_id,
      make,
      model,
      year,
      created_at,
      profiles!inner(email, full_name)
    `)
    .is('estimated_value', null)
    .lt('created_at', twoDaysAgo.toISOString())
    .gt('created_at', new Date(now.setDate(now.getDate() - 7)).toISOString());
    
  if (error) {
    console.error('Error finding abandoned valuations:', error);
    return [];
  }
  
  return data.map(item => ({
    email: item.profiles.email,
    userData: item.profiles,
    valuationId: item.id,
    userId: item.user_id,
    valuationData: {
      id: item.id,
      make: item.make,
      model: item.model,
      year: item.year
    }
  }));
}

// Helper function to find users who completed valuations but didn't purchase premium
async function findPremiumUpsellCandidates() {
  const now = new Date();
  const threeDaysAgo = new Date(now);
  threeDaysAgo.setDate(now.getDate() - 3);
  
  // Find completed valuations from 3-14 days ago with no premium purchase
  const { data, error } = await supabase
    .from('valuations')
    .select(`
      id,
      user_id,
      make,
      model,
      year,
      estimated_value,
      created_at,
      premium_unlocked,
      profiles!inner(email, full_name)
    `)
    .not('estimated_value', 'is', null)
    .eq('premium_unlocked', false)
    .lt('created_at', threeDaysAgo.toISOString())
    .gt('created_at', new Date(now.setDate(now.getDate() - 14)).toISOString());
    
  if (error) {
    console.error('Error finding premium upsell candidates:', error);
    return [];
  }
  
  return data.map(item => ({
    email: item.profiles.email,
    userData: item.profiles,
    valuationId: item.id,
    userId: item.user_id,
    valuationData: {
      id: item.id,
      make: item.make,
      model: item.model,
      year: item.year,
      estimated_value: item.estimated_value
    }
  }));
}

// Helper function to find users with valuations but no photos
async function findPhotoUploadCandidates() {
  const now = new Date();
  const oneDayAgo = new Date(now);
  oneDayAgo.setDate(now.getDate() - 1);
  
  // Find completed valuations with no photos
  const { data: valuations, error: valError } = await supabase
    .from('valuations')
    .select(`
      id,
      user_id,
      make,
      model,
      year,
      estimated_value,
      created_at,
      profiles!inner(email, full_name)
    `)
    .not('estimated_value', 'is', null)
    .lt('created_at', oneDayAgo.toISOString())
    .gt('created_at', new Date(now.setDate(now.getDate() - 10)).toISOString());
    
  if (valError) {
    console.error('Error finding photo upload candidates (valuations):', valError);
    return [];
  }
  
  // Check for photos for each valuation
  const candidates = [];
  
  for (const valuation of valuations) {
    const { data: photos, error: photoError } = await supabase
      .from('valuation_photos')
      .select('id')
      .eq('valuation_id', valuation.id)
      .limit(1);
      
    if (photoError) {
      console.error(`Error checking photos for valuation ${valuation.id}:`, photoError);
      continue;
    }
    
    // If no photos found, add to candidates
    if (!photos || photos.length === 0) {
      candidates.push({
        email: valuation.profiles.email,
        userData: valuation.profiles,
        valuationId: valuation.id,
        userId: valuation.user_id,
        valuationData: {
          id: valuation.id,
          make: valuation.make,
          model: valuation.model,
          year: valuation.year
        }
      });
    }
  }
  
  return candidates;
}

// Helper function to find inactive users for reactivation
async function findInactiveUsers() {
  const now = new Date();
  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(now.getDate() - 30);
  
  // Find users who haven't done anything in 30+ days
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      email,
      full_name
    `)
    .lt('last_active', thirtyDaysAgo.toISOString());
    
  if (error) {
    console.error('Error finding inactive users:', error);
    return [];
  }
  
  return data.map(item => ({
    email: item.email,
    userData: item,
    userId: item.id
  }));
}

// Helper function to find dealer offer followups
async function findDealerOfferFollowups() {
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(now.getDate() - 2);
  
  // Find users with unviewed dealer offers
  const { data, error } = await supabase
    .from('dealer_offers')
    .select(`
      id,
      user_id,
      status,
      created_at,
      offer_amount,
      dealer_id,
      report_id,
      valuations!inner(
        id,
        make,
        model,
        year
      ),
      profiles!inner(
        email,
        full_name
      )
    `)
    .eq('status', 'pending')
    .lt('created_at', twoDaysAgo.toISOString())
    .gt('created_at', new Date(now.setDate(now.getDate() - 10)).toISOString());
    
  if (error) {
    console.error('Error finding dealer offer followups:', error);
    return [];
  }
  
  // Group offers by user and valuation
  const offersByUser = {};
  
  for (const offer of data) {
    const userId = offer.user_id;
    const valuationId = offer.valuations.id;
    
    if (!offersByUser[userId]) {
      offersByUser[userId] = {};
    }
    
    if (!offersByUser[userId][valuationId]) {
      offersByUser[userId][valuationId] = {
        email: offer.profiles.email,
        userData: offer.profiles,
        valuationId: valuationId,
        userId: userId,
        valuationData: {
          id: valuationId,
          make: offer.valuations.make,
          model: offer.valuations.model,
          year: offer.valuations.year
        },
        offerCount: 0
      };
    }
    
    offersByUser[userId][valuationId].offerCount++;
  }
  
  // Flatten the grouped data into an array
  const result = [];
  for (const userId in offersByUser) {
    for (const valuationId in offersByUser[userId]) {
      result.push(offersByUser[userId][valuationId]);
    }
  }
  
  return result;
}

// Helper function to trigger an email
async function triggerEmail(data) {
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/trigger-email-campaign`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`
      },
      body: JSON.stringify(data)
    });
    
    const result = await response.json();
    return result;
  } catch (err) {
    console.error('Error triggering email:', err);
    return { success: false, error: err.message };
  }
}

// Helper to check if we've recently sent an email
async function hasSentRecentEmail(userId, emailType, daysThreshold = 7) {
  const now = new Date();
  const threshold = new Date(now);
  threshold.setDate(now.getDate() - daysThreshold);
  
  const { data, error } = await supabase
    .from('email_logs')
    .select('id')
    .eq('user_id', userId)
    .eq('email_type', emailType)
    .eq('status', 'sent')
    .gt('created_at', threshold.toISOString())
    .limit(1);
    
  if (error) {
    console.error('Error checking recent emails:', error);
    return false; // If we can't check, assume we haven't sent
  }
  
  return data && data.length > 0;
}

// Main schedule function
async function scheduleEmailCampaigns() {
  const results = {
    abandoned_valuation: { candidates: 0, sent: 0, errors: 0 },
    premium_upsell: { candidates: 0, sent: 0, errors: 0 },
    dealer_offer_followup: { candidates: 0, sent: 0, errors: 0 },
    photo_upload_prompt: { candidates: 0, sent: 0, errors: 0 },
    reactivation: { candidates: 0, sent: 0, errors: 0 }
  };
  
  // Process abandoned valuations
  const abandonedCandidates = await findAbandonedValuations();
  results.abandoned_valuation.candidates = abandonedCandidates.length;
  
  for (const candidate of abandonedCandidates) {
    const recentlySent = await hasSentRecentEmail(candidate.userId, 'abandoned_valuation');
    if (!recentlySent) {
      const result = await triggerEmail({
        emailType: 'abandoned_valuation',
        email: candidate.email,
        userId: candidate.userId,
        valuationId: candidate.valuationId
      });
      
      if (result.success) {
        results.abandoned_valuation.sent++;
      } else {
        results.abandoned_valuation.errors++;
      }
    }
  }
  
  // Process premium upsell candidates
  const premiumCandidates = await findPremiumUpsellCandidates();
  results.premium_upsell.candidates = premiumCandidates.length;
  
  for (const candidate of premiumCandidates) {
    const recentlySent = await hasSentRecentEmail(candidate.userId, 'premium_upsell');
    if (!recentlySent) {
      const result = await triggerEmail({
        emailType: 'premium_upsell',
        email: candidate.email,
        userId: candidate.userId,
        valuationId: candidate.valuationId
      });
      
      if (result.success) {
        results.premium_upsell.sent++;
      } else {
        results.premium_upsell.errors++;
      }
    }
  }
  
  // Process dealer offer followups
  const offerCandidates = await findDealerOfferFollowups();
  results.dealer_offer_followup.candidates = offerCandidates.length;
  
  for (const candidate of offerCandidates) {
    const recentlySent = await hasSentRecentEmail(candidate.userId, 'dealer_offer_followup');
    if (!recentlySent) {
      const result = await triggerEmail({
        emailType: 'dealer_offer_followup',
        email: candidate.email,
        userId: candidate.userId,
        valuationId: candidate.valuationId
      });
      
      if (result.success) {
        results.dealer_offer_followup.sent++;
      } else {
        results.dealer_offer_followup.errors++;
      }
    }
  }
  
  // Process photo upload prompts
  const photoCandidates = await findPhotoUploadCandidates();
  results.photo_upload_prompt.candidates = photoCandidates.length;
  
  for (const candidate of photoCandidates) {
    const recentlySent = await hasSentRecentEmail(candidate.userId, 'photo_upload_prompt');
    if (!recentlySent) {
      const result = await triggerEmail({
        emailType: 'photo_upload_prompt',
        email: candidate.email,
        userId: candidate.userId,
        valuationId: candidate.valuationId
      });
      
      if (result.success) {
        results.photo_upload_prompt.sent++;
      } else {
        results.photo_upload_prompt.errors++;
      }
    }
  }
  
  // Process inactive users
  const inactiveCandidates = await findInactiveUsers();
  results.reactivation.candidates = inactiveCandidates.length;
  
  for (const candidate of inactiveCandidates) {
    const recentlySent = await hasSentRecentEmail(candidate.userId, 'reactivation', 30); // Only send reactivation emails once a month
    if (!recentlySent) {
      const result = await triggerEmail({
        emailType: 'reactivation',
        email: candidate.email,
        userId: candidate.userId
      });
      
      if (result.success) {
        results.reactivation.sent++;
      } else {
        results.reactivation.errors++;
      }
    }
  }
  
  return results;
}

// Endpoint handling
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // This can be triggered manually or by a cron job
    const results = await scheduleEmailCampaigns();
    
    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      }
    );
  } catch (error) {
    console.error("Error in schedule-email-campaigns function:", error);
    
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
