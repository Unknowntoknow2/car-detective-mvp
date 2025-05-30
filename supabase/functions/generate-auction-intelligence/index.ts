
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AuctionResult {
  vin: string;
  price: string;
  sold_date: string;
  auction_source: string;
  odometer: string;
  condition_grade?: string;
  location?: string;
}

interface PriceTrend {
  prices: Array<{
    price: number;
    date: string;
    source: string;
  }>;
  direction: 'upward' | 'downward' | 'stable';
  volatility: number;
}

interface FlipFlags {
  detected: boolean;
  count: number;
  alerts: Array<{
    type: 'rapid_resale' | 'price_drop' | 'damage_escalation';
    description: string;
    days_between: number;
  }>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { vin } = await req.json()

    if (!vin) {
      return new Response(
        JSON.stringify({ error: 'VIN is required' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log(`Generating auction intelligence for VIN: ${vin}`)

    // Fetch all auction results for this VIN
    const { data: auctionResults, error: auctionError } = await supabase
      .from('auction_results_by_vin')
      .select('*')
      .eq('vin', vin)
      .order('sold_date', { ascending: false })

    if (auctionError) {
      console.error('Error fetching auction results:', auctionError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch auction data' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    const results = auctionResults || []
    console.log(`Found ${results.length} auction records for VIN: ${vin}`)

    // Process auction intelligence
    const intelligence = await processAuctionIntelligence(results)

    // Save to database
    const { error: saveError } = await supabase
      .from('auction_intelligence_by_vin')
      .upsert({
        vin,
        price_trend: intelligence.priceTrend,
        flip_flags: intelligence.flipFlags,
        auction_conflict: intelligence.auctionConflict,
        latest_sale: intelligence.latestSale,
        risk_score: intelligence.riskScore,
        updated_at: new Date().toISOString()
      })

    if (saveError) {
      console.error('Error saving auction intelligence:', saveError)
      return new Response(
        JSON.stringify({ error: 'Failed to save intelligence data' }), 
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Successfully generated auction intelligence for VIN: ${vin}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        intelligence,
        recordsProcessed: results.length 
      }), 
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Error in generate-auction-intelligence:', error)
    
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

async function processAuctionIntelligence(results: AuctionResult[]) {
  const priceTrend: PriceTrend = {
    prices: [],
    direction: 'stable',
    volatility: 0
  }

  const flipFlags: FlipFlags = {
    detected: false,
    count: 0,
    alerts: []
  }

  let auctionConflict = false
  let latestSale = null
  let riskScore = 0

  if (results.length === 0) {
    return { priceTrend, flipFlags, auctionConflict, latestSale, riskScore }
  }

  // Sort by date and process price trend
  const sortedResults = results
    .filter(r => r.price && r.sold_date)
    .sort((a, b) => new Date(a.sold_date).getTime() - new Date(b.sold_date).getTime())

  if (sortedResults.length === 0) {
    return { priceTrend, flipFlags, auctionConflict, latestSale, riskScore }
  }

  // Build price trend
  priceTrend.prices = sortedResults.map(result => ({
    price: parseFloat(result.price || '0'),
    date: result.sold_date,
    source: result.auction_source
  }))

  // Calculate direction and volatility
  if (priceTrend.prices.length > 1) {
    const prices = priceTrend.prices.map(p => p.price)
    const firstPrice = prices[0]
    const lastPrice = prices[prices.length - 1]
    
    if (lastPrice > firstPrice * 1.1) {
      priceTrend.direction = 'upward'
    } else if (lastPrice < firstPrice * 0.9) {
      priceTrend.direction = 'downward'
    }

    // Calculate volatility as coefficient of variation
    const mean = prices.reduce((a, b) => a + b, 0) / prices.length
    const variance = prices.reduce((acc, price) => acc + Math.pow(price - mean, 2), 0) / prices.length
    priceTrend.volatility = Math.sqrt(variance) / mean
  }

  // Detect flips
  for (let i = 1; i < sortedResults.length; i++) {
    const prev = sortedResults[i - 1]
    const curr = sortedResults[i]
    
    const daysBetween = Math.abs(
      (new Date(curr.sold_date).getTime() - new Date(prev.sold_date).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysBetween <= 30) {
      flipFlags.detected = true
      flipFlags.count++
      flipFlags.alerts.push({
        type: 'rapid_resale',
        description: `Resold within ${Math.round(daysBetween)} days`,
        days_between: Math.round(daysBetween)
      })
    }

    const prevPrice = parseFloat(prev.price || '0')
    const currPrice = parseFloat(curr.price || '0')
    
    if (currPrice < prevPrice * 0.8) {
      flipFlags.alerts.push({
        type: 'price_drop',
        description: `Price dropped ${Math.round(((prevPrice - currPrice) / prevPrice) * 100)}%`,
        days_between: Math.round(daysBetween)
      })
    }
  }

  // Check for auction conflicts (same VIN from multiple sources on same day)
  const dateSourceMap = new Map()
  for (const result of sortedResults) {
    const key = result.sold_date
    if (dateSourceMap.has(key)) {
      if (dateSourceMap.get(key) !== result.auction_source) {
        auctionConflict = true
        break
      }
    } else {
      dateSourceMap.set(key, result.auction_source)
    }
  }

  // Set latest sale
  latestSale = sortedResults[sortedResults.length - 1]

  // Calculate risk score (0-100)
  riskScore = 0
  if (flipFlags.detected) riskScore += 30
  if (flipFlags.count > 2) riskScore += 20
  if (priceTrend.direction === 'downward') riskScore += 25
  if (priceTrend.volatility > 0.3) riskScore += 15
  if (auctionConflict) riskScore += 10

  riskScore = Math.min(riskScore, 100)

  return { priceTrend, flipFlags, auctionConflict, latestSale, riskScore }
}
