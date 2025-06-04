// ✅ File: supabase/functions/fetch-auction-history/index.ts

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

serve(async (req: Request) => {
  try {
    const { vin } = await req.json();

    if (!vin || typeof vin !== "string") {
      return new Response(JSON.stringify({ error: "VIN is required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const sources = [
      {
        name: "Bid.Cars",
        url: "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-bidcars",
      },
      {
        name: "CarsFromWest",
        url:
          "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-carsfromwest",
      },
      {
        name: "AutoBidMaster",
        url:
          "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-autobidmaster",
      },
      {
        name: "RepoKar",
        url: "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-repokar",
      },
      {
        name: "AuctionExport",
        url:
          "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-auctionexport",
      },
      {
        name: "Stat.VIN",
        url: "https://xltxqqzattxogxtqrggt.functions.supabase.co/fetch-statvin",
      },
    ];

    for (const source of sources) {
      try {
        const res = await fetch(source.url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vin }),
        });

        if (res.ok) {
          const { data } = await res.json();
          if (data) {
            return new Response(
              JSON.stringify({ source: source.name, data }),
              {
                status: 200,
                headers: { "Content-Type": "application/json" },
              },
            );
          } else {
            console.warn(`[${source.name}] No match for VIN:`, vin);
          }
        } else {
          console.warn(`[${source.name}] Failed with status:`, res.status);
        }
      } catch (err) {
        console.error(`[${source.name}] Error while fetching VIN: ${vin}`, err);
      }
    }

    return new Response(
      JSON.stringify({
        success: false,
        message: "No auction data found",
        vin,
      }),
      {
        status: 404,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("[AuctionHistory] Unexpected Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
});
