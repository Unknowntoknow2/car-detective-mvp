// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  const { vin } = await req.json();
  if (!vin) return new Response(null, { status: 400 });

  try {
    const res = await fetch(`https://repokar.com/search?q=${vin}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/102 Safari/537.36",
      },
    });

    const html = await res.text();
    if (!html.includes(vin)) {
      console.warn("[RepoKar] No match for VIN:", vin);
      return new Response(null, { status: 204 });
    }

    return new Response(JSON.stringify({ data: { vin, source: "RepoKar" } }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[RepoKar] Error fetching VIN:", vin, err);
    return new Response(null, { status: 500 });
  }
});
