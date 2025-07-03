import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FeedbackSubmission {
  valuation_request_id: string;
  user_id: string;
  actual_sale_price?: number;
  sale_date?: string;
  sale_type?: 'dealer' | 'private' | 'trade' | 'auction';
  best_offer_received?: number;
  feedback_notes?: string;
  accuracy_rating?: number; // 1-5 stars
  would_recommend?: boolean;
}

interface FeedbackAnalysis {
  timeframe_days?: number;
  min_feedback_count?: number;
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

    const url = new URL(req.url);
    const action = url.pathname.split('/').pop();

    switch (action) {
      case 'submit-feedback': {
        const feedbackData: FeedbackSubmission = await req.json();
        
        console.log(`📝 Submitting feedback for valuation: ${feedbackData.valuation_request_id}`);

        // Validate the valuation request exists and belongs to the user
        const { data: valuation } = await supabaseClient
          .from('valuation_requests')
          .select('id, user_id, estimated_value')
          .eq('id', feedbackData.valuation_request_id)
          .eq('user_id', feedbackData.user_id)
          .single();

        if (!valuation) {
          throw new Error('Valuation request not found or access denied');
        }

        // Store the feedback
        const { data: feedback, error } = await supabaseClient
          .from('user_valuation_feedback')
          .insert({
            valuation_request_id: feedbackData.valuation_request_id,
            user_id: feedbackData.user_id,
            actual_sale_price: feedbackData.actual_sale_price,
            sale_date: feedbackData.sale_date,
            sale_type: feedbackData.sale_type,
            best_offer_received: feedbackData.best_offer_received,
            feedback_notes: feedbackData.feedback_notes,
            accuracy_rating: feedbackData.accuracy_rating,
            would_recommend: feedbackData.would_recommend,
          })
          .select()
          .single();

        if (error) {
          throw error;
        }

        // Log for compliance audit
        await supabaseClient
          .from('compliance_audit_log')
          .insert({
            entity_type: 'user_feedback',
            entity_id: feedback.id,
            action: 'created',
            user_id: feedbackData.user_id,
            input_data: { valuation_request_id: feedbackData.valuation_request_id },
            output_data: { feedback_id: feedback.id },
            data_sources_used: ['user_input'],
          });

        console.log(`✅ Feedback submitted successfully: ${feedback.id}`);

        // Trigger model retraining if we have enough new feedback
        const { count } = await supabaseClient
          .from('user_valuation_feedback')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

        if (count && count >= 50) {
          console.log(`🔄 Triggering model retraining due to ${count} new feedback entries`);
          // Could trigger a separate retraining function here
        }

        return new Response(JSON.stringify({ 
          success: true, 
          feedback_id: feedback.id,
          message: 'Thank you for your feedback! This helps us improve our valuations.'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-feedback-stats': {
        const { timeframe_days = 30, min_feedback_count = 5 }: FeedbackAnalysis = await req.json();
        
        console.log(`📊 Analyzing feedback stats for last ${timeframe_days} days`);

        const timeframeStart = new Date(Date.now() - timeframe_days * 24 * 60 * 60 * 1000).toISOString();

        // Get overall feedback statistics
        const { data: feedbackStats } = await supabaseClient
          .from('user_valuation_feedback')
          .select(`
            id,
            accuracy_rating,
            would_recommend,
            actual_sale_price,
            valuation_requests!inner(estimated_value, make, model, year)
          `)
          .gte('created_at', timeframeStart)
          .not('accuracy_rating', 'is', null);

        if (!feedbackStats || feedbackStats.length < min_feedback_count) {
          return new Response(JSON.stringify({ 
            success: true, 
            message: `Insufficient feedback data (${feedbackStats?.length || 0} entries, need ${min_feedback_count})`,
            stats: null
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Calculate accuracy metrics
        const accuracyRatings = feedbackStats.map(f => f.accuracy_rating).filter(r => r !== null);
        const avgAccuracyRating = accuracyRatings.reduce((sum, rating) => sum + rating, 0) / accuracyRatings.length;

        const recommendationRate = feedbackStats.filter(f => f.would_recommend === true).length / feedbackStats.length;

        // Calculate price accuracy where we have both actual and estimated
        const priceComparisons = feedbackStats
          .filter(f => f.actual_sale_price && f.valuation_requests?.estimated_value)
          .map(f => {
            const estimated = f.valuation_requests.estimated_value;
            const actual = f.actual_sale_price;
            const percentError = Math.abs((estimated - actual) / actual) * 100;
            return {
              estimated,
              actual,
              percent_error: percentError,
              absolute_error: Math.abs(estimated - actual)
            };
          });

        const avgPercentError = priceComparisons.length > 0
          ? priceComparisons.reduce((sum, comp) => sum + comp.percent_error, 0) / priceComparisons.length
          : null;

        const withinTenPercent = priceComparisons.filter(comp => comp.percent_error <= 10).length;
        const within10PercentRate = priceComparisons.length > 0 ? withinTenPercent / priceComparisons.length : null;

        // Calculate by vehicle segment
        const segmentStats = {};
        feedbackStats.forEach(feedback => {
          const vehicle = feedback.valuation_requests;
          if (vehicle?.make && vehicle?.model) {
            const segment = `${vehicle.make} ${vehicle.model}`;
            if (!segmentStats[segment]) {
              segmentStats[segment] = {
                count: 0,
                total_rating: 0,
                price_comparisons: []
              };
            }
            segmentStats[segment].count += 1;
            segmentStats[segment].total_rating += feedback.accuracy_rating || 0;
            
            if (feedback.actual_sale_price && vehicle.estimated_value) {
              segmentStats[segment].price_comparisons.push({
                estimated: vehicle.estimated_value,
                actual: feedback.actual_sale_price
              });
            }
          }
        });

        const processedSegmentStats = Object.entries(segmentStats)
          .map(([segment, stats]: [string, any]) => ({
            segment,
            feedback_count: stats.count,
            avg_rating: stats.total_rating / stats.count,
            price_accuracy: stats.price_comparisons.length > 0 
              ? stats.price_comparisons.reduce((sum: number, comp: any) => 
                  sum + Math.abs((comp.estimated - comp.actual) / comp.actual), 0) / stats.price_comparisons.length * 100
              : null
          }))
          .filter(stat => stat.feedback_count >= 3)
          .sort((a, b) => b.feedback_count - a.feedback_count);

        const stats = {
          timeframe_days,
          total_feedback_count: feedbackStats.length,
          avg_accuracy_rating: Math.round(avgAccuracyRating * 100) / 100,
          recommendation_rate: Math.round(recommendationRate * 100) / 100,
          price_accuracy: {
            comparison_count: priceComparisons.length,
            avg_percent_error: avgPercentError ? Math.round(avgPercentError * 100) / 100 : null,
            within_10_percent_rate: within10PercentRate ? Math.round(within10PercentRate * 100) / 100 : null,
          },
          segment_performance: processedSegmentStats.slice(0, 10), // Top 10 segments
          recent_improvements: {
            // Could calculate trends over time here
            trend_direction: 'stable' // placeholder
          }
        };

        console.log(`✅ Feedback stats calculated: ${feedbackStats.length} entries analyzed`);

        return new Response(JSON.stringify({ 
          success: true, 
          stats 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'get-user-feedback': {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
          throw new Error('Authorization header required');
        }

        // Get user ID from the auth token (this would need proper JWT validation in production)
        const { data: { user } } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
        
        if (!user) {
          throw new Error('Invalid or expired token');
        }

        const { data: userFeedback } = await supabaseClient
          .from('user_valuation_feedback')
          .select(`
            *,
            valuation_requests!inner(
              year, make, model, estimated_value, created_at
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        return new Response(JSON.stringify({ 
          success: true, 
          feedback: userFeedback || []
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in user-feedback-collector function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});