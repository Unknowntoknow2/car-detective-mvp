// Deno — Supabase Edge Function. Traces AIN vs local. Real AIN only.
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const USE_AIN = (Deno.env.get("USE_AIN_VALUATION") ?? "").toLowerCase() === "true";
const AIN_BASE = Deno.env.get("AIN_UPSTREAM_URL") ?? ""; // real endpoint
const AIN_KEY = Deno.env.get("AIN_API_KEY") ?? ""; // real key

function cid(req: Request) { 
  return req.headers.get("x-correlation-id") ?? crypto.randomUUID(); 
}

function sanitize(h: Headers) { 
  const o = new Headers(h); 
  o.delete("authorization"); 
  o.delete("cookie"); 
  return o; 
}

function upstreamUrl(req: Request) {
  const incoming = new URL(req.url);
  const base = new URL(AIN_BASE);
  const stripped = incoming.pathname.replace(/^(?:\/)?functions\/v1\/valuation/, "");
  const path = stripped || "/valuation";
  const url = new URL(path, base); 
  url.search = incoming.search; 
  return url;
}

serve(async (req) => {
  const started = performance.now();
  const corrId = cid(req);
  const method = req.method;
  const route: "ain" | "local" = USE_AIN && AIN_BASE && AIN_KEY ? "ain" : "local";

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-correlation-id',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const bodyText = await req.text();

    if (route === "ain") {
      const url = upstreamUrl(req);
      const headers = new Headers(sanitize(req.headers));
      headers.set("authorization", `Bearer ${AIN_KEY}`);
      headers.set("x-correlation-id", corrId);

      const res = await fetch(url, { 
        method, 
        headers, 
        body: ["GET","HEAD"].includes(method) ? undefined : bodyText 
      });

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

      const hdr = new Headers(res.headers);
      // Add CORS headers
      Object.entries(corsHeaders).forEach(([key, value]) => {
        hdr.set(key, value);
      });
      hdr.set("x-ain-route", route);
      hdr.set("x-correlation-id", corrId);
      hdr.set("x-upstream-status", String(res.status));
      
      return new Response(res.body, { status: res.status, headers: hdr });
    }

    // Local disabled — explicit 501
    const hdr = new Headers({ 
      ...corsHeaders,
      "content-type": "application/json", 
      "x-ain-route": route, 
      "x-correlation-id": corrId 
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
      "x-correlation-id": corrId 
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