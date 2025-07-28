import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const { vin } = await req.json();

    if (!vin || typeof vin !== "string" || vin.length !== 17) {
      return new Response(JSON.stringify({ error: "Invalid VIN format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // No JWT or Authorization header checks at all!

    // Option 1: Use live NHTSA API (as in your code)
    const decodeUrl = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${vin}?format=json`;
    const external = await fetch(decodeUrl);
    const data = await external.json();

    return new Response(JSON.stringify({ success: true, decodedData: data.Results }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });

    // Option 2: Use mock response (uncomment if you want to avoid live fetch)
    /*
    return new Response(JSON.stringify({
      vin,
      year: 2017,
      make: "Ford",
      model: "F-150",
      trim: "XLT",
      engine: "3.5L V6",
      decoded: true
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
    */
  } catch (err) {
    console.error("VIN decoding error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});// force redeploy Fri Jul 25 23:35:16 UTC 2025
