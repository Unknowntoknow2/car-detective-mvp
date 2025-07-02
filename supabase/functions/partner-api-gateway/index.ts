import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
};

interface ValuationRequest {
  vin?: string;
  make: string;
  model: string;
  year: number;
  mileage?: number;
  zip_code?: string;
  condition?: string;
  features?: string[];
}

interface PartnerSubmission {
  submission_type: 'sale' | 'listing' | 'auction_result';
  vin: string;
  vehicle_data: {
    year: number;
    make: string;
    model: string;
    trim?: string;
    mileage?: number;
    condition?: string;
    features?: string[];
  };
  sale_data?: {
    price: number;
    date: string;
    buyer_type?: string;
    location?: string;
  };
}

// Rate limiting store (in production, use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(apiKey: string, hourlyLimit: number): boolean {
  const now = Date.now();
  const hour = Math.floor(now / (1000 * 60 * 60));
  const key = `${apiKey}:${hour}`;
  
  const current = rateLimitStore.get(key) || { count: 0, resetTime: hour + 1 };
  
  if (current.count >= hourlyLimit) {
    return false;
  }
  
  current.count += 1;
  rateLimitStore.set(key, current);
  
  return true;
}

async function authenticatePartner(supabaseClient: any, apiKey: string) {
  const hashedKey = createHash("sha256").update(apiKey).toString();
  
  const { data: partner } = await supabaseClient
    .from('api_partners')
    .select('*')
    .eq('api_key_hash', hashedKey)
    .eq('is_active', true)
    .single();

  if (!partner) {
    throw new Error('Invalid API key');
  }

  // Check rate limit
  if (!checkRateLimit(apiKey, partner.rate_limit_per_hour)) {
    throw new Error('Rate limit exceeded');
  }

  // Update last accessed
  await supabaseClient
    .from('api_partners')
    .update({ last_accessed: new Date().toISOString() })
    .eq('id', partner.id);

  return partner;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const apiKey = req.headers.get('x-api-key');
    if (!apiKey) {
      throw new Error('API key required in x-api-key header');
    }

    const partner = await authenticatePartner(supabaseClient, apiKey);
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').slice(-2).join('/'); // Get last two path segments

    console.log(`🔗 Partner API request: ${partner.partner_name} -> ${endpoint}`);

    // Log the API request for compliance
    await supabaseClient
      .from('compliance_audit_log')
      .insert({
        entity_type: 'api_request',
        entity_id: partner.id,
        action: 'api_call',
        user_id: null,
        ip_address: req.headers.get('x-forwarded-for') || 'unknown',
        user_agent: req.headers.get('user-agent'),
        input_data: { endpoint, partner: partner.partner_name },
        data_sources_used: ['partner_api'],
      });

    switch (endpoint) {
      case 'valuation/request': {
        // Check permissions
        if (!partner.permissions.valuation_access) {
          throw new Error('Valuation access not permitted for this partner');
        }

        const valuationData: ValuationRequest = await req.json();
        
        // Validate required fields
        if (!valuationData.make || !valuationData.model || !valuationData.year) {
          throw new Error('Missing required fields: make, model, year');
        }

        console.log(`📊 Processing valuation request for partner: ${partner.partner_name}`);

        // Create valuation request
        const { data: request, error: requestError } = await supabaseClient
          .from('valuation_requests')
          .insert({
            user_id: null, // Partner requests don't have user_id
            vin: valuationData.vin,
            make: valuationData.make,
            model: valuationData.model,
            year: valuationData.year,
            mileage: valuationData.mileage,
            zip_code: valuationData.zip_code,
            condition: valuationData.condition,
            features: valuationData.features || [],
            requested_by: 'partner_api',
            meta: { partner_id: partner.id, partner_name: partner.partner_name },
          })
          .select()
          .single();

        if (requestError) {
          throw requestError;
        }

        // Trigger aggregation
        const { data: aggregationResult } = await supabaseClient.functions.invoke('ain-full-market-orchestrator', {
          body: {
            request_id: request.id,
            vehicle_params: {
              year: valuationData.year,
              make: valuationData.make,
              model: valuationData.model,
              trim: null,
              mileage: valuationData.mileage,
              zip_code: valuationData.zip_code,
              condition: valuationData.condition
            }
          }
        });

        // Get the result
        const { data: result } = await supabaseClient.functions.invoke('valuation-result', {
          body: { request_id: request.id }
        });

        const response = {
          success: true,
          request_id: request.id,
          valuation: {
            estimated_value: result.data?.valuation_result?.estimated_value,
            confidence_score: result.data?.valuation_result?.confidence_score,
            price_range: {
              low: result.data?.valuation_result?.price_range_low,
              high: result.data?.valuation_result?.price_range_high
            },
            comp_count: result.data?.summary?.comp_count || 0,
            data_sources: Object.keys(result.data?.summary?.source_breakdown || {}),
          },
          metadata: {
            processing_time_ms: aggregationResult?.execution_time_ms,
            sources_processed: aggregationResult?.sources_processed,
          }
        };

        console.log(`✅ Valuation completed for partner: ${partner.partner_name} - $${response.valuation.estimated_value}`);

        return new Response(JSON.stringify(response), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'data/submit': {
        // Check permissions
        if (!partner.permissions.data_submission) {
          throw new Error('Data submission not permitted for this partner');
        }

        const submissionData: PartnerSubmission = await req.json();
        
        // Validate required fields
        if (!submissionData.vin || !submissionData.vehicle_data.make || !submissionData.vehicle_data.model) {
          throw new Error('Missing required fields: vin, vehicle_data.make, vehicle_data.model');
        }

        console.log(`📤 Processing data submission from partner: ${partner.partner_name}`);

        // Store the submission
        const { data: submission, error: submissionError } = await supabaseClient
          .from('partner_submissions')
          .insert({
            partner_id: partner.id,
            submission_type: submissionData.submission_type,
            vin: submissionData.vin,
            vehicle_data: submissionData.vehicle_data,
            sale_data: submissionData.sale_data,
            verification_status: 'pending',
            processed: false,
          })
          .select()
          .single();

        if (submissionError) {
          throw submissionError;
        }

        // If it's a verified sale, add it to market comps
        if (submissionData.submission_type === 'sale' && submissionData.sale_data) {
          await supabaseClient
            .from('market_comps')
            .insert({
              vin: submissionData.vin,
              year: submissionData.vehicle_data.year,
              make: submissionData.vehicle_data.make,
              model: submissionData.vehicle_data.model,
              trim: submissionData.vehicle_data.trim,
              price: submissionData.sale_data.price,
              mileage: submissionData.vehicle_data.mileage,
              condition: submissionData.vehicle_data.condition,
              source: partner.partner_name,
              source_type: partner.partner_type,
              location: submissionData.sale_data.location,
              listing_url: '#partner-submission',
              confidence_score: 95, // High confidence for verified partner data
              raw_data: { partner_submission: true, submission_id: submission.id },
            });
        }

        console.log(`✅ Data submitted successfully by partner: ${partner.partner_name}`);

        return new Response(JSON.stringify({
          success: true,
          submission_id: submission.id,
          status: 'received',
          message: 'Data submission received and will be processed'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'status/health': {
        // Health check endpoint
        return new Response(JSON.stringify({
          success: true,
          status: 'healthy',
          partner: partner.partner_name,
          timestamp: new Date().toISOString(),
          rate_limit_remaining: partner.rate_limit_per_hour - (rateLimitStore.get(`${apiKey}:${Math.floor(Date.now() / (1000 * 60 * 60))}`)?.count || 0),
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'usage/stats': {
        // Get usage statistics for the partner
        const { data: recentRequests } = await supabaseClient
          .from('compliance_audit_log')
          .select('created_at, action')
          .eq('entity_id', partner.id)
          .eq('entity_type', 'api_request')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order('created_at', { ascending: false });

        const stats = {
          partner_name: partner.partner_name,
          requests_last_30_days: recentRequests?.length || 0,
          rate_limit_per_hour: partner.rate_limit_per_hour,
          current_hour_usage: rateLimitStore.get(`${apiKey}:${Math.floor(Date.now() / (1000 * 60 * 60))}`)?.count || 0,
          last_accessed: partner.last_accessed,
          permissions: partner.permissions,
        };

        return new Response(JSON.stringify({
          success: true,
          stats
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid endpoint');
    }

  } catch (error) {
    console.error('Error in partner-api-gateway function:', error);
    
    const statusCode = error.message.includes('Rate limit') ? 429 :
                      error.message.includes('Invalid API key') ? 401 :
                      error.message.includes('not permitted') ? 403 :
                      error.message.includes('Missing required') ? 400 : 500;

    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: statusCode,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});