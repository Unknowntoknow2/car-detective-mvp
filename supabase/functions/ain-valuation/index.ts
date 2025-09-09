import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const AIN_API_URL = Deno.env.get("AIN_API_URL")!;
const AIN_API_KEY = Deno.env.get("AIN_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

// Initialize Supabase client for auth verification
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ORIGINS = new Set([
  "https://xltxqqzattxogxtqrggt.lovable.app",
  "http://localhost:8080",
  "http://localhost:5173"
]);

function cors(origin: string | null) {
  const ok = origin && ORIGINS.has(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin! : "null",
    "Vary": "Origin",
    "Access-Control-Allow-Headers": "authorization,content-type,x-client-info,apikey",
    "Access-Control-Allow-Methods": "POST,OPTIONS"
  };
}

// Simple rate limiter (in-memory, per-user)
const rateLimits = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_WINDOW = 60000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userLimit = rateLimits.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimits.set(userId, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }
  
  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }
  
  userLimit.count++;
  return true;
}

serve(async (req) => {
  const hdr = cors(req.headers.get("origin"));
  if (req.method === "OPTIONS") return new Response(null, { headers: hdr });

  try {
    // Verify Supabase JWT
    const auth = req.headers.get("authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }), 
        { status: 401, headers: { ...hdr, "Content-Type": "application/json" }}
      );
    }

    const token = auth.replace("Bearer ", "");
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "invalid_token" }), 
        { status: 401, headers: { ...hdr, "Content-Type": "application/json" }}
      );
    }

    // Rate limiting
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: "rate_limited" }), 
        { status: 429, headers: { ...hdr, "Content-Type": "application/json" }}
      );
    }

    const input = await req.json();
    const { vin, make, model, year, mileage, condition, zip, trim } = input ?? {};
    
    // Minimal validation
    if (!year || (!vin && !(make && model))) {
      return new Response(
        JSON.stringify({ error: "invalid_input", detail: "Missing required fields: year and (vin or make+model)" }), 
        { status: 400, headers: { ...hdr, "Content-Type": "application/json" }}
      );
    }

    console.log(`🚀 AIN Valuation Request for user ${user.id}:`, { 
      vin: vin?.substring(0, 8) + "...", make, model, year 
    });

    // Timeout controller
    const ac = new AbortController();
    const timeoutId = setTimeout(() => ac.abort(), 30000);

    const res = await fetch(`${AIN_API_URL}/valuation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${AIN_API_KEY}`,
      },
      body: JSON.stringify({ vin, make, model, year, mileage, condition, zip, trim }),
      signal: ac.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!res.ok) {
      console.error(`❌ AIN API Error: ${res.status} ${res.statusText}`);
      return new Response(
        JSON.stringify({ error: "upstream_error", status: res.status }), 
        { status: 502, headers: { ...hdr, "Content-Type": "application/json" }}
      );
    }

    const ain = await res.json();
    console.log(`✅ AIN API Success:`, { 
      value: ain.estimated_value, 
      confidence: ain.confidence_score 
    });

    // Normalize response for frontend
    const normalized = {
      finalValue: ain.estimated_value ?? 0,
      priceRange: ain.price_range ?? [
        Math.round((ain.estimated_value ?? 0) * 0.9),
        Math.round((ain.estimated_value ?? 0) * 1.1)
      ],
      confidenceScore: ain.confidence_score ?? 0,
      marketListingsCount: ain.listing_count ?? ain.market_data?.comparables_count ?? 0,
      adjustments: ain.adjustments ?? [],
      explanation: `Valuation provided by AIN API. Based on ${ain.listing_count || 'multiple'} market comparables.`,
      sourcesUsed: ["AIN_API"]
    };

    return new Response(
      JSON.stringify(normalized), 
      { status: 200, headers: { ...hdr, "Content-Type": "application/json" }}
    );

  } catch (e) {
    const status = e.name === "AbortError" ? 504 : 500;
    const errorType = e.name === "AbortError" ? "timeout" : "edge_failure";
    
    console.error(`🚨 Edge Function Error (${errorType}):`, e.message);
    
    return new Response(
      JSON.stringify({ error: errorType, detail: e.message }), 
      { status, headers: { ...hdr, "Content-Type": "application/json" }}
    );
  }
});