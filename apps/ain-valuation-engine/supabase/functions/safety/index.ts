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
  const correlationId = req.headers.get("X-Correlation-Id") || `safety-${Date.now()}`;
  
  try {
    // Parse request body
    const requestBody = await req.json();
    let { vin, year, make, model, trim } = requestBody;

    // Validate input - must have either VIN or year/make/model
    if (!vin && (!year || !make || !model)) {
      console.error(`[${correlationId}] Invalid input - need VIN or year/make/model`);
      return new Response(
        JSON.stringify({ 
          error: "Invalid input", 
          details: "Must provide either 'vin' or 'year', 'make', and 'model'"
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // VIN validation if provided
    if (vin) {
      if (typeof vin !== "string" || vin.length !== 17) {
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
    }

    console.log(`[${correlationId}] Processing safety ratings request for VIN: ${vin || 'N/A'}, Year/Make/Model: ${year}/${make}/${model}`);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // If VIN provided, try to decode it first to get year/make/model
    if (vin && (!year || !make || !model)) {
      console.log(`[${correlationId}] VIN provided without year/make/model - attempting decode`);
      
      // Check if we have vehicle specs for this VIN
      const { data: vehicleSpecs, error: specError } = await supabase
        .from('vehicle_specs')
        .select('year, make, model, trim')
        .eq('vin', vin)
        .single();

      if (vehicleSpecs && !specError) {
        year = vehicleSpecs.year;
        make = vehicleSpecs.make;
        model = vehicleSpecs.model;
        trim = vehicleSpecs.trim;
        console.log(`[${correlationId}] Found vehicle specs: ${year} ${make} ${model}`);
      } else {
        // Try to decode VIN via NHTSA vPIC API
        try {
          const decodeUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevinvalues/${vin}?format=json`;
          const decodeResponse = await fetch(decodeUrl, {
            signal: AbortSignal.timeout(5000),
            headers: { 'User-Agent': 'AIN-Safety-Engine/1.0' }
          });

          if (decodeResponse.ok) {
            const decodeData = await decodeResponse.json();
            if (decodeData.Results && decodeData.Results[0]) {
              const result = decodeData.Results[0];
              year = parseInt(result.ModelYear) || year;
              make = result.Make || make;
              model = result.Model || model;
              trim = result.Trim || trim;
              console.log(`[${correlationId}] Decoded VIN: ${year} ${make} ${model}`);
            }
          }
        } catch (decodeError) {
          console.warn(`[${correlationId}] VIN decode failed:`, decodeError.message);
        }
      }
    }

    // Validate we have required fields
    if (!year || !make || !model) {
      console.error(`[${correlationId}] Missing required fields after decode attempt`);
      return new Response(
        JSON.stringify({ 
          error: "Insufficient data", 
          details: "Could not determine year, make, and model for safety rating lookup",
          vin: vin || null
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Check cache first
    const cacheKey = `ncap:${year}:${make.toUpperCase()}:${model.toUpperCase()}`;
    const cacheTTL = parseInt(Deno.env.get("SAFETY_CACHE_TTL") || "86400"); // Default 24 hours
    let cacheHit = false;
    let degraded = false;

    console.log(`[${correlationId}] Checking cache for key: ${cacheKey}`);

    // Get cached data from database
    const { data: cachedData, error: cacheError } = await supabase
      .rpc('get_cached_safety_data', { 
        vin_param: vin,
        year_param: year,
        make_param: make,
        model_param: model
      });

    if (cacheError) {
      console.warn(`[${correlationId}] Cache check failed:`, cacheError);
    }

    // Check if cache is fresh (less than TTL old)
    if (cachedData && Object.keys(cachedData).length > 0 && cachedData.fetched_at) {
      const cacheAge = Date.now() - new Date(cachedData.fetched_at).getTime();
      if (cacheAge < cacheTTL * 1000) {
        cacheHit = true;
        console.log(`[${correlationId}] Cache hit - returning cached safety ratings`);
        
        const elapsedMs = Date.now() - startTime;
        console.log(`[${correlationId}] Request completed in ${elapsedMs}ms (cache hit)`);
        
        return new Response(
          JSON.stringify({
            vin: vin || cachedData.vin,
            year: year,
            make: make,
            model: model,
            trim: trim,
            ratings: {
              overall_rating: cachedData.overall_rating,
              frontal_crash: cachedData.frontal_crash,
              side_crash: cachedData.side_crash,
              rollover: cachedData.rollover
            },
            safety_flags: cachedData.safety_flags || {},
            degraded: false,
            cached: true,
            fetched_at: cachedData.fetched_at,
            elapsedMs: elapsedMs
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Cache miss - fetch from NHTSA SafetyRatings API
    console.log(`[${correlationId}] Cache miss - fetching from NHTSA SafetyRatings API`);

    const nhtsaUrl = `https://api.nhtsa.gov/SafetyRatings/modelyear/${year}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(model)}`;
    const timeout = 5000; // 5 seconds
    const maxRetries = 2;
    let lastError: Error | null = null;
    let nhtsaData: any = null;

    // Retry logic
    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        console.log(`[${correlationId}] NHTSA SafetyRatings API attempt ${attempt}/${maxRetries + 1}: ${nhtsaUrl}`);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        const response = await fetch(nhtsaUrl, {
          signal: controller.signal,
          headers: {
            'User-Agent': 'AIN-Safety-Engine/1.0',
            'Accept': 'application/json'
          }
        });
        
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`NHTSA SafetyRatings API HTTP ${response.status}: ${response.statusText}`);
        }

        nhtsaData = await response.json();
        console.log(`[${correlationId}] NHTSA SafetyRatings API success on attempt ${attempt}`);
        break;

      } catch (error) {
        lastError = error as Error;
        console.warn(`[${correlationId}] NHTSA SafetyRatings API attempt ${attempt} failed:`, error.message);
        
        if (attempt <= maxRetries) {
          // Wait before retry (exponential backoff)
          const delay = 500 * Math.pow(2, attempt - 1);
          console.log(`[${correlationId}] Retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
        }
      }
    }

    // If all attempts failed, mark as degraded and return cached data if available
    if (!nhtsaData) {
      degraded = true;
      console.error(`[${correlationId}] All NHTSA SafetyRatings API attempts failed. Last error:`, lastError?.message);
      
      // Return stale cache if available
      if (cachedData && Object.keys(cachedData).length > 0) {
        const elapsedMs = Date.now() - startTime;
        console.log(`[${correlationId}] Request completed in ${elapsedMs}ms (degraded, stale cache)`);
        
        return new Response(
          JSON.stringify({
            vin: vin || cachedData.vin,
            year: year,
            make: make,
            model: model,
            ratings: {
              overall_rating: cachedData.overall_rating,
              frontal_crash: cachedData.frontal_crash,
              side_crash: cachedData.side_crash,
              rollover: cachedData.rollover
            },
            safety_flags: cachedData.safety_flags || {},
            degraded: true,
            cached: true,
            stale: true,
            fetched_at: cachedData.fetched_at,
            error: "NHTSA SafetyRatings API unavailable",
            elapsedMs: elapsedMs
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      // No cache available
      const elapsedMs = Date.now() - startTime;
      console.log(`[${correlationId}] Request completed in ${elapsedMs}ms (degraded, no cache)`);
      
      return new Response(
        JSON.stringify({
          vin: vin,
          year: year,
          make: make,
          model: model,
          ratings: {},
          degraded: true,
          error: "NHTSA SafetyRatings API unavailable",
          elapsedMs: elapsedMs
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Normalize NHTSA SafetyRatings response
    const results = Array.isArray(nhtsaData.Results) ? nhtsaData.Results : [];
    let safetyRatings = null;
    let safetyFlags = {};

    if (results.length > 0) {
      // Take the first result or try to find best match
      const result = results[0];
      
      safetyRatings = {
        overall_rating: parseInt(result.OverallRating) || null,
        frontal_crash: parseInt(result.OverallFrontCrashRating) || null,
        side_crash: parseInt(result.OverallSideCrashRating) || null,
        rollover: parseInt(result.RolloverRating) || null
      };

      // Collect additional safety flags
      safetyFlags = {
        nhtsa_id: result.VehicleId,
        vehicle_description: result.VehicleDescription,
        model_year: result.ModelYear,
        vehicle_picture: result.VehiclePicture,
        safety_rating_2018_present: result.SafetyRating2018Present,
        raw_data: result
      };

      console.log(`[${correlationId}] Normalized safety ratings:`, safetyRatings);
    } else {
      console.log(`[${correlationId}] No safety ratings found in NHTSA response`);
      safetyRatings = {
        overall_rating: null,
        frontal_crash: null,
        side_crash: null,
        rollover: null
      };
    }

    // Cache the results if we have a VIN
    if (vin && (safetyRatings.overall_rating || safetyRatings.frontal_crash || safetyRatings.side_crash || safetyRatings.rollover)) {
      try {
        const { data: cacheResult, error: cacheError } = await supabase
          .rpc('rpc_upsert_safety', { 
            vin_param: vin,
            year_param: year,
            make_param: make,
            model_param: model,
            trim_param: trim,
            overall_rating_param: safetyRatings.overall_rating,
            frontal_crash_param: safetyRatings.frontal_crash,
            side_crash_param: safetyRatings.side_crash,
            rollover_param: safetyRatings.rollover,
            safety_flags_param: safetyFlags,
            nhtsa_id_param: safetyFlags.nhtsa_id,
            vehicle_description_param: safetyFlags.vehicle_description
          });

        if (cacheError) {
          console.warn(`[${correlationId}] Failed to cache safety ratings:`, cacheError);
          degraded = true;
        } else {
          console.log(`[${correlationId}] Cached safety ratings successfully:`, cacheResult);
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
        year: year,
        make: make,
        model: model,
        trim: trim,
        ratings: safetyRatings,
        safety_flags: safetyFlags,
        degraded: degraded,
        cached: false,
        fetched_at: new Date().toISOString(),
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
