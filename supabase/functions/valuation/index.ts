// Deno — Supabase Edge Function. Traces AIN vs local. Real AIN only.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const USE_AIN = (Deno.env.get("USE_AIN_VALUATION") ?? "").toLowerCase() === "true";
const AIN_BASE = Deno.env.get("AIN_UPSTREAM_URL") ?? ""; // real endpoint
const AIN_KEY = Deno.env.get("AIN_API_KEY") ?? ""; // real key

// Security: allowed request headers
const ALLOWED_REQ_HEADERS = [
  "content-type", "x-correlation-id", "accept", "user-agent"
];

// Security: SSRF protection
const AIN_HOST_ALLOWLIST = ["api.ain.ai", "api.ain.yourdomain.com"];

function cid(req: Request) { 
  return req.headers.get("x-correlation-id") ?? crypto.randomUUID(); 
}

function sanitize(h: Headers) {
  const out = new Headers();
  for (const k of ALLOWED_REQ_HEADERS) {
    const v = h.get(k);
    if (v) out.set(k, v);
  }
  return out;
}

function upstreamUrl(req: Request) {
  const target = new URL(`${AIN_BASE}/valuation`);
  if (!AIN_HOST_ALLOWLIST.includes(target.hostname)) {
    throw new Error("upstream_rejected");
  }
  return target;
}

function stripDangerousHeaders(h: Headers) {
  const clean = new Headers(h);
  // Strip potentially dangerous headers from upstream response
  clean.delete("set-cookie");
  clean.delete("authorization");
  clean.delete("x-api-key");
  clean.delete("cookie");
  return clean;
}

serve(async (req) => {
  const started = performance.now();
  const corrId = cid(req); // Honor existing correlation ID
  const method = req.method;
  const route: "ain" | "local" = USE_AIN && AIN_BASE && AIN_KEY ? "ain" : "local";

  // CORS headers with origin allowlist for production
  const isProd = Deno.env.get("ENVIRONMENT") === "production";
  const allowedOrigins = isProd 
    ? ["https://yourdomain.com", "https://xltxqqzattxogxtqrggt.lovable.app"]
    : ["*"];
  
  const origin = req.headers.get("origin");
  const allowOrigin = isProd && origin 
    ? (allowedOrigins.includes(origin) ? origin : "null")
    : "*";

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin'
  };

  // Method enforcement
  if (!["POST", "OPTIONS"].includes(method)) {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405, 
      headers: { 
        ...corsHeaders, 
        "content-type": "application/json",
        "x-ain-route": route,
        "x-correlation-id": corrId
      }
    });
  }

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();
    
    // Payload validation
    if (bodyText.length > 1_000_000) {
      return new Response(JSON.stringify({ error: "payload_too_large" }), {
        status: 413, 
        headers: { 
          ...corsHeaders, 
          "content-type": "application/json",
          "x-ain-route": route,
          "x-correlation-id": corrId
        }
      });
    }

    // JSON validation for POST
    try { 
      JSON.parse(bodyText || "{}"); 
    } catch { 
      return new Response(JSON.stringify({ error: "invalid_json" }), {
        status: 400, 
        headers: { 
          ...corsHeaders, 
          "content-type": "application/json",
          "x-ain-route": route,
          "x-correlation-id": corrId
        }
      });
    }

    if (route === "ain") {
      const url = upstreamUrl(req);
      const headers = sanitize(req.headers);
      headers.set("authorization", `Bearer ${AIN_KEY}`);
      headers.set("x-correlation-id", corrId);

      // 10s timeout with abort controller
      const ac = new AbortController();
      const timeoutId = setTimeout(() => ac.abort(), 10_000);
      
      try {
        const res = await fetch(url, { 
          method: "POST", 
          headers, 
          body: bodyText,
          signal: ac.signal
        });
        
        clearTimeout(timeoutId);
        
        const latency = Math.round(performance.now() - started);
        console.log(JSON.stringify({ 
          ts: new Date().toISOString(), 
          level: "info", 
          event: "valuation.route", 
          route, 
          corr_id: corrId, 
          method, 
          upstream_url: url.toString(), 
          upstream_status: res.status, 
          latency_ms: latency 
        }));

        const hdr = stripDangerousHeaders(res.headers);
        // Add CORS and security headers
        Object.entries(corsHeaders).forEach(([key, value]) => {
          hdr.set(key, value);
        });
        hdr.set("x-ain-route", route);
        hdr.set("x-correlation-id", corrId);
        hdr.set("x-upstream-status", String(res.status));
        hdr.set("cache-control", "no-store");
        hdr.set("x-content-type-options", "nosniff");
        hdr.set("referrer-policy", "no-referrer");
        hdr.set("server-timing", `ain;dur=${latency}`);
        
        return new Response(res.body, { status: res.status, headers: hdr });
      } catch (err) {
        clearTimeout(timeoutId);
        if (err.name === "AbortError") {
          const hdr = new Headers({ 
            ...corsHeaders,
            "content-type": "application/json", 
            "x-ain-route": route, 
            "x-correlation-id": corrId 
          });
          return new Response(
            JSON.stringify({ error: "upstream_timeout", corr_id: corrId }), 
            { status: 504, headers: hdr }
          );
        }
        throw err; // Re-throw non-timeout errors
      }
    }

    // Local disabled — explicit 501
    const hdr = new Headers({ 
      ...corsHeaders,
      "content-type": "application/json", 
      "x-ain-route": route, 
      "x-correlation-id": corrId,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer"
    });
    return new Response(
      JSON.stringify({ error: "local_disabled", route, corr_id: corrId }), 
      { status: 501, headers: hdr }
    );
  } catch (err) {
    const hdr = new Headers({ 
      ...corsHeaders,
      "content-type": "application/json", 
      "x-ain-route": route, 
      "x-correlation-id": corrId,
      "cache-control": "no-store",
      "x-content-type-options": "nosniff", 
      "referrer-policy": "no-referrer"
    });
    console.error(JSON.stringify({ 
      ts: new Date().toISOString(), 
      level: "error", 
      event: "valuation.error", 
      corr_id: corrId, 
      message: String((err as Error)?.message ?? err) 
    }));
    return new Response(
      JSON.stringify({ error: "valuation_failed", corr_id: corrId }), 
      { status: 502, headers: hdr }
    );
  }
});