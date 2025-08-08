import { serve } from "https://deno.land/std@0.208.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Correlation-Id",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed", details: "Only POST requests are supported" }),
      { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  const startTime = Date.now();
  const correlationId = req.headers.get("X-Correlation-Id") || `recalls-${Date.now()}`;
  
  try {
    // Parse request body
    const requestBody = await req.json();
    const { vin } = requestBody;

    // Validate VIN
    if (!vin || typeof vin !== "string" || vin.length !== 17) {
      console.error(`[${correlationId}] Invalid VIN format:`, vin);
      return new Response(
        JSON.stringify({ 
          error: "Invalid VIN format", 
          details: "VIN must be exactly 17 characters",
          vin: vin || null
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // VIN format validation (alphanumeric, excluding I, O, Q)
    const vinPattern = /^[A-HJ-NPR-Z0-9]{17}$/i;
    if (!vinPattern.test(vin)) {
      console.error(`[${correlationId}] Invalid VIN characters:`, vin);
      return new Response(
        JSON.stringify({ 
          error: "Invalid VIN format", 
          details: "VIN contains invalid characters",
          vin: vin
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`[${correlationId}] Processing recalls request for VIN: ${vin}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Check cache first
    const cacheKey = `recalls:VIN:${vin}`;
    const cacheTTL = parseInt(Deno.env.get("RECALLS_CACHE_TTL") || "3600"); // Default 1 hour
    let cacheHit = false;
    let degraded = false;

    console.log(`[${correlationId}] Checking cache for key: ${cacheKey}`);

    // Get cached data from database
    const { data: cachedData, error: cacheError } = await supabase
      .rpc('get_cached_recall_data', { vin_param: vin });

    if (cacheError) {
      console.warn(`[${correlationId}] Cache check failed:`, cacheError);
    }

    // If we have cached data and it's recent enough, use it
    if (cachedData && Array.isArray(cachedData) && cachedData.length > 0) {
      // For simplicity, we'll use the cache if it exists
      // In production, you'd check timestamps and TTL
      cacheHit = true;
      console.log(`[${correlationId}] Cache hit - returning ${cachedData.length} cached recalls`);
      
      const elapsedMs = Date.now() - startTime;
      console.log(`[${correlationId}] Request completed in ${elapsedMs}ms (cache hit)`);
      
      return new Response(
        JSON.stringify({
          vin: vin,
          count: cachedData.length,
          degraded: false,
          recalls: cachedData,
          cached: true,
          elapsedMs: elapsedMs
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Cache miss - fetch from NHTSA API
    console.log(`[${correlationId}] Cache miss - fetching from NHTSA API`);

    const nhtsaUrl = `https://api.nhtsa.gov/recalls/recallsByVehicle?vin=${vin}`;
    const timeout = 2500; // 2.5 seconds
    const maxRetries = 2;
    let lastError: Error | null = null;
    let nhtsaData: any = null;

    // Retry logic
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`[${correlationId}] NHTSA API attempt ${attempt}/${maxRetries + 1}: ${nhtsaUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(nhtsaUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'AIN-Valuation-Engine/1.0',
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`NHTSA API HTTP ${response.status}: ${response.statusText}`);
        }

        nhtsaData = await response.json();
        console.log(`[${correlationId}] NHTSA API success on attempt ${attempt}`);
        break;

      } catch (error) {
        lastError = error as Error;
        console.warn(`[${correlationId}] NHTSA API attempt ${attempt} failed:`, error.message);
        
        if (attempt <= maxRetries) {
          // Wait before retry (exponential backoff)
          const delay = 500 * Math.pow(2, attempt - 1);
          console.log(`[${correlationId}] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If all attempts failed, mark as degraded and return empty result
    if (!nhtsaData) {
      degraded = true;
      console.error(`[${correlationId}] All NHTSA API attempts failed. Last error:`, lastError?.message);
      
      const elapsedMs = Date.now() - startTime;
      console.log(`[${correlationId}] Request completed in ${elapsedMs}ms (degraded)`);
      
      return new Response(
        JSON.stringify({
          vin: vin,
          count: 0,
          degraded: true,
          recalls: [],
          error: "NHTSA API unavailable",
          elapsedMs: elapsedMs
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize NHTSA response
    const recalls = Array.isArray(nhtsaData.results) ? nhtsaData.results : [];
    const normalizedRecalls = recalls.map((recall: any) => ({
      campaign_number: recall.NHTSACampaignNumber || recall.campaignNumber || `RECALL-${Date.now()}`,
      component: recall.Component || recall.component || 'Unknown Component',
      summary: recall.Summary || recall.summary || '',
      consequence: recall.Consequence || recall.consequence || '',
      remedy: recall.Remedy || recall.remedy || '',
      report_received_date: recall.ReportReceivedDate || recall.reportReceivedDate || null,
      is_open: recall.RemedyStatus !== 'Complete' && recall.RemedyStatus !== 'Closed',
      source: 'nhtsa',
      manufacturer: recall.Manufacturer || recall.manufacturer || 'Unknown'
    }));

    console.log(`[${correlationId}] Normalized ${normalizedRecalls.length} recalls from NHTSA`);

    console.log(`[${correlationId}] Normalized ${normalizedRecalls.length} recalls from NHTSA`);

    // Cache the results using RPC
    if (normalizedRecalls.length > 0) {
      try {
        const { data: cacheResult, error: cacheError } = await supabase
          .rpc('rpc_upsert_recalls', { 
            vin_param: vin, 
            recalls_payload: normalizedRecalls 
          });

        if (cacheError) {
          console.warn(`[${correlationId}] Failed to cache recalls:`, cacheError);
          degraded = true;
        } else {
          console.log(`[${correlationId}] Cached recalls successfully:`, cacheResult);
        }
      } catch (error) {
        console.warn(`[${correlationId}] Cache operation failed:`, error);
        degraded = true;
      }
    }

    // Return successful response
    const elapsedMs = Date.now() - startTime;
    console.log(`[${correlationId}] Request completed in ${elapsedMs}ms (fresh data)`);

    return new Response(
      JSON.stringify({
        vin: vin,
        count: normalizedRecalls.length,
        degraded: degraded,
        recalls: normalizedRecalls,
        cached: false,
        elapsedMs: elapsedMs
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    const elapsedMs = Date.now() - startTime;
    console.error(`[${correlationId}] Request failed after ${elapsedMs}ms:`, error);
    
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error.message,
        correlationId: correlationId,
        elapsedMs: elapsedMs
      }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
