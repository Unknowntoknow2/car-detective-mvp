// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  const { vin } = await req.json();
  if (!vin) return new Response(null, { status: 400 });

  try {
    const res = await fetch(`https://carsfromwest.com/search?query=${vin}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0 Safari/537.36",
      },
    });

    const text = await res.text();
    if (!text.includes(vin)) {
      console.warn("[CarsFromWest] No match for VIN:", vin);
      return new Response(null, { status: 204 });
    }

    return new Response(
      JSON.stringify({ data: { vin, source: "CarsFromWest" } }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("[CarsFromWest] Error fetching VIN:", vin, err);
    return new Response(null, { status: 500 });
  }
});
