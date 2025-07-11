import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { linearRegression } from "https://esm.sh/simple-statistics@7.8.8";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const { valuationId } = await req.json();

    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: "valuationId required" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 1. Load the valuation record
    const { data: val, error: valErr } = await supabase
      .from("valuations")
      .select("make, model, estimated_value, created_at")
      .eq("id", valuationId)
      .single();

    if (valErr || !val) {
      return new Response(
        JSON.stringify({ error: "Valuation not found" }),
        {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2. Fetch historical market prices (last 12 months)
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    const { data: history } = await supabase
      .from("market_listings")
      .select("price, listing_date")
      .eq("make", val.make)
      .eq("model", val.model)
      .gte("listing_date", startDate.toISOString())
      .order("listing_date", { ascending: true });

    // Group prices by month
    const monthlyPrices =
      history?.reduce((acc: Record<string, number[]>, curr) => {
        const month = new Date(curr.listing_date).toLocaleString("default", {
          month: "short",
          year: "numeric",
        });
        if (!acc[month]) acc[month] = [];
        acc[month].push(curr.price);
        return acc;
      }, {}) ?? {};

    // Calculate monthly averages
    const monthlyAverages = Object.entries(monthlyPrices).map((
      [month, prices],
    ) => ({
      month,
      avg_price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
    }));

    console.log(`🔍 Forecast Debug for ${val.make} ${val.model}:`);
    console.log(`📊 ValuationId: ${valuationId}, Estimated Value: $${val.estimated_value}`);
    console.log(`📈 Market History Count: ${history?.length || 0}`);
    console.log(`📅 Monthly Averages:`, monthlyAverages);

    // 3. Run forecast model
    const { months, values } = runLinearForecast(
      monthlyAverages.map((h) => h.avg_price),
      monthlyAverages.map((h) => h.month),
      val.estimated_value
    );

    console.log(`📊 Forecast Results - Months:`, months);
    console.log(`💰 Forecast Results - Values:`, values);

    // Calculate confidence metrics
    const priceRange = Math.max(...values) - Math.min(...values);
    const volatility = priceRange / val.estimated_value;
    const confidenceScore = Math.round(100 * (1 - volatility));

    const trend = values[values.length - 1] > values[0]
      ? "increasing"
      : values[values.length - 1] < values[0]
      ? "decreasing"
      : "stable";

    return new Response(
      JSON.stringify({
        months,
        values,
        trend,
        confidenceScore,
        percentageChange:
          ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(
            1,
          ),
        bestTimeToSell: trend === "decreasing"
          ? "As soon as possible"
          : trend === "increasing"
          ? months[months.length - 1]
          : "Current market is stable",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// Linear forecast function with fallback logic
function runLinearForecast(historicalPrices: number[], historicalMonths: string[], baseValue: number) {
  console.log(`🧮 Running forecast with ${historicalPrices.length} historical prices`);
  
  // Generate next 12 months
  const futureMonths = [];
  const currentDate = new Date();
  
  for (let i = 1; i <= 12; i++) {
    const futureDate = new Date(currentDate);
    futureDate.setMonth(currentDate.getMonth() + i);
    futureMonths.push(futureDate.toLocaleString("default", {
      month: "short",
      year: "numeric",
    }));
  }

  let forecastValues: number[];

  if (historicalPrices.length >= 2) {
    // Use linear regression when we have sufficient data
    try {
      const dataPoints = historicalPrices.map((price, index) => [index, price]);
      const regression = linearRegression(dataPoints);
      
      console.log(`📈 Linear regression: slope=${regression.m}, intercept=${regression.b}`);
      
      // Generate forecast values
      forecastValues = futureMonths.map((_, index) => {
        const x = historicalPrices.length + index;
        const predictedValue = regression.m * x + regression.b;
        return Math.round(Math.max(predictedValue, baseValue * 0.5)); // Don't go below 50% of base value
      });
    } catch (error) {
      console.log(`⚠️ Linear regression failed, using fallback: ${error.message}`);
      forecastValues = generateFallbackForecast(baseValue, futureMonths.length);
    }
  } else {
    console.log(`⚠️ Insufficient historical data (${historicalPrices.length} points), using fallback`);
    forecastValues = generateFallbackForecast(baseValue, futureMonths.length);
  }

  console.log(`✅ Final forecast values:`, forecastValues);
  
  return {
    months: futureMonths,
    values: forecastValues,
  };
}

// Fallback forecast when no historical data exists
function generateFallbackForecast(baseValue: number, monthCount: number): number[] {
  const values = [];
  const randomVariation = baseValue * 0.05; // 5% variation
  
  for (let i = 0; i < monthCount; i++) {
    const variation = (Math.random() - 0.5) * randomVariation;
    const monthlyDepreciation = baseValue * 0.003; // 0.3% monthly depreciation
    const value = baseValue - (monthlyDepreciation * i) + variation;
    values.push(Math.round(Math.max(value, baseValue * 0.7))); // Don't depreciate below 70%
  }
  
  return values;
}
