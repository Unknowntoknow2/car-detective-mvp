
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { corsHeaders } from '../_shared/cors.ts'

interface MarketPrice {
  month: string;
  avg_price: number;
}

function runLinearForecast(prices: number[], months: string[]) {
  // Simple linear regression implementation
  const n = prices.length;
  const x = Array.from({ length: n }, (_, i) => i);
  
  // Calculate means
  const meanX = x.reduce((a, b) => a + b, 0) / n;
  const meanY = prices.reduce((a, b) => a + b, 0) / n;
  
  // Calculate coefficients
  let numerator = 0;
  let denominator = 0;
  
  for (let i = 0; i < n; i++) {
    numerator += (x[i] - meanX) * (prices[i] - meanY);
    denominator += Math.pow(x[i] - meanX, 2);
  }
  
  const m = numerator / denominator;
  const b = meanY - m * meanX;
  
  // Project next 12 months
  const start = prices.length;
  const forecastMonths = Array.from({ length: 12 }, (_, i) => {
    const date = new Date(months[months.length - 1]);
    date.setMonth(date.getMonth() + i + 1);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
  });
  
  const forecastValues = forecastMonths.map((_, i) => 
    Math.round(m * (start + i) + b)
  );
  
  return { months: forecastMonths, values: forecastValues };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { valuationId } = await req.json()
    
    if (!valuationId) {
      return new Response(
        JSON.stringify({ error: 'valuationId required' }), 
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 1. Load the valuation record
    const { data: val, error: valErr } = await supabase
      .from('valuations')
      .select('make, model, estimated_value, created_at')
      .eq('id', valuationId)
      .single()
    
    if (valErr || !val) {
      return new Response(
        JSON.stringify({ error: 'Valuation not found' }), 
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // 2. Fetch historical market prices (last 12 months)
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 12)
    
    const { data: history } = await supabase
      .from('market_listings')
      .select('price, listing_date')
      .eq('make', val.make)
      .eq('model', val.model)
      .gte('listing_date', startDate.toISOString())
      .order('listing_date', { ascending: true })

    // Group prices by month
    const monthlyPrices = history?.reduce((acc: Record<string, number[]>, curr) => {
      const month = new Date(curr.listing_date).toLocaleString('default', { month: 'short', year: 'numeric' })
      if (!acc[month]) acc[month] = []
      acc[month].push(curr.price)
      return acc
    }, {}) ?? {}

    // Calculate monthly averages
    const monthlyAverages: MarketPrice[] = Object.entries(monthlyPrices).map(([month, prices]) => ({
      month,
      avg_price: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
    }))

    // 3. Run forecast model
    const { months, values } = runLinearForecast(
      monthlyAverages.map(h => h.avg_price),
      monthlyAverages.map(h => h.month)
    )

    // Calculate confidence metrics
    const priceRange = Math.max(...values) - Math.min(...values)
    const volatility = priceRange / val.estimated_value
    const confidenceScore = Math.round(100 * (1 - volatility))
    
    const trend = values[values.length - 1] > values[0] ? 'increasing' : 
                 values[values.length - 1] < values[0] ? 'decreasing' : 'stable'

    return new Response(
      JSON.stringify({
        months,
        values,
        trend,
        confidenceScore,
        percentageChange: ((values[values.length - 1] - values[0]) / values[0] * 100).toFixed(1),
        bestTimeToSell: trend === 'decreasing' ? 'As soon as possible' : 
                       trend === 'increasing' ? months[months.length - 1] : 
                       'Current market is stable'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
