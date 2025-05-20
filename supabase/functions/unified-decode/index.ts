// supabase/functions/unified-decode/index.ts

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

// Helper to extract value from NHTSA results array
function getField(results: any[], fieldName: string): string | undefined {
  const entry = results.find((item: any) => item.Variable === fieldName);
  return entry && entry.Value !== null && entry.Value !== "Not Applicable" ? entry.Value : undefined;
}

serve(async (req) => {
  try {
    const { vin } = await req.json();

    if (!vin || typeof vin !== "string") {
      return new Response(
        JSON.stringify({ success: false, error: "VIN is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch decoded vehicle data from NHTSA
    const nhtsaRes = await fetch(
      `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${encodeURIComponent(vin)}?format=json`
    );
    const nhtsaData = await nhtsaRes.json();

    if (!nhtsaData || !nhtsaData.Results) {
      return new Response(
        JSON.stringify({ success: false, error: "No data from NHTSA" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Extract and normalize key fields
    const results = nhtsaData.Results;
    const vehicle = {
      vin,
      make: getField(results, "Make"),
      model: getField(results, "Model"),
      year: getField(results, "Model Year"),
      trim: getField(results, "Trim"),
      bodyType: getField(results, "Body Class"),
      engine: getField(results, "Engine Model") || getField(results, "Engine Manufacturer
