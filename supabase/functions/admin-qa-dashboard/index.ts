import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface QAReviewRequest {
  valuation_request_id: string;
  reviewer_id: string;
  manual_override_estimate?: number;
  override_reason?: string;
  quality_score?: number; // 1-5
  qa_notes?: string;
  approved?: boolean;
}

interface FraudReviewRequest {
  flag_id: string;
  reviewer_id: string;
  is_valid: boolean;
  review_notes?: string;
}

interface ModelDeploymentRequest {
  model_version: string;
  deployment_status: 'testing' | 'staging' | 'production';
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

    // Verify admin access
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
    
    if (!user) {
      throw new Error('Invalid or expired token');
    }

    // Check if user is admin
    const { data: userRole } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!userRole) {
      throw new Error('Admin access required');
    }

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'get-qa-queue': {
        console.log(`📋 Getting QA queue for admin: ${user.id}`);

        // Get valuations needing review (high value, low confidence, or flagged)
        const { data: qaQueue } = await supabaseClient
          .from('valuation_requests')
          .select(`
            id,
            vin,
            make,
            model,
            year,
            mileage,
            created_at,
            status,
            valuation_results!left(
              estimated_value,
              confidence_score,
              price_range_low,
              price_range_high
            ),
            valuation_qa_reviews!left(
              id,
              approved,
              quality_score,
              reviewer_id
            ),
            fraud_detection_flags!left(
              id,
              flag_type,
              flag_reason,
              confidence_score,
              human_reviewed
            )
          `)
          .or('valuation_results.estimated_value.gte.50000,valuation_results.confidence_score.lt.70')
          .or('fraud_detection_flags.human_reviewed.eq.false,valuation_qa_reviews.id.is.null')
          .order('created_at', { ascending: false })
          .limit(50);

        // Get counts for dashboard
        const { count: totalPending } = await supabaseClient
          .from('valuation_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'completed')
          .is('valuation_qa_reviews.id', null);

        const { count: fraudFlags } = await supabaseClient
          .from('fraud_detection_flags')
          .select('*', { count: 'exact', head: true })
          .eq('human_reviewed', false);

        console.log(`✅ QA queue retrieved: ${qaQueue?.length || 0} items`);

        return new Response(JSON.stringify({
          success: true,
          qa_queue: qaQueue || [],
          stats: {
            total_pending_review: totalPending || 0,
            fraud_flags_pending: fraudFlags || 0,
            items_in_queue: qaQueue?.length || 0
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'submit-qa-review': {
        const reviewData: QAReviewRequest = await req.json();
        
        console.log(`📝 Submitting QA review for valuation: ${reviewData.valuation_request_id}`);

        // Get the original valuation
        const { data: valuation } = await supabaseClient
          .from('valuation_results')
          .select('estimated_value')
          .eq('valuation_request_id', reviewData.valuation_request_id)
          .single();

        if (!valuation) {
          throw new Error('Valuation not found');
        }

        // Store the QA review
        const { data: qaReview, error } = await supabaseClient
          .from('valuation_qa_reviews')
          .insert({
            valuation_request_id: reviewData.valuation_request_id,
            reviewer_id: reviewData.reviewer_id,
            original_estimate: valuation.estimated_value,
            manual_override_estimate: reviewData.manual_override_estimate,
            override_reason: reviewData.override_reason,
            quality_score: reviewData.quality_score,
            qa_notes: reviewData.qa_notes,
            approved: reviewData.approved,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // If there's a manual override, update the valuation result
        if (reviewData.manual_override_estimate && reviewData.approved) {
          await supabaseClient
            .from('valuation_results')
            .update({
              estimated_value: reviewData.manual_override_estimate,
              methodology: { 
                manual_override: true, 
                override_reason: reviewData.override_reason,
                original_estimate: valuation.estimated_value,
                reviewed_by: user.id,
                reviewed_at: new Date().toISOString()
              }
            })
            .eq('valuation_request_id', reviewData.valuation_request_id);
        }

        // Log for compliance
        await supabaseClient
          .from('compliance_audit_log')
          .insert({
            entity_type: 'qa_review',
            entity_id: qaReview.id,
            action: 'created',
            user_id: user.id,
            input_data: { valuation_request_id: reviewData.valuation_request_id },
            output_data: { 
              qa_review_id: qaReview.id,
              manual_override: !!reviewData.manual_override_estimate
            },
            data_sources_used: ['manual_review'],
          });

        console.log(`✅ QA review submitted: ${qaReview.id}`);

        return new Response(JSON.stringify({
          success: true,
          qa_review_id: qaReview.id,
          message: 'QA review submitted successfully'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'review-fraud-flag': {
        const reviewData: FraudReviewRequest = await req.json();
        
        console.log(`🚨 Reviewing fraud flag: ${reviewData.flag_id}`);

        // Update the fraud flag
        const { data: updatedFlag, error } = await supabaseClient
          .from('fraud_detection_flags')
          .update({
            human_reviewed: true,
            is_valid: reviewData.is_valid,
            reviewed_by: reviewData.reviewer_id,
            reviewed_at: new Date().toISOString(),
          })
          .eq('id', reviewData.flag_id)
          .select()
          .single();

        if (error) {
          throw error;
        }

        // If flagged as fraud, potentially remove the listing from comps
        if (reviewData.is_valid && updatedFlag.listing_id) {
          await supabaseClient
            .from('market_comps')
            .update({ 
              confidence_score: 0,
              raw_data: { 
                ...updatedFlag.raw_data, 
                flagged_as_fraud: true,
                flagged_by: user.id,
                flagged_at: new Date().toISOString()
              }
            })
            .eq('id', updatedFlag.listing_id);
        }

        // Log for compliance
        await supabaseClient
          .from('compliance_audit_log')
          .insert({
            entity_type: 'fraud_review',
            entity_id: reviewData.flag_id,
            action: 'reviewed',
            user_id: user.id,
            input_data: { flag_id: reviewData.flag_id, is_valid: reviewData.is_valid },
            output_data: { review_result: reviewData.is_valid ? 'confirmed_fraud' : 'false_positive' },
            data_sources_used: ['manual_review'],
          });

        console.log(`✅ Fraud flag reviewed: ${reviewData.flag_id} - ${reviewData.is_valid ? 'Valid' : 'False positive'}`);

        return new Response(JSON.stringify({
          success: true,
          message: `Fraud flag ${reviewData.is_valid ? 'confirmed' : 'dismissed'}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-model-performance': {
        console.log(`📊 Getting model performance data`);

        // Get latest model runs
        const { data: modelRuns } = await supabaseClient
          .from('model_training_runs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        // Get recent feedback data for model evaluation
        const { data: recentFeedback } = await supabaseClient
          .from('user_valuation_feedback')
          .select(`
            accuracy_rating,
            actual_sale_price,
            valuation_requests!inner(estimated_value)
          `)
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .not('accuracy_rating', 'is', null);

        // Calculate current model performance
        let currentPerformance = null;
        if (recentFeedback && recentFeedback.length > 0) {
          const avgRating = recentFeedback.reduce((sum, f) => sum + f.accuracy_rating, 0) / recentFeedback.length;
          
          const priceAccuracy = recentFeedback
            .filter(f => f.actual_sale_price && f.valuation_requests?.estimated_value)
            .map(f => {
              const error = Math.abs(f.valuation_requests.estimated_value - f.actual_sale_price) / f.actual_sale_price;
              return error;
            });

          const avgPriceError = priceAccuracy.length > 0 
            ? priceAccuracy.reduce((sum, error) => sum + error, 0) / priceAccuracy.length
            : null;

          currentPerformance = {
            avg_user_rating: Math.round(avgRating * 100) / 100,
            avg_price_error_percent: avgPriceError ? Math.round(avgPriceError * 10000) / 100 : null,
            sample_size: recentFeedback.length,
            price_accuracy_sample_size: priceAccuracy.length
          };
        }

        console.log(`✅ Model performance data retrieved`);

        return new Response(JSON.stringify({
          success: true,
          model_runs: modelRuns || [],
          current_performance: currentPerformance,
          deployment_status: {
            production: modelRuns?.find(run => run.deployment_status === 'production')?.model_version || 'unknown',
            staging: modelRuns?.find(run => run.deployment_status === 'staging')?.model_version || null,
            testing: modelRuns?.find(run => run.deployment_status === 'testing')?.model_version || null
          }
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'deploy-model': {
        const deploymentData: ModelDeploymentRequest = await req.json();
        
        console.log(`🚀 Deploying model: ${deploymentData.model_version} to ${deploymentData.deployment_status}`);

        // Update model deployment status
        const { error } = await supabaseClient
          .from('model_training_runs')
          .update({
            deployment_status: deploymentData.deployment_status,
            deployed_at: deploymentData.deployment_status === 'production' ? new Date().toISOString() : null
          })
          .eq('model_version', deploymentData.model_version);

        if (error) {
          throw error;
        }

        // If deploying to production, demote previous production model
        if (deploymentData.deployment_status === 'production') {
          await supabaseClient
            .from('model_training_runs')
            .update({ deployment_status: 'staging' })
            .eq('deployment_status', 'production')
            .neq('model_version', deploymentData.model_version);
        }

        // Log deployment for compliance
        await supabaseClient
          .from('compliance_audit_log')
          .insert({
            entity_type: 'model_deployment',
            entity_id: deploymentData.model_version,
            action: 'deployed',
            user_id: user.id,
            input_data: deploymentData,
            output_data: { deployed_to: deploymentData.deployment_status },
            data_sources_used: ['model_training'],
          });

        console.log(`✅ Model deployed: ${deploymentData.model_version}`);

        return new Response(JSON.stringify({
          success: true,
          message: `Model ${deploymentData.model_version} deployed to ${deploymentData.deployment_status}`
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in admin-qa-dashboard function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});