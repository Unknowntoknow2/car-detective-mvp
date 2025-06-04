// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  const { vin } = await req.json();
  if (!vin) return new Response(null, { status: 400 });

  try {
    const res = await fetch(
      `https://www.autobidmaster.com/search?query=${vin}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/114 Safari/537.36",
        },
      },
    );

    const text = await res.text();
    if (!text.includes(vin)) {
      console.warn("[AutoBidMaster] No match for VIN:", vin);
      return new Response(null, { status: 204 });
    }

    return new Response(
      JSON.stringify({ data: { vin, source: "AutoBidMaster" } }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[AutoBidMaster] Error fetching VIN:", vin, err);
    return new Response(null, { status: 500 });
  }
});
