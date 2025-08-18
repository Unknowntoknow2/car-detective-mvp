/// <reference path="../../types/node-shim.d.ts" />
const json=(o:unknown,s=200)=>new Response(JSON.stringify(o),{status:s,headers:{"content-type":"application/json"}});

import { createClient } from "@supabase/supabase-js";
const port = Number(Deno.env.get("PORT") ?? "8000");

Deno.serve({ port }, async (req: Request) => {
  if (req.method === "GET") {
    const url = new URL(req.url);
    const vin = url.searchParams.get("vin") ?? "";
    if (!vin) return new Response(JSON.stringify({ error: "vin must be a non-empty string" }), { status: 400, headers: { "content-type": "application/json" } });
    return new Response(JSON.stringify({ ok: true, vin }), { headers: { "content-type": "application/json" } });
  }
    if (req.method === "GET") {
      const url = new URL(req.url);
      const vin = url.searchParams.get("vin") ?? "";
      if (!vin) return json({ error: "vin must be a non-empty string" }, 400);
      return json({ ok: true, vin });
    }
  try {
    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    console.log("backfill called");
    const vin = typeof (body as any).vin === "string" ? (body as any).vin : "";

    if (!vin) {
      return new Response(JSON.stringify({ error: "vin must be a non-empty string" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    // TODO: implement real backfill logic
    return new Response(JSON.stringify({ ok: true, vin }), {
      headers: { "content-type": "application/json" },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
});
