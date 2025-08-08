import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

interface BackfillRequest {
  days?: number;
  limit?: number;
  dry_run?: boolean;
  rate_limit_ms?: number;
}

interface ProcessResult {
  vin: string;
  success: boolean;
  error?: string;
  safety_populated: boolean;
  airbags_populated: boolean;
  lighting_populated: boolean;
  processing_time_ms: number;
}

interface BackfillStats {
  total_vins: number;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  safety_updated: number;
  airbags_updated: number;
  lighting_updated: number;
  total_time_ms: number;
  average_time_per_vin_ms: number;
}

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Parse request body
    const body: BackfillRequest = await req.json().catch(() => ({}));
    const {
      days = 14,
      limit = 100,
      dry_run = false,
      rate_limit_ms = 1000
    } = body;

    console.log(`🔄 Starting backfill job - Days: ${days}, Limit: ${limit}, Dry Run: ${dry_run}`);

    // Get recent VINs from vin_history
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const { data: recentVins, error: vinError } = await supabase
      .from('vin_history')
      .select('vin, created_at')
      .gte('created_at', cutoffDate.toISOString())
      .eq('decode_success', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (vinError) {
      throw new Error(`Failed to fetch recent VINs: ${vinError.message}`);
    }

    if (!recentVins || recentVins.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "No recent VINs found for backfill",
          stats: { total_vins: 0, processed: 0 }
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`📊 Found ${recentVins.length} recent VINs to process`);

    // Get unique VINs (deduplicate)
    const uniqueVins = [...new Set(recentVins.map(v => v.vin))];
    console.log(`🎯 Processing ${uniqueVins.length} unique VINs`);

    const stats: BackfillStats = {
      total_vins: uniqueVins.length,
      processed: 0,
      succeeded: 0,
      failed: 0,
      skipped: 0,
      safety_updated: 0,
      airbags_updated: 0,
      lighting_updated: 0,
      total_time_ms: 0,
      average_time_per_vin_ms: 0
    };

    const results: ProcessResult[] = [];
    const startTime = Date.now();

    for (let i = 0; i < uniqueVins.length; i++) {
      const vin = uniqueVins[i];
      const processStart = Date.now();
      
      try {
        console.log(`🔍 Processing VIN ${i + 1}/${uniqueVins.length}: ${vin}`);

        // Check if VIN already has safety data
        const { data: existingSpecs, error: specsError } = await supabase
          .from('vehicle_specs')
          .select('vin, safety_equipment, airbags, lighting')
          .eq('vin', vin)
          .single();

        if (specsError && specsError.code !== 'PGRST116') { // Not found is OK
          throw new Error(`Failed to check existing specs: ${specsError.message}`);
        }

        const hasSafety = existingSpecs?.safety_equipment && 
          Object.keys(existingSpecs.safety_equipment).length > 0;
        const hasAirbags = existingSpecs?.airbags && 
          Object.keys(existingSpecs.airbags).length > 0;
        const hasLighting = existingSpecs?.lighting && 
          Object.keys(existingSpecs.lighting).length > 0;

        if (hasSafety && hasAirbags && hasLighting) {
          console.log(`⏭️  VIN ${vin} already has complete safety data, skipping`);
          stats.skipped++;
          
          results.push({
            vin,
            success: true,
            safety_populated: true,
            airbags_populated: true,
            lighting_populated: true,
            processing_time_ms: Date.now() - processStart
          });
          continue;
        }

        if (dry_run) {
          console.log(`🧪 DRY RUN: Would process VIN ${vin} (missing safety data)`);
          stats.processed++;
          continue;
        }

        // Call decode-vin function to refresh/populate safety data
        const decodeResponse = await fetch(`${supabaseUrl}/functions/v1/decode-vin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}`
          },
          body: JSON.stringify({ vin })
        });

        if (!decodeResponse.ok) {
          throw new Error(`Decode VIN API call failed: ${decodeResponse.status}`);
        }

        const decodeResult = await decodeResponse.json();
        
        if (!decodeResult.success) {
          throw new Error(`Decode VIN failed: ${decodeResult.error || 'Unknown error'}`);
        }

        // Check what was updated
        const { data: updatedSpecs, error: updatedError } = await supabase
          .from('vehicle_specs')
          .select('safety_equipment, airbags, lighting')
          .eq('vin', vin)
          .single();

        if (updatedError) {
          throw new Error(`Failed to fetch updated specs: ${updatedError.message}`);
        }

        const safetyPopulated = updatedSpecs?.safety_equipment && 
          Object.keys(updatedSpecs.safety_equipment).length > 0;
        const airbagsPopulated = updatedSpecs?.airbags && 
          Object.keys(updatedSpecs.airbags).length > 0;
        const lightingPopulated = updatedSpecs?.lighting && 
          Object.keys(updatedSpecs.lighting).length > 0;

        if (safetyPopulated && !hasSafety) stats.safety_updated++;
        if (airbagsPopulated && !hasAirbags) stats.airbags_updated++;
        if (lightingPopulated && !hasLighting) stats.lighting_updated++;

        const processingTime = Date.now() - processStart;
        stats.succeeded++;
        stats.processed++;

        results.push({
          vin,
          success: true,
          safety_populated: safetyPopulated,
          airbags_populated: airbagsPopulated,
          lighting_populated: lightingPopulated,
          processing_time_ms: processingTime
        });

        console.log(`✅ VIN ${vin} processed successfully in ${processingTime}ms`);

        // Rate limiting
        if (rate_limit_ms > 0 && i < uniqueVins.length - 1) {
          await new Promise(resolve => setTimeout(resolve, rate_limit_ms));
        }

      } catch (error) {
        const processingTime = Date.now() - processStart;
        stats.failed++;
        stats.processed++;

        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error(`❌ Failed to process VIN ${vin}: ${errorMessage}`);

        results.push({
          vin,
          success: false,
          error: errorMessage,
          safety_populated: false,
          airbags_populated: false,
          lighting_populated: false,
          processing_time_ms: processingTime
        });
      }
    }

    stats.total_time_ms = Date.now() - startTime;
    stats.average_time_per_vin_ms = stats.processed > 0 ? 
      Math.round(stats.total_time_ms / stats.processed) : 0;

    console.log(`🎯 Backfill completed!`);
    console.log(`📊 Stats: ${stats.succeeded}/${stats.total_vins} succeeded, ${stats.failed} failed, ${stats.skipped} skipped`);
    console.log(`🔧 Updates: ${stats.safety_updated} safety, ${stats.airbags_updated} airbags, ${stats.lighting_updated} lighting`);
    console.log(`⏱️  Total time: ${stats.total_time_ms}ms, Avg per VIN: ${stats.average_time_per_vin_ms}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        message: dry_run ? "Dry run completed" : "Backfill completed",
        stats,
        results: results.slice(0, 10), // Return first 10 results as sample
        total_results: results.length
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Backfill job failed:", errorMessage);

    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
