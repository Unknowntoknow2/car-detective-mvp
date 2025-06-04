// ✅ File: supabase/functions/fetch-statvin/index.ts

// @ts-nocheck
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req: Request) => {
  const { vin } = await req.json();
  if (!vin || typeof vin !== "string") {
    return new Response(JSON.stringify({ error: "VIN is required" }), {
      status: 400,
    });
  }

  const url = `https://stat.vin/vin/${vin}`;
  const headers = {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115 Safari/537.36",
    "Accept-Language": "en-US,en;q=0.9",
  };

  try {
    const res = await fetch(url, { headers });
    const html = await res.text();

    if (!html.includes(vin)) {
      console.warn("[Stat.VIN] No match for VIN:", vin);
      return new Response(null, { status: 204 });
    }

    // Simple parsing - production should use regex or DOM parser
    const extract = (pattern: string) => {
      const match = html.match(pattern);
      return match ? match[1].trim() : null;
    };

    const data = {
      vin,
      auction: extract(/Auction<\/div>\s*<div class=".*?">([^<]+)<\/div>/),
      lot_number: extract(
        /Lot number<\/div>\s*<div class=".*?">([^<]+)<\/div>/,
      ),
      price: extract(/\$ ([0-9,]+)/),
      location: extract(/Location<\/div>\s*<div class=".*?">([^<]+)<\/div>/),
      damage: extract(/Damage<\/div>\s*<div class=".*?">([^<]+)<\/div>/),
      mileage: extract(
        /Mileage, Miles<\/div>\s*<div class=".*?">([^<]+)<\/div>/,
      ),
      engine: extract(/Engine<\/div>\s*<div class=".*?">([^<]+)<\/div>/),
      fuel: extract(/Fuel<\/div>\s*<div class=".*?">([^<]+)<\/div>/),
      transmission: extract(
        /Transmission<\/div>\s*<div class=".*?">([^<]+)<\/div>/,
      ),
      traction: extract(/Traction<\/div>\s*<div class=".*?">([^<]+)<\/div>/),
    };

    // Extract all image URLs
    const photoMatches = [
      ...html.matchAll(/src="(https:\/\/cdn\.stat\.vin[^"]+)"/g),
    ];
    const photo_urls = photoMatches.map((m) => m[1]);

    return new Response(
      JSON.stringify({ data: { ...data, photo_urls, source: "Stat.VIN" } }),
      { headers: { "Content-Type": "application/json" }, status: 200 },
    );
  } catch (err) {
    console.error("[Stat.VIN] Error fetching VIN:", vin, err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch from Stat.VIN" }),
      {
        status: 500,
      },
    );
  }
});
