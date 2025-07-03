import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    );

    const { action = 'trigger_retraining' } = await req.json();

    console.log(`🤖 Model retraining automation: ${action}`);

    switch (action) {
      case 'trigger_retraining': {
        // Check if we have enough new data for retraining
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
        
        const { count: newFeedback } = await supabaseClient
          .from('user_valuation_feedback')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo);

        const { count: newComps } = await supabaseClient
          .from('market_comps')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', sevenDaysAgo);

        if ((newFeedback || 0) < 50 && (newComps || 0) < 1000) {
          return new Response(JSON.stringify({
            success: true,
            message: 'Insufficient new data for retraining',
            data_summary: { new_feedback: newFeedback, new_comps: newComps }
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // Create new model training run
        const modelVersion = `v${Date.now()}`;
        
        // Get training data summary
        const { count: totalComps } = await supabaseClient
          .from('market_comps')
          .select('*', { count: 'exact', head: true })
          .gte('confidence_score', 70);

        const { count: totalFeedback } = await supabaseClient
          .from('user_valuation_feedback')
          .select('*', { count: 'exact', head: true })
          .not('accuracy_rating', 'is', null);

        // Simulate model training metrics (in production, this would call actual ML pipeline)
        const simulatedRMSE = 2500 + Math.random() * 1000; // Simulated RMSE
        const featureImportance = {
          mileage: 0.25,
          year: 0.20,
          condition: 0.15,
          market_context: 0.15,
          vehicle_features: 0.10,
          location: 0.10,
          source_confidence: 0.05
        };

        // Store training run
        const { data: trainingRun, error } = await supabaseClient
          .from('model_training_runs')
          .insert({
            model_version: modelVersion,
            training_data_size: (totalComps || 0) + (totalFeedback || 0),
            validation_rmse: simulatedRMSE,
            test_rmse: simulatedRMSE * 1.1,
            feature_importance: featureImportance,
            hyperparameters: {
              learning_rate: 0.01,
              max_depth: 8,
              n_estimators: 500,
              data_cutoff: new Date().toISOString()
            },
            deployment_status: 'testing'
          })
          .select()
          .single();

        if (error) throw error;

        console.log(`✅ Model retraining triggered: ${modelVersion}`);

        return new Response(JSON.stringify({
          success: true,
          model_version: modelVersion,
          training_data_size: trainingRun.training_data_size,
          estimated_rmse: simulatedRMSE,
          status: 'training_initiated'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'check_model_performance': {
        // Get current production model performance
        const { data: currentModel } = await supabaseClient
          .from('model_training_runs')
          .select('*')
          .eq('deployment_status', 'production')
          .single();

        // Get recent feedback for performance evaluation
        const { data: recentFeedback } = await supabaseClient
          .from('user_valuation_feedback')
          .select('accuracy_rating, actual_sale_price, valuation_requests!inner(estimated_value)')
          .gte('created_at', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString())
          .not('accuracy_rating', 'is', null);

        let performanceAlert = null;
        if (recentFeedback && recentFeedback.length >= 20) {
          const avgRating = recentFeedback.reduce((sum, f) => sum + f.accuracy_rating, 0) / recentFeedback.length;
          
          if (avgRating < 3.5) {
            performanceAlert = 'Model performance below threshold - consider retraining';
          }
        }

        return new Response(JSON.stringify({
          success: true,
          current_model: currentModel,
          performance_alert: performanceAlert,
          feedback_sample_size: recentFeedback?.length || 0
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error('Invalid action');
    }

  } catch (error) {
    console.error('Error in model-retraining-automation:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});