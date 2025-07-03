import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DataQualityJob {
  job_type: 'vin_enrichment' | 'photo_analysis' | 'anomaly_detection' | 'data_validation';
  batch_size?: number;
  force_reprocess?: boolean;
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

    const { job_type = 'vin_enrichment', batch_size = 100, force_reprocess = false }: DataQualityJob = await req.json();

    console.log(`🔄 Starting data quality job: ${job_type}`);

    const startTime = Date.now();
    let processedCount = 0;
    let errorCount = 0;

    // Log the job start
    const { data: jobLog } = await supabaseClient
      .from('compliance_audit_log')
      .insert({
        entity_type: 'data_quality_job',
        entity_id: crypto.randomUUID(),
        action: 'started',
        input_data: { job_type, batch_size, force_reprocess },
        data_sources_used: ['market_comps', 'market_listings'],
      })
      .select()
      .single();

    switch (job_type) {
      case 'vin_enrichment': {
        console.log(`🔍 Processing VIN enrichment for up to ${batch_size} records`);

        // Get comps and listings that need VIN enrichment
        const { data: recordsToEnrich } = await supabaseClient
          .rpc('get_records_needing_vin_enrichment', { 
            batch_limit: batch_size,
            force_reprocess 
          });

        if (recordsToEnrich && recordsToEnrich.length > 0) {
          // Process in smaller batches to avoid timeouts
          const batchPromises = [];
          for (let i = 0; i < recordsToEnrich.length; i += 10) {
            const batch = recordsToEnrich.slice(i, i + 10);
            batchPromises.push(
              supabaseClient.functions.invoke('vin-enrichment-processor', {
                body: { records: batch }
              })
            );
          }

          const results = await Promise.allSettled(batchPromises);
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              processedCount += 10;
            } else {
              errorCount += 10;
              console.error(`Batch ${index} failed:`, result.reason);
            }
          });
        }
        break;
      }

      case 'photo_analysis': {
        console.log(`📸 Processing photo analysis for up to ${batch_size} records`);

        // Get records with photos that need analysis
        const { data: photosToAnalyze } = await supabaseClient
          .from('market_comps')
          .select('id, vin, listing_url, photo_urls')
          .not('photo_urls', 'is', null)
          .is('ai_photo_analysis.id', null)
          .limit(batch_size);

        if (photosToAnalyze && photosToAnalyze.length > 0) {
          const analysisPromises = photosToAnalyze.map(record =>
            supabaseClient.functions.invoke('ai-photo-analyzer', {
              body: { record }
            })
          );

          const results = await Promise.allSettled(analysisPromises);
          results.forEach((result, index) => {
            if (result.status === 'fulfilled') {
              processedCount++;
            } else {
              errorCount++;
              console.error(`Photo analysis failed for record ${index}:`, result.reason);
            }
          });
        }
        break;
      }

      case 'anomaly_detection': {
        console.log(`🚨 Running anomaly detection on ${batch_size} recent records`);

        const { data, error } = await supabaseClient.functions.invoke('anomaly-detector', {
          body: { batch_size, force_reprocess }
        });

        if (error) {
          throw error;
        }

        processedCount = data?.processed_count || 0;
        errorCount = data?.error_count || 0;
        break;
      }

      case 'data_validation': {
        console.log(`✅ Running data validation on ${batch_size} records`);

        const { data, error } = await supabaseClient.functions.invoke('data-validator', {
          body: { batch_size, force_reprocess }
        });

        if (error) {
          throw error;
        }

        processedCount = data?.processed_count || 0;
        errorCount = data?.error_count || 0;
        break;
      }

      default:
        throw new Error(`Unknown job type: ${job_type}`);
    }

    const processingTime = Date.now() - startTime;

    // Log completion
    await supabaseClient
      .from('compliance_audit_log')
      .insert({
        entity_type: 'data_quality_job',
        entity_id: jobLog?.entity_id || crypto.randomUUID(),
        action: 'completed',
        output_data: { 
          processed_count: processedCount,
          error_count: errorCount,
          success_rate: errorCount > 0 ? ((processedCount / (processedCount + errorCount)) * 100).toFixed(2) : 100
        },
        processing_time_ms: processingTime,
        data_sources_used: ['market_comps', 'market_listings'],
      });

    console.log(`✅ Data quality job completed: ${processedCount} processed, ${errorCount} errors in ${processingTime}ms`);

    return new Response(JSON.stringify({
      success: true,
      job_type,
      processed_count: processedCount,
      error_count: errorCount,
      processing_time_ms: processingTime,
      success_rate: errorCount > 0 ? ((processedCount / (processedCount + errorCount)) * 100).toFixed(2) : 100
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in data-quality-orchestrator:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});