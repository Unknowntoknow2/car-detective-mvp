// ✅ File: supabase/functions/fetch-bidcars/index.ts
// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ✅ Step 1: Load env secrets
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

console.log("[BOOT] fetch-bidcars function starting...");
console.log("[DEBUG] SUPABASE_URL:", SUPABASE_URL);
console.log("[DEBUG] SERVICE_ROLE_KEY_SET:", !!SUPABASE_SERVICE_ROLE_KEY);

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("[ERROR] Missing Supabase secrets in env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ Step 2: Main fetcher
async function fetchFromBidCars(vin: string) {
  const url = `https://bid.cars/api/v1/vin/${vin}`;
  console.log(`[Bid.Cars] Fetching VIN: ${vin}`);

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
      },
    });

    console.log(`[Bid.Cars] Response Status: ${res.status}`);

    if (!res.ok) return null;
    const json = await res.json();
    console.log("[Bid.Cars] Response JSON:", JSON.stringify(json, null, 2));

    const v = json.vehicle;
    if (!v) return null;

    return {
      vin,
      sold_date: v.soldDate || new Date().toISOString(),
      price: v.price || "$0",
      odometer: v.odometer || "Unknown",
      condition_grade: v.grade || "Unknown",
      auction_source: "Bid.Cars",
      photo_urls: v.images || [],
    };
  } catch (err) {
    console.error("[Bid.Cars] Fetch Error:", err);
    return null;
  }
}

// ✅ Step 3: Request handler
serve(async (req) => {
  console.log("[Handler] fetch-bidcars function triggered");

  try {
    const { vin } = await req.json();
    console.log("[Handler] VIN received:", vin);

    if (!vin || typeof vin !== "string") {
      return new Response(JSON.stringify({ error: "VIN is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = await fetchFromBidCars(vin);

    if (!data) {
      console.warn("[Handler] No auction data found");
      return new Response(
        JSON.stringify({ success: false, message: "No auction data", vin }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error } = await supabase
      .from("auction_results_by_vin")
      .upsert(data, { onConflict: "vin" });

    if (error) {
      console.error("[Supabase] Insert error:", error.message);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[Handler] Unexpected error:", err);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
